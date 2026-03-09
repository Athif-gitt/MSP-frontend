import React from 'react';

const TaskDetailPanel = ({ task, onClose }) => {
    if (!task) return null;

    return (
        <>
            {/* Overlay Backdrop */}
            <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 transition-opacity" onClick={onClose}></div>

            {/* Task Details Side Panel */}
            <div className="fixed right-0 top-0 h-full w-full sm:w-[520px] bg-white dark:bg-slate-900 shadow-2xl z-50 overflow-y-auto border-l border-slate-200 dark:border-slate-800 transition-transform transform translate-x-0">
                {/* Header */}
                <div className="sticky top-0 bg-white dark:bg-slate-900 z-10 px-6 py-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-slate-400">task_alt</span>
                        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">ID-{task.id} • Project Alpha</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400 transition-colors">
                            <span className="material-symbols-outlined">share</span>
                        </button>
                        <button className="p-2 hover:bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400 transition-colors">
                            <span className="material-symbols-outlined">more_vert</span>
                        </button>
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400 transition-colors">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                </div>

                <div className="p-6 flex flex-col gap-8">
                    {/* Title & Description Section */}
                    <div className="flex flex-col gap-4">
                        <div className="group">
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 focus:outline-none border-b border-transparent hover:border-slate-200 dark:hover:border-slate-700 py-1 transition-colors outline-none" contentEditable suppressContentEditableWarning>
                                {task.title}
                            </h1>
                        </div>
                        <div className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm">
                            <p className="mb-3">Detailed description goes here. Implement a robust authentication mechanism using OAuth2.0 standards. This include handling token refresh cycles, secure storage for JWTs in the browser, and middleware for protected routes.</p>
                        </div>
                    </div>

                    {/* Attributes Grid */}
                    <div className="grid grid-cols-2 gap-6">
                        {/* Status */}
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</label>
                            <div className="relative">
                                <select className="w-full pl-3 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-sm font-medium focus:ring-2 focus:ring-primary appearance-none outline-none text-slate-900 dark:text-white">
                                    <option>In Progress</option>
                                    <option>To Do</option>
                                    <option>Review</option>
                                    <option>Done</option>
                                </select>
                                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-lg">expand_more</span>
                            </div>
                        </div>

                        {/* Assignee */}
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Assignee</label>
                            <div className="relative">
                                <select className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-sm font-medium focus:ring-2 focus:ring-primary appearance-none outline-none text-slate-900 dark:text-white">
                                    <option>Sarah Jenkins</option>
                                    <option>Michael Chen</option>
                                    <option>Elena Rodriguez</option>
                                    <option>Unassigned</option>
                                </select>
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-primary/20 text-[10px] flex items-center justify-center font-bold text-primary">SJ</div>
                                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-lg">expand_more</span>
                            </div>
                        </div>

                        {/* Due Date */}
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Due Date</label>
                            <div className="relative group">
                                <input type="date" className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-sm font-medium focus:ring-2 focus:ring-primary cursor-pointer outline-none text-slate-900 dark:text-white" defaultValue="2023-11-24" />
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-lg">calendar_today</span>
                            </div>
                        </div>

                        {/* Priority */}
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Priority</label>
                            <div className="flex items-center gap-2 px-3 py-2.5 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                <span className="material-symbols-outlined text-red-500 text-lg">priority_high</span>
                                <span className="text-sm font-semibold text-red-600 dark:text-red-400">High</span>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="border-b border-slate-200 dark:border-slate-800 flex gap-6">
                        <button className="pb-3 border-b-2 border-primary text-primary text-sm font-semibold">Activity</button>
                        <button className="pb-3 border-b-2 border-transparent text-slate-500 dark:text-slate-400 text-sm font-medium hover:text-slate-700 transition-colors">Comments</button>
                        <button className="pb-3 border-b-2 border-transparent text-slate-500 dark:text-slate-400 text-sm font-medium hover:text-slate-700 transition-colors">Attachments (2)</button>
                    </div>

                    {/* Activity Timeline */}
                    <div className="flex flex-col gap-6 pb-12">
                        <div className="flex gap-4 relative">
                            <div className="absolute left-[15px] top-8 bottom-[-24px] w-[2px] bg-slate-100 dark:bg-slate-800"></div>
                            <div className="z-10 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-primary text-[18px]">edit_note</span>
                            </div>
                            <div className="flex flex-col gap-1 pt-1">
                                <p className="text-sm">
                                    <span className="font-semibold text-slate-900 dark:text-white">Sarah Jenkins</span> changed status to
                                    <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-xs font-bold ml-1">In Progress</span>
                                </p>
                                <span className="text-xs text-slate-400">2 hours ago</span>
                            </div>
                        </div>
                        <div className="flex gap-4 relative">
                            <div className="z-10 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-slate-400 text-[18px]">add_circle</span>
                            </div>
                            <div className="flex flex-col gap-1 pt-1">
                                <p className="text-sm">
                                    <span className="font-semibold text-slate-900 dark:text-white">Michael Chen</span> created this task
                                </p>
                                <span className="text-xs text-slate-400">Oct 24, 2023 • 10:15 AM</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Quick Actions */}
                <div className="sticky bottom-0 bg-slate-50 dark:bg-slate-800 px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center gap-3">
                    <div className="flex-1 relative">
                        <input type="text" className="w-full pl-4 pr-10 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:ring-1 focus:ring-primary outline-none text-slate-900 dark:text-white transition-all" placeholder="Add a comment..." />
                        <button className="absolute right-2 top-1/2 -translate-y-1/2 text-primary">
                            <span className="material-symbols-outlined">send</span>
                        </button>
                    </div>
                    <button onClick={onClose} className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm">
                        Save Changes
                    </button>
                </div>
            </div>
        </>
    );
};

export default TaskDetailPanel;
