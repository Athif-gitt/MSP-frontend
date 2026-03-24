import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { CheckCircle2, Circle } from 'lucide-react';

const NotificationItem = ({ notification, onMarkAsRead }) => {
  const { id, title, message, created_at, is_read, type } = notification;

  const handleMarkAsRead = () => {
    if (!is_read && onMarkAsRead) {
      onMarkAsRead(id);
    }
  };

  return (
    <div
      onClick={handleMarkAsRead}
      className={`p-4 border-b border-slate-100 last:border-b-0 cursor-pointer transition-colors flex gap-3 items-start group ${
        is_read ? 'bg-white hover:bg-slate-50' : 'bg-blue-50/50 hover:bg-blue-50'
      }`}
    >
      <div className="flex-shrink-0 mt-0.5">
        {is_read ? (
          <CheckCircle2 size={18} className="text-slate-300" />
        ) : (
          <Circle
            size={18}
            className="text-blue-500 fill-blue-500/10 group-hover:fill-blue-500/20 transition-colors"
          />
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-1">
          <p className={`text-sm font-medium truncate pr-2 ${is_read ? 'text-slate-700' : 'text-slate-900'}`}>
            {title || 'Notification'}
          </p>
          {created_at && (
            <span className="text-[11px] text-slate-400 flex-shrink-0 whitespace-nowrap">
              {formatDistanceToNow(new Date(created_at), { addSuffix: true })}
            </span>
          )}
        </div>
        <p className={`text-sm line-clamp-2 ${is_read ? 'text-slate-500' : 'text-slate-700'}`}>
          {message}
        </p>
        {!is_read && (
          <p className="text-[11px] text-blue-600 mt-2 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            Click to mark as read
          </p>
        )}
      </div>
      
      {!is_read && (
        <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
      )}
    </div>
  );
};

export default NotificationItem;
