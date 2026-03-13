import React from "react";
import TaskCard from "./TaskCard";

const Column = ({ title, status, tasks }) => {
  return (
    <div className="flex flex-col flex-shrink-0 w-[280px] bg-slate-50/50 rounded-xl max-h-full">
      {/* Column Header */}
      <div className="flex items-center justify-between p-3 pb-2 mb-1">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
          {title}
          <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full text-[10px] tabular-nums font-bold">
            {tasks.length}
          </span>
        </h3>
      </div>

      {/* Task List Container */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-3 pb-3 space-y-3">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}

        {tasks.length === 0 && (
          <div className="flex items-center justify-center h-24 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50">
            <span className="text-xs text-slate-400 font-medium">No tasks</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Column;
