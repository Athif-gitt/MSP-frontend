import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { User, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../config/routes';

export default function ProfileDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { user, logout } = useAuth()

    const displayName = user?.first_name
      ? `${user.first_name} ${user.last_name || ""}`.trim()
      : user?.email || "User"

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleLogout = async () => {
        // Clear react-query cache completely
        queryClient.clear();
        // Clear context and trigger redirect via protected route
        await logout();
    };

    const handleProfileClick = () => {
        setIsOpen(false);
        navigate(ROUTES.PROFILE);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                className="flex items-center gap-3 cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] rounded-md transition-shadow"
                onClick={() => setIsOpen(!isOpen)}
                aria-haspopup="true"
                aria-expanded={isOpen}
            >
                <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-slate-900 leading-none group-hover:text-[#2563EB] transition-colors">{displayName}</p>
                </div>
                {/* Fallback avatar matching SaaS minimal aesthetic */}
                <div className="w-8 h-8 rounded-full bg-[#E0E7FF] text-[#3730A3] flex items-center justify-center font-semibold text-sm border border-[#C7D2FE]">
                    {displayName.charAt(0).toUpperCase()}
                </div>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-[#E5E7EB] py-1 z-50">
                    <div className="px-4 py-3 border-b border-[#E5E7EB]">
                        <p className="text-sm font-medium text-slate-900 truncate">{displayName}</p>
                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>

                    <div className="py-1">
                        <button 
                            onClick={handleProfileClick}
                            className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 flex items-center gap-2 transition-colors focus:outline-none focus:bg-slate-50"
                        >
                            <User size={16} className="text-slate-400" />
                            Profile
                        </button>
                        <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 flex items-center gap-2 transition-colors focus:outline-none focus:bg-slate-50">
                            <Settings size={16} className="text-slate-400" />
                            Settings
                        </button>
                    </div>

                    <div className="border-t border-[#E5E7EB] py-1">
                        <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors font-medium"
                        >
                            <LogOut size={16} className="text-red-500" />
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
