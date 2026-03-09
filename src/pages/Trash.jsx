import React from 'react';

const Trash = () => {
    const trashedItems = [
        {
            id: 1,
            title: 'Update API Documentation for Mobile App',
            type: 'Task',
            icon: 'description',
            deletedAt: '3 days ago',
            originalProject: 'Backend API'
        },
        {
            id: 2,
            title: 'Finalize Q4 Marketing Budget',
            type: 'Task',
            icon: 'task_alt',
            deletedAt: '5 days ago',
            originalProject: 'Marketing'
        },
        {
            id: 3,
            title: 'design_system_v2_final.fig',
            type: 'File',
            icon: 'attachment',
            deletedAt: '1 week ago',
            originalProject: null
        },
        {
            id: 4,
            title: 'Employee Onboarding Checklist',
            type: 'Task',
            icon: 'description',
            deletedAt: '12 days ago',
            originalProject: 'HR & Culture'
        }
    ];

    return (
        <div className="flex flex-col flex-1 px-8 py-8 w-full max-w-5xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
                <div className="flex flex-col gap-1">
                    <h1 className="text-slate-900 dark:text-slate-100 text-4xl font-black leading-tight tracking-tight">Trash</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-base font-normal">Items here will be permanently deleted after 30 days of inactivity.</p>
                </div>
                <button className="flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30 rounded-lg text-sm font-bold transition-all border border-red-100 dark:border-red-900/30 shadow-sm">
                    <span className="material-symbols-outlined text-[18px]">delete_forever</span>
                    <span>Empty Trash</span>
                </button>
            </div>

            {/* Tab Filters */}
            <div className="mb-6">
                <div className="flex border-b border-slate-200 dark:border-slate-800 gap-8">
                    <button className="flex flex-col items-center justify-center border-b-2 border-primary text-primary pb-3 pt-2">
                        <p className="text-sm font-bold leading-normal">All Items</p>
                    </button>
                    <button className="flex flex-col items-center justify-center border-b-2 border-transparent text-slate-500 dark:text-slate-400 pb-3 pt-2 hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
                        <p className="text-sm font-bold leading-normal">Tasks</p>
                    </button>
                    <button className="flex flex-col items-center justify-center border-b-2 border-transparent text-slate-500 dark:text-slate-400 pb-3 pt-2 hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
                        <p className="text-sm font-bold leading-normal">Files</p>
                    </button>
                    <button className="flex flex-col items-center justify-center border-b-2 border-transparent text-slate-500 dark:text-slate-400 pb-3 pt-2 hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
                        <p className="text-sm font-bold leading-normal">Projects</p>
                    </button>
                </div>
            </div>

            {/* List of Deleted Items */}
            <div className="flex flex-col gap-3">
                {trashedItems.map(item => (
                    <div key={item.id} className="flex items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-primary/30 transition-all shadow-sm">
                        <div className="text-primary flex items-center justify-center rounded-lg bg-primary/10 shrink-0 size-12">
                            <span className="material-symbols-outlined text-[28px]">{item.icon}</span>
                        </div>
                        <div className="flex flex-col flex-1 justify-center min-w-0">
                            <p className="text-slate-900 dark:text-slate-100 text-base font-semibold leading-normal truncate">{item.title}</p>
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-normal leading-normal truncate">
                                Deleted {item.deletedAt} • {item.originalProject ? `Original Project: ${item.originalProject}` : item.type}
                            </p>
                        </div>
                        <div className="shrink-0 flex items-center gap-2">
                            <button className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white rounded-lg text-sm font-semibold transition-all">
                                <span className="material-symbols-outlined text-[18px]">restore</span>
                                <span className="hidden sm:inline">Restore</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer Info */}
            <div className="mt-12 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800/50 rounded-full text-slate-400 text-xs border border-slate-100 dark:border-slate-800">
                    <span className="material-symbols-outlined text-[14px]">info</span>
                    <span>Items in the trash do not count towards your workspace task limits.</span>
                </div>
            </div>
        </div>
    );
};

export default Trash;
