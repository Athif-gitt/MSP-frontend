import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FolderOpen, CheckSquare, Activity, Settings, Trash2 } from 'lucide-react';

const Sidebar = () => {
    const navItems = [
        { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/projects', icon: FolderOpen, label: 'Projects' },
        { to: '#activity', icon: Activity, label: 'Activity' },
    ];

    const systemItems = [
        { to: '#settings', icon: Settings, label: 'Settings' },
        { to: '/trash', icon: Trash2, label: 'Trash' },
    ];

    return (
        <aside className="w-[240px] border-r border-[#E5E7EB] bg-white hidden md:flex flex-col shrink-0">
            <div className="p-6 flex items-center gap-3">
                <div className="bg-[#2563EB] text-white p-1.5 rounded flex items-center justify-center">
                    <LayoutDashboard size={18} />
                </div>
                <h1 className="font-semibold text-lg tracking-tight text-slate-900">MSP</h1>
            </div>
            <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
                <div className="py-2">
                    <p className="px-3 text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-2">Main Menu</p>
                    {navItems.map((item) => (
                        <NavLink
                            key={item.label}
                            to={item.to}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2 text-sm font-medium rounded transition-colors ${isActive
                                    ? 'bg-blue-50 text-[#2563EB]'
                                    : 'text-slate-600 hover:bg-slate-50'
                                }`
                            }
                        >
                            <item.icon size={18} strokeWidth={1.5} className="text-slate-400 shrink-0" />
                            {item.label}
                        </NavLink>
                    ))}
                </div>
                <div className="py-2 mt-4">
                    <p className="px-3 text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-2">System</p>
                    {systemItems.map((item) => (
                        <NavLink
                            key={item.label}
                            to={item.to}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2 text-sm font-medium rounded transition-colors ${isActive
                                    ? 'bg-blue-50 text-[#2563EB]'
                                    : 'text-slate-600 hover:bg-slate-50'
                                }`
                            }
                        >
                            <item.icon size={18} strokeWidth={1.5} className="text-slate-400 shrink-0" />
                            {item.label}
                        </NavLink>
                    ))}
                </div>
            </nav>
            <div className="p-4 border-t border-[#E5E7EB]">
                <div className="bg-slate-50 rounded p-4 border border-[#E5E7EB]">
                    <p className="text-xs font-medium text-slate-600 mb-1">Premium Plan</p>
                    <p className="text-[10px] text-slate-500 mb-3">85% storage used</p>
                    <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
                        <div className="bg-[#2563EB] h-full w-[85%]"></div>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
