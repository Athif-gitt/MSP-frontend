import React from 'react';

const DashboardCards = () => {
    return (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg">
                        <span className="material-symbols-outlined">rocket_launch</span>
                    </div>
                    <span className="text-emerald-500 text-xs font-bold bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full">+12%</span>
                </div>
                <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">Active Projects</h3>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">24</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-lg">
                        <span className="material-symbols-outlined">event_available</span>
                    </div>
                    <span className="text-amber-500 text-xs font-bold bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-full">3 urgent</span>
                </div>
                <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">Upcoming Deadlines</h3>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">12</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-lg">
                        <span className="material-symbols-outlined">group</span>
                    </div>
                    <span className="text-emerald-500 text-xs font-bold bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full">Active</span>
                </div>
                <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">Team Performance</h3>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">94%</p>
            </div>
        </section>
    );
};

export default DashboardCards;
