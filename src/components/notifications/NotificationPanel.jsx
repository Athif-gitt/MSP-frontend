import React from 'react';
import NotificationItem from './NotificationItem';
import { Bell } from 'lucide-react';

const NotificationPanel = ({ notifications, isLoading, isError, onMarkAsRead }) => {
  if (isLoading) {
    return (
      <div className="py-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-4 border-b border-slate-100 animate-pulse flex gap-3">
            <div className="w-5 h-5 rounded-full bg-slate-200 shrink-0"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-slate-200 rounded w-3/4"></div>
              <div className="h-3 bg-slate-200 rounded w-full"></div>
              <div className="h-3 bg-slate-200 rounded w-5/6"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-center text-slate-500 flex flex-col items-center">
        <Bell size={24} className="text-slate-300 mb-2" />
        <p className="text-sm">Failed to load notifications</p>
      </div>
    );
  }

  if (!notifications || notifications.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500 flex flex-col items-center">
        <Bell size={32} className="text-slate-300 mb-3" />
        <p className="text-sm font-medium text-slate-600">All caught up!</p>
        <p className="text-xs text-slate-400 mt-1">No new notifications</p>
      </div>
    );
  }

  return (
    <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onMarkAsRead={onMarkAsRead}
        />
      ))}
    </div>
  );
};

export default NotificationPanel;
