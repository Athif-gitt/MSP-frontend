import React, { memo } from "react";
import { useDroppable } from "@dnd-kit/core";
import TaskCard from "./TaskCard";

const COLUMN_META = {
  todo: {
    title: "To Do",
    dot: "bg-slate-400",
    badge: "bg-slate-100 text-slate-700",
    highlight: "ring-slate-300 bg-slate-50",
  },
  in_progress: {
    title: "In Progress",
    dot: "bg-blue-500",
    badge: "bg-blue-100 text-blue-700",
    highlight: "ring-blue-300 bg-blue-50",
  },
  done: {
    title: "Done",
    dot: "bg-emerald-500",
    badge: "bg-emerald-100 text-emerald-700",
    highlight: "ring-emerald-300 bg-emerald-50",
  },
};

function ColumnComponent({ status, tasks, disabled = false, onTaskClick }) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
    data: {
      type: "column",
      status,
    },
    disabled,
  });

  const meta = COLUMN_META[status];

  return (
    <section
      ref={setNodeRef}
      className={`flex min-h-[480px] w-[320px] flex-shrink-0 flex-col rounded-2xl border border-slate-200 bg-white transition ${
        isOver ? `ring-2 ${meta.highlight}` : ""
      }`}
    >
      <header className="flex items-center justify-between border-b border-slate-100 px-4 py-4">
        <div className="flex items-center gap-3">
          <span className={`h-2.5 w-2.5 rounded-full ${meta.dot}`} />
          <h2 className="text-sm font-semibold text-slate-800">{meta.title}</h2>
        </div>

        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${meta.badge}`}>
          {tasks.length}
        </span>
      </header>

      <div className="flex flex-1 flex-col gap-3 p-4">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              disabled={disabled}
              onClick={onTaskClick}
            />
          ))
        ) : (
          <div className="flex flex-1 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm font-medium text-slate-400">
            No tasks
          </div>
        )}
      </div>
    </section>
  );
}

const Column = memo(ColumnComponent);

export default Column;
