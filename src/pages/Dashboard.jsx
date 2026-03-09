import React from 'react';
import DashboardCards from '../components/DashboardCards';
import ActivityFeed from '../components/ActivityFeed';

const Dashboard = () => {
    return (
        <div className="p-8 space-y-8">
            <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Welcome Back, Alex</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Here's an overview of your workspace for October 24th.</p>
                </div>
                <div className="flex gap-3">
                    <button className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <span className="material-symbols-outlined text-[18px]">download</span> Export
                    </button>
                    <button className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all">
                        <span className="material-symbols-outlined text-[18px]">add</span> New Project
                    </button>
                </div>
            </section>

            <DashboardCards />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <h3 className="font-bold text-slate-900 dark:text-white">Active Projects</h3>
                            <button className="text-primary text-sm font-semibold hover:underline">View All</button>
                        </div>
                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            {/* Project ListView Items */}
                            <div className="p-6 flex items-center gap-4 group cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                                <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 font-bold">NP</div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">Nebula Platform UI</h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">Last updated 2 hours ago</p>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <span className="text-xs font-medium text-slate-900 dark:text-white">75%</span>
                                    <div className="w-24 bg-slate-100 dark:bg-slate-800 h-1 rounded-full">
                                        <div className="bg-indigo-500 h-full w-3/4"></div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 flex items-center gap-4 group cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                                <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 font-bold">DS</div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">Design System v2.0</h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">Last updated 5 hours ago</p>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <span className="text-xs font-medium text-slate-900 dark:text-white">40%</span>
                                    <div className="w-24 bg-slate-100 dark:bg-slate-800 h-1 rounded-full">
                                        <div className="bg-emerald-500 h-full w-2/5"></div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 flex items-center gap-4 group cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                                <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 font-bold">MK</div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">Market Research App</h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">Last updated yesterday</p>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <span className="text-xs font-medium text-slate-900 dark:text-white">92%</span>
                                    <div className="w-24 bg-slate-100 dark:bg-slate-800 h-1 rounded-full">
                                        <div className="bg-orange-500 h-full w-[92%]"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="space-y-6">
                    <ActivityFeed />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
