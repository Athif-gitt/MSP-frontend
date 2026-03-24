import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
    const { user } = useAuth();
    
    return (
        <div className="p-8 max-w-4xl mx-auto w-full h-full">
            <h1 className="text-2xl font-semibold text-slate-900 mb-6">Profile Settings</h1>
            
            <div className="bg-white border text-left border-slate-200 rounded-lg shadow-sm p-6 max-w-2xl">
                <div className="flex items-center gap-5 mb-8">
                    <div className="w-16 h-16 rounded-full bg-[#E0E7FF] text-[#3730A3] flex items-center justify-center font-semibold text-2xl border border-[#C7D2FE]">
                        {user?.first_name ? user.first_name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div>
                        <h2 className="text-lg font-medium text-slate-900">
                            {user?.first_name ? `${user.first_name} ${user.last_name || ""}`.trim() : "User"}
                        </h2>
                        <p className="text-sm text-slate-500">{user?.email}</p>
                    </div>
                </div>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                        <input 
                            type="email" 
                            disabled 
                            value={user?.email || ""} 
                            className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-500 cursor-not-allowed focus:outline-none"
                        />
                        <p className="mt-1.5 text-xs text-slate-500">Your email address cannot be changed right now.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
