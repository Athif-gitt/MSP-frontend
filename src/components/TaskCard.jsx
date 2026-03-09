import React from 'react';

const TaskCard = ({ task, onClick }) => {
    return (
        <div
            onClick={() => onClick(task)}
            className="bg-white border border-[#E5E7EB] p-4 rounded hover:border-blue-400 transition-colors cursor-pointer group shadow-none"
        >
            <div className="flex items-start justify-between mb-2">
                <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
                    {task.project_code || `TASK-${task.id.toString().padStart(2, '0')}`}
                </span>
            </div>
            <h4 className="text-sm font-medium text-slate-800 mb-4">{task.title}</h4>
            <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                    <div className="w-6 h-6 rounded-full bg-slate-100 border border-white flex items-center justify-center text-[10px] font-medium text-slate-600">
                        {task.assignee_initials || 'AT'}
                    </div>
                </div>
                <span className="text-xs text-slate-400 font-medium">{task.due_date || task.date || 'No Date'}</span>
            </div>
        </div>
    );
};

export default TaskCard;
