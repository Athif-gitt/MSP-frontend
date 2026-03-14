import React, { useEffect } from "react";

const Toast = ({ message, type = "success", onClose, duration = 3000 }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const isError = type === "error";

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border ${
          isError
            ? "bg-white dark:bg-slate-900 border-red-200 dark:border-red-900/50 text-slate-800 dark:text-slate-200"
            : "bg-white dark:bg-slate-900 border-green-200 dark:border-green-900/50 text-slate-800 dark:text-slate-200"
        }`}
      >
        <span
          className={`material-symbols-outlined text-[20px] ${
            isError ? "text-red-500" : "text-green-500"
          }`}
        >
          {isError ? "error" : "check_circle"}
        </span>
        <p className="text-sm font-medium">{message}</p>
        <button
          onClick={onClose}
          className="ml-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">close</span>
        </button>
      </div>
    </div>
  );
};

export default Toast;
