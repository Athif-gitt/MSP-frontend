import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../services/authService';
import Toast from '../components/Toast';

export default function Profile() {
    const { user, setUser } = useAuth();
    const [toastConfig, setToastConfig] = useState(null);

    const { register, handleSubmit, formState: { errors, isDirty } } = useForm({
        defaultValues: {
            first_name: user?.first_name || '',
            last_name: user?.last_name || '',
            bio: user?.bio || '',
            timezone: user?.timezone || 'UTC'
        }
    });

    const mutation = useMutation({
        mutationFn: updateProfile,
        onSuccess: (data) => {
            // Instantly update global auth context with new profile details
            setUser({ ...user, ...data });
            setToastConfig({ type: 'success', message: 'Profile updated successfully' });
        },
        onError: (err) => {
            setToastConfig({ 
                type: 'error', 
                message: err.response?.data?.detail || 'Failed to update profile' 
            });
        }
    });

    const onSubmit = (data) => {
        mutation.mutate(data);
    };

    return (
        <div className="flex flex-col flex-1 px-8 py-8 w-full max-w-5xl mx-auto pb-24 animate-in fade-in duration-300">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-semibold text-slate-900">Profile Settings</h1>
                <p className="text-sm text-slate-500 mt-1">
                    Manage your personal information and application preferences.
                </p>
                <div className="border-b border-slate-200 mt-6"></div>
            </div>

            <div className="flex flex-col lg:flex-row gap-10">
                {/* Left Sidebar (Settings Navigation Placeholder) */}
                <div className="w-full lg:w-64 shrink-0">
                    <nav className="flex flex-col space-y-1">
                        <button className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg bg-blue-50 text-blue-700">
                            Public Profile
                        </button>
                        <button className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-slate-600 hover:bg-slate-50 cursor-not-allowed opacity-60">
                            Account Security
                        </button>
                        <button className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-slate-600 hover:bg-slate-50 cursor-not-allowed opacity-60">
                            Notifications
                        </button>
                    </nav>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 max-w-2xl">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                        {/* Profile Section */}
                        <div className="bg-white border text-left border-slate-200 rounded-xl shadow-sm overflow-hidden">
                            <div className="p-6">
                                <h2 className="text-lg font-semibold text-slate-900">Personal Information</h2>
                                <p className="text-sm text-slate-500 mt-1 mb-6">
                                    Update your name and biographical details.
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">First Name</label>
                                        <input
                                            {...register("first_name", { required: "First name is required" })}
                                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                                            placeholder="Enter first name"
                                        />
                                        {errors.first_name && <p className="text-xs text-red-500">{errors.first_name.message}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Last Name</label>
                                        <input
                                            {...register("last_name")}
                                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                                            placeholder="Enter last name"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2 mt-6">
                                    <label className="text-sm font-medium text-slate-700">Bio</label>
                                    <textarea
                                        {...register("bio")}
                                        rows={4}
                                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow resize-none"
                                        placeholder="Tell us a little about yourself..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Preferences Section */}
                        <div className="bg-white border text-left border-slate-200 rounded-xl shadow-sm overflow-hidden">
                            <div className="p-6">
                                <h2 className="text-lg font-semibold text-slate-900">Preferences</h2>
                                <p className="text-sm text-slate-500 mt-1 mb-6">
                                    Manage your regional and formatting preferences.
                                </p>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Timezone</label>
                                    <select
                                        {...register("timezone")}
                                        className="w-full sm:w-1/2 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow bg-white"
                                    >
                                        <option value="UTC">UTC (Coordinated Universal Time)</option>
                                        <option value="America/New_York">Eastern Time (ET)</option>
                                        <option value="America/Chicago">Central Time (CT)</option>
                                        <option value="America/Denver">Mountain Time (MT)</option>
                                        <option value="America/Los_Angeles">Pacific Time (PT)</option>
                                        <option value="Europe/London">London (GMT)</option>
                                        <option value="Asia/Tokyo">Tokyo (JST)</option>
                                        <option value="Australia/Sydney">Sydney (AEST)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end pt-4 border-t border-slate-200">
                            <button
                                type="submit"
                                disabled={mutation.isPending || !isDirty}
                                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {mutation.isPending ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {toastConfig && (
                <Toast
                    type={toastConfig.type}
                    message={toastConfig.message}
                    onClose={() => setToastConfig(null)}
                />
            )}
        </div>
    );
}
