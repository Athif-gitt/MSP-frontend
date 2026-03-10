import React from 'react';
import { Search, Bell, HelpCircle } from 'lucide-react';
import ProfileDropdown from './ProfileDropdown';

const Navbar = () => {
    return (
        <header className="h-[72px] border-b border-[#E5E7EB] bg-white flex items-center justify-between px-8 shrink-0">
            <div className="flex items-center flex-1 max-w-xl">
                <div className="relative w-full group flex items-center">
                    <Search size={18} strokeWidth={1.5} className="absolute left-3 text-slate-400 group-focus-within:text-[#2563EB] transition-colors" />
                    <input
                        type="text"
                        className="w-full bg-white border border-[#E5E7EB] rounded-md pl-10 pr-12 py-2 text-sm focus:ring-1 focus:ring-[#2563EB] focus:border-[#2563EB] transition-all outline-none text-slate-900 placeholder:text-slate-400 shadow-sm"
                        placeholder="Search tasks, projects, or commands..."
                    />
                    <div className="absolute right-3 flex items-center gap-1">
                        <kbd className="hidden sm:inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-medium text-slate-500 bg-slate-100 border border-slate-200 rounded">⌘</kbd>
                        <kbd className="hidden sm:inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-medium text-slate-500 bg-slate-100 border border-slate-200 rounded">K</kbd>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-4 ml-8">
                <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded transition-colors relative">
                    <Bell size={20} strokeWidth={1.5} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-[#2563EB] rounded border-[1.5px] border-white"></span>
                </button>
                <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded transition-colors">
                    <HelpCircle size={20} strokeWidth={1.5} />
                </button>
                <div className="h-6 w-px bg-[#E5E7EB] mx-1"></div>
                <ProfileDropdown />
            </div>
        </header>
    );
};

export default Navbar;
