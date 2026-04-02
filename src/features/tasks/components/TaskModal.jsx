import React, { useEffect, useMemo, useRef, useState } from "react";
import { CalendarDays, CircleAlert, X } from "lucide-react";
import { useUpdateTask } from "../hooks/useUpdateTask";
import CommentList from "../../comments/components/CommentList";

const STATUS_OPTIONS = [
  { value: "todo", label: "To Do" },
  { value: "in_progress", label: "In Progress" },
  { value: "done", label: "Done" },
];

const PRIORITY_OPTIONS = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

function getAssigneeValue(assignedTo) {
  if (!assignedTo) return "";
  if (typeof assignedTo === "string") return assignedTo;
  return assignedTo.id || "";
}

function toDateInputValue(value) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function normalizeFormState(task) {
  return {
    title: task.title || "",
    description: task.description || "",
    status: task.status || "todo",
    priority: task.priority || "medium",
    assigned_to: getAssigneeValue(task.assigned_to),
    due_date: toDateInputValue(task.due_date),
  };
}

const FOCUSABLE_SELECTOR =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

const TaskModal = ({ task, projectId, onClose }) => {
  const dialogRef = useRef(null);
  const updateTask = useUpdateTask(projectId);
  const [formState, setFormState] = useState(() => normalizeFormState(task));
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setFormState(normalizeFormState(task));
    setErrorMessage("");
  }, [task]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) {
        return;
      }

      const focusableElements = Array.from(
        dialogRef.current.querySelectorAll(FOCUSABLE_SELECTOR)
      ).filter((element) => !element.hasAttribute("disabled"));

      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    const firstFocusable = dialogRef.current?.querySelector(FOCUSABLE_SELECTOR);
    firstFocusable?.focus();
  }, []);

  const assigneeLabel = useMemo(() => {
    if (!task.assigned_to) return "Unassigned";
    if (typeof task.assigned_to === "string") return task.assigned_to;

    const fullName = `${task.assigned_to.first_name ?? ""} ${task.assigned_to.last_name ?? ""}`.trim();
    return fullName || task.assigned_to.email || "Assigned";
  }, [task.assigned_to]);

  const handleTextChange = (field) => (event) => {
    const value = event.target.value;
    setFormState((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleBlurSave = (field) => async (event) => {
    const value = event.target.value;
    const originalValue = normalizeFormState(task)[field] ?? "";

    if (value === originalValue) {
      return;
    }

    try {
      await updateTask.mutateAsync({
        taskId: task.id,
        updates: {
          [field]: value || (field === "due_date" || field === "assigned_to" ? null : ""),
        },
      });
    } catch (error) {
      setErrorMessage(
        error.response?.data?.detail ||
          Object.values(error.response?.data || {})[0]?.[0] ||
          "Failed to save changes."
      );
      setFormState((previous) => ({
        ...previous,
        [field]: originalValue,
      }));
    }
  };

  const handleSelectChange = async (field, value) => {
    const originalValue = normalizeFormState(task)[field] ?? "";

    setFormState((previous) => ({
      ...previous,
      [field]: value,
    }));
    setErrorMessage("");

    if (value === originalValue) {
      return;
    }

    try {
      await updateTask.mutateAsync({
        taskId: task.id,
        updates: {
          [field]: value,
        },
      });
    } catch (error) {
      setErrorMessage(
        error.response?.data?.detail ||
          Object.values(error.response?.data || {})[0]?.[0] ||
          "Failed to save changes."
      );
      setFormState((previous) => ({
        ...previous,
        [field]: originalValue,
      }));
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-modal-title"
        className="flex max-h-[calc(100vh-2rem)] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Task Details
            </p>
            <h2
              id="task-modal-title"
              className="mt-2 text-2xl font-semibold text-slate-900"
            >
              {task.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close task modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid flex-1 gap-6 overflow-y-auto px-6 py-6 md:grid-cols-[minmax(0,1.3fr)_320px]">
          <div className="min-h-0 space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Title</label>
              <input
                type="text"
                value={formState.title}
                onChange={handleTextChange("title")}
                onBlur={handleBlurSave("title")}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                placeholder="Task title"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Description</label>
              <textarea
                value={formState.description}
                onChange={handleTextChange("description")}
                onBlur={handleBlurSave("description")}
                className="min-h-[220px] w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                placeholder="Add task details"
              />
            </div>

            {errorMessage ? (
              <div className="flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            ) : null}

            <CommentList taskId={task.id} />
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Properties
              </p>

              <div className="mt-4 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Status</label>
                  <select
                    value={formState.status}
                    onChange={(event) =>
                      handleSelectChange("status", event.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  >
                    {STATUS_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Priority</label>
                  <select
                    value={formState.priority}
                    onChange={(event) =>
                      handleSelectChange("priority", event.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  >
                    {PRIORITY_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Assigned User
                  </label>
                  <input
                    type="text"
                    value={formState.assigned_to}
                    onChange={handleTextChange("assigned_to")}
                    onBlur={handleBlurSave("assigned_to")}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    placeholder="User ID or leave empty"
                  />
                  <p className="text-xs text-slate-500">
                    Current: {assigneeLabel}
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Due Date
                  </label>
                  <div className="relative">
                    <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="date"
                      value={formState.due_date}
                      onChange={handleTextChange("due_date")}
                      onBlur={handleBlurSave("due_date")}
                      className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 text-xs text-slate-500">
              Changes sync automatically when a field loses focus or a select changes.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
