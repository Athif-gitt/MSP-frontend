import React, { memo } from "react";
import { useDraggable } from "@dnd-kit/core";
import { CalendarDays, GripVertical, User2 } from "lucide-react";

const PRIORITY_STYLES = {
  low: "bg-slate-100 text-slate-600",
  medium: "bg-amber-100 text-amber-700",
  high: "bg-rose-100 text-rose-700",
};

function formatDueDate(dueDate) {
  if (!dueDate) return null;

  const parsedDate = new Date(dueDate);
  if (Number.isNaN(parsedDate.getTime())) return null;

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parsedDate);
}

function getAssigneeLabel(assignedTo) {
  if (!assignedTo) return "Unassigned";

  if (typeof assignedTo === "string") {
    return assignedTo;
  }

  const fullName = `${assignedTo.first_name ?? ""} ${assignedTo.last_name ?? ""}`.trim();
  return fullName || assignedTo.email || "Assigned";
}

function TaskCardComponent({
  task,
  disabled = false,
  overlay = false,
  onClick,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: task.id,
    data: {
      type: "task",
      task,
    },
    disabled: disabled || overlay,
  });

  const dueDateLabel = formatDueDate(task.due_date);
  const assigneeLabel = getAssigneeLabel(task.assigned_to);
  const priorityClass = PRIORITY_STYLES[task.priority] ?? PRIORITY_STYLES.medium;
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <article
      ref={setNodeRef}
      style={style}
      onClick={!overlay && !disabled && onClick ? () => onClick(task) : undefined}
      className={`rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition ${
        overlay ? "w-[304px] rotate-1 shadow-xl" : "cursor-pointer hover:-translate-y-0.5 hover:shadow-md"
      } ${isDragging ? "opacity-40" : "opacity-100"}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="mb-2">
            <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${priorityClass}`}>
              {task.priority}
            </span>
          </div>

          <h3 className="text-sm font-semibold text-slate-900 leading-5">
            {task.title}
          </h3>

          <p className="mt-2 line-clamp-2 text-sm text-slate-500">
            {task.description?.trim() || "No description"}
          </p>
        </div>

        {!overlay ? (
          <button
            type="button"
            aria-label="Drag task"
            className={`rounded-lg p-1.5 text-slate-400 transition ${
              disabled ? "cursor-not-allowed opacity-50" : "cursor-grab active:cursor-grabbing hover:bg-slate-100 hover:text-slate-600"
            }`}
            onClick={(event) => event.stopPropagation()}
            {...(!overlay && !disabled ? { ...listeners, ...attributes } : {})}
          >
            <GripVertical className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1">
          <User2 className="h-3.5 w-3.5" />
          {assigneeLabel}
        </span>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1">
          <CalendarDays className="h-3.5 w-3.5" />
          {dueDateLabel || "No due date"}
        </span>
      </div>
    </article>
  );
}

const TaskCard = memo(TaskCardComponent);

export default TaskCard;
