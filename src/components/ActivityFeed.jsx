import React from 'react';

const ActivityFeed = () => {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm h-full">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-slate-900 dark:text-white">Recent Activity</h3>
            </div>
            <div className="p-6">
                <div className="relative space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-slate-100 dark:before:bg-slate-800">
                    <div className="relative flex gap-4 pl-8">
                        <div className="absolute left-0 w-4 h-4 rounded-full bg-primary border-4 border-white dark:border-slate-900"></div>
                        <div>
                            <p className="text-sm font-medium text-slate-900 dark:text-white leading-tight">Sarah Chen completed <span className="text-primary font-semibold">User Authentication</span></p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">10 minutes ago</p>
                        </div>
                    </div>
                    <div className="relative flex gap-4 pl-8">
                        <div className="absolute left-0 w-4 h-4 rounded-full bg-slate-100 dark:bg-slate-800 border-4 border-white dark:border-slate-900"></div>
                        <div>
                            <p className="text-sm font-medium text-slate-900 dark:text-white leading-tight">Marcus joined the <span className="text-emerald-500 font-semibold">Project Nebula</span> team</p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">45 minutes ago</p>
                        </div>
                    </div>
                    <div className="relative flex gap-4 pl-8">
                        <div className="absolute left-0 w-4 h-4 rounded-full bg-slate-100 dark:bg-slate-800 border-4 border-white dark:border-slate-900"></div>
                        <div>
                            <p className="text-sm font-medium text-slate-900 dark:text-white leading-tight">Alex Thompson updated documentation</p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">2 hours ago</p>
                        </div>
                    </div>
                    <div className="relative flex gap-4 pl-8">
                        <div className="absolute left-0 w-4 h-4 rounded-full bg-slate-100 dark:bg-slate-800 border-4 border-white dark:border-slate-900"></div>
                        <div>
                            <p className="text-sm font-medium text-slate-900 dark:text-white leading-tight">Design review scheduled for <span className="text-amber-500 font-semibold">October 25th</span></p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">5 hours ago</p>
                        </div>
                    </div>
                </div>
                <button className="w-full mt-8 py-2 text-sm font-semibold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 rounded-lg hover:bg-slate-100 transition-colors">
                    Load more activity
                </button>
            </div>
        </div>
    );
};

export default ActivityFeed;
