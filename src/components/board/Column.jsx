import React from "react";
import { useDroppable } from "@dnd-kit/core";
import TaskCard from "./TaskCard";

const ACCENT_STYLES = {
  slate: {
    badge: "bg-slate-200 text-slate-700",
    strip: "bg-slate-400",
    ring: "ring-slate-300 bg-slate-100/80",
  },
  blue: {
    badge: "bg-blue-100 text-blue-700",
    strip: "bg-blue-500",
    ring: "ring-blue-300 bg-blue-50/80",
  },
  emerald: {
    badge: "bg-emerald-100 text-emerald-700",
    strip: "bg-emerald-500",
    ring: "ring-emerald-300 bg-emerald-50/80",
  },
};

const Column = ({ title, status, tasks, accent = "slate", isUpdating = false }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: status,
    data: {
      type: "column",
      status,
    },
  });

  const accentStyles = ACCENT_STYLES[accent] ?? ACCENT_STYLES.slate;

  return (
    <section
      ref={setNodeRef}
      className={`flex flex-col flex-shrink-0 w-[320px] rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm transition-all ${
        isOver ? `ring-2 ${accentStyles.ring}` : ""
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <span className={`h-2.5 w-2.5 rounded-full ${accentStyles.strip}`} />
          <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
        </div>

        <span
          className={`px-2.5 py-1 rounded-full text-xs font-semibold tabular-nums ${accentStyles.badge}`}
        >
          {tasks.length}
        </span>
      </div>

      <div className="flex-1 min-h-[420px] overflow-y-auto custom-scrollbar p-4 space-y-3">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              isDisabled={isUpdating}
            />
          ))
        ) : (
          <div
            className={`flex items-center justify-center h-28 rounded-xl border border-dashed text-sm font-medium transition-colors ${
              isOver
                ? "border-slate-300 bg-white text-slate-500"
                : "border-slate-200 bg-slate-50 text-slate-400"
            }`}
          >
            No tasks
          </div>
        )}
      </div>
    </section>
  );
};

export default Column;
