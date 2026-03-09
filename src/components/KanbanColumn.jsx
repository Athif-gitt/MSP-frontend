import React from 'react';
import TaskCard from './TaskCard';

const KanbanColumn = ({ column, onTaskClick }) => {
    return (
        <div className="flex-1 min-w-[320px] max-w-100 flex flex-col gap-4">
            <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${column.color}`}></span>
                    <h3 className="font-medium text-slate-700 text-sm tracking-tight">{column.title}</h3>
                    <span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded font-medium">{column.tasks.length}</span>
                </div>
            </div>

            <div className={`flex flex-col gap-3 h-full min-h-37.5 ${column.tasks.length === 0 ? 'border border-dashed border-borders rounded bg-transparent items-center justify-center p-6' : ''}`}>
                {column.tasks.length > 0 ? (
                    column.tasks.map((task) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            onClick={(taskData) => onTaskClick(taskData)}
                        />
                    ))
                ) : (
                    <div className="text-sm text-slate-400 font-medium">No tasks in this column</div>
                )}
            </div>
        </div>
    );
};

export default KanbanColumn;
