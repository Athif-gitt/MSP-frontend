import React from 'react';
import { HelpCircle } from 'lucide-react';
import ProfileDropdown from './ProfileDropdown';
import NotificationBell from './notifications/NotificationBell';
import GlobalSearchBar from './search/GlobalSearchBar';

const Navbar = () => {
    return (
        <header className="h-[72px] border-b border-[#E5E7EB] bg-white flex items-center justify-between px-8 shrink-0">
            <div className="flex items-center flex-1 max-w-xl">
                <GlobalSearchBar />
            </div>
            <div className="flex items-center gap-4 ml-8">
                <NotificationBell />
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
