import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { User, Settings, LogOut } from 'lucide-react';
import { getUser, logout as storeLogout } from '../utils/authStore';
import { useCurrentUser } from "../hooks/useCurrentUser"

export default function ProfileDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // Get the user data from memory store. 
    // Fallback to anonymous if refreshed (since it's memory-only).
    const { data: user } = useCurrentUser()

const displayName = user?.first_name
  ? `${user.first_name} ${user.last_name || ""}`.trim()
  : user?.email || "User"
    // Try to display name, fallback to email
    // const displayName = user.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : user.email;

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

    const handleLogout = () => {
        // Clear react-query cache completely
        queryClient.clear();
        // Clear memory auth store and trigger redirect
        storeLogout();
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <div
                className="flex items-center gap-3 cursor-pointer group"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-slate-900 leading-none group-hover:text-[#2563EB] transition-colors">{displayName}</p>
                </div>
                {/* Fallback avatar matching SaaS minimal aesthetic */}
                <div className="w-8 h-8 rounded-full bg-[#E0E7FF] text-[#3730A3] flex items-center justify-center font-semibold text-sm border border-[#C7D2FE]">
                    {displayName.charAt(0).toUpperCase()}
                </div>
            </div>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-[#E5E7EB] py-1 z-50">
                    <div className="px-4 py-3 border-b border-[#E5E7EB]">
                        <p className="text-sm font-medium text-slate-900 truncate">{displayName}</p>
                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>

                    <div className="py-1">
                        <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 flex items-center gap-2 transition-colors">
                            <User size={16} className="text-slate-400" />
                            Profile
                        </button>
                        <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 flex items-center gap-2 transition-colors">
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
