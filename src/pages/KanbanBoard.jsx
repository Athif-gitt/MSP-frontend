import React, { useState } from 'react';
import KanbanColumn from '../components/KanbanColumn';
import TaskDetailPanel from '../components/TaskDetailPanel';

const KanbanBoard = () => {
    const [selectedTask, setSelectedTask] = useState(null);

    // Mock data for board columns
    const [columns] = useState([
        {
            id: 'todo',
            title: 'Todo',
            color: 'bg-slate-300',
            tasks: [
                { id: 1, project_code: 'ENG-101', title: 'Implement OAuth2 login flow', assignee_initials: 'JD', due_date: 'Oct 24' },
                { id: 2, project_code: 'DES-42', title: 'Finalize mobile-responsive navigation', assignee_initials: 'AT', due_date: 'Oct 26' },
                { id: 3, project_code: 'DOC-15', title: 'Update API documentation', assignee_initials: 'SB', due_date: 'Oct 30' }
            ]
        },
        {
            id: 'in_progress',
            title: 'In Progress',
            color: 'bg-[#2563EB]',
            tasks: [
                { id: 4, project_code: 'ENG-105', title: 'Refactor core database queries', assignee_initials: 'MK', due_date: 'Today' },
                { id: 5, project_code: 'DES-48', title: 'User testing for new dashboard components', assignee_initials: 'AT', due_date: 'Tomorrow' }
            ]
        },
        {
            id: 'done',
            title: 'Done',
            color: 'bg-emerald-500',
            tasks: [
                { id: 6, project_code: 'OPS-22', title: 'Environment staging configuration', assignee_initials: 'JD', due_date: 'Oct 15' },
            ]
        },
        {
            id: 'backlog',
            title: 'Backlog',
            color: 'bg-slate-200',
            tasks: [] // Empty state test
        }
    ]);

    return (
        <div className="flex flex-col h-full bg-[#F9FAFB]">
            <header className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold tracking-tight text-slate-900">Project Board</h1>
                </div>
                <div className="flex gap-2">
                    <button className="h-8 px-3 rounded bg-white border border-[#E5E7EB] text-slate-600 text-xs font-medium hover:bg-slate-50 transition-colors">
                        Filter
                    </button>
                    <button className="h-8 px-3 rounded bg-[#2563EB] text-white text-xs font-medium hover:bg-blue-700 transition-colors">
                        New Task
                    </button>
                </div>
            </header>

            <div className="flex gap-6 h-full overflow-x-auto pb-4 custom-scrollbar items-start">
                {columns.map(col => (
                    <KanbanColumn key={col.id} column={col} onTaskClick={setSelectedTask} />
                ))}
            </div>

            {selectedTask && (
                <TaskDetailPanel task={selectedTask} onClose={() => setSelectedTask(null)} />
            )}
        </div>
    );
};

export default KanbanBoard;
