import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { CalendarIcon, Clock3Icon, GripVertical, UserIcon } from "lucide-react";
import { format } from "date-fns";
import TaskActions from "../TaskActions";

const PRIORITY_STYLES = {
  low: "bg-slate-100 text-slate-600",
  medium: "bg-amber-100 text-amber-700",
  high: "bg-rose-100 text-rose-700",
};

function getTransformStyle(transform) {
  if (!transform) return undefined;

  return {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  };
}

function getAssigneeLabel(assignedTo) {
  if (!assignedTo) return "Unassigned";

  if (typeof assignedTo === "string") return assignedTo;

  const fullName = `${assignedTo.first_name ?? ""} ${assignedTo.last_name ?? ""}`.trim();
  return fullName || assignedTo.email || "Assigned user";
}

function getAssigneeInitials(assignedTo) {
  if (!assignedTo) return "UN";

  const label = getAssigneeLabel(assignedTo);
  const parts = label.split(" ").filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }

  return label.slice(0, 2).toUpperCase();
}

const TaskCard = ({ task, isDisabled = false, isDraggingOverlay = false }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: task.id,
    disabled: isDisabled || isDraggingOverlay,
    data: {
      type: "task",
      task,
    },
  });

  const isOverdue = task.due_date && new Date(task.due_date) < new Date();
  const assigneeLabel = getAssigneeLabel(task.assigned_to);
  const priorityClass = PRIORITY_STYLES[task.priority] ?? PRIORITY_STYLES.medium;

  return (
    <article
      ref={setNodeRef}
      style={getTransformStyle(transform)}
      className={`rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-[box-shadow,transform,opacity] ${
        isDraggingOverlay
          ? "w-[288px] rotate-2 shadow-xl"
          : "hover:-translate-y-0.5 hover:shadow-md"
      } ${isDragging ? "opacity-35" : "opacity-100"}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${priorityClass}`}>
              {task.priority}
            </span>
          </div>

          <h4 className="text-sm font-semibold text-slate-900 leading-5">
            {task.title}
          </h4>

          <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">
            {task.description?.trim() || "No description"}
          </p>
        </div>

        {!isDraggingOverlay ? (
          <div className="flex items-start gap-1 shrink-0">
            <button
              type="button"
              className={`rounded-md p-1 text-slate-300 transition-colors ${
                isDisabled ? "cursor-not-allowed opacity-50" : "hover:bg-slate-100 hover:text-slate-500"
              }`}
              aria-label="Drag task"
              {...listeners}
              {...attributes}
            >
              <GripVertical className="h-4 w-4" />
            </button>

            <TaskActions task={task} />
          </div>
        ) : null}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <div
          className={`inline-flex items-center gap-1.5 text-xs font-medium ${
            isOverdue ? "text-rose-600" : "text-slate-500"
          }`}
        >
          {task.due_date ? (
            <>
              {isOverdue ? (
                <Clock3Icon className="h-3.5 w-3.5" />
              ) : (
                <CalendarIcon className="h-3.5 w-3.5" />
              )}
              <span>{format(new Date(task.due_date), "MMM d")}</span>
            </>
          ) : (
            <>
              <CalendarIcon className="h-3.5 w-3.5" />
              <span>No due date</span>
            </>
          )}
        </div>

        <div
          className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600"
          title={assigneeLabel}
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[10px] font-bold text-slate-700 shadow-sm">
            {task.assigned_to ? getAssigneeInitials(task.assigned_to) : <UserIcon className="h-3.5 w-3.5" />}
          </span>
          <span className="max-w-[84px] truncate">
            {task.assigned_to ? assigneeLabel : "Unassigned"}
          </span>
        </div>
      </div>
    </article>
  );
};

export default TaskCard;
