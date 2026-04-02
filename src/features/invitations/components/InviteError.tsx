import React from "react";
import { Link } from "react-router-dom";

interface InviteErrorProps {
  message?: string;
}

export default function InviteError({ message = "This invitation is invalid or has expired." }: InviteErrorProps) {
  return (
    <div className="w-full max-w-md bg-white shadow-xl rounded-xl p-8 border border-gray-100 flex flex-col items-center">
      <div className="p-4 bg-red-50 rounded-full mb-6">
        <svg
          className="w-10 h-10 text-red-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">
        Invalid Invitation
      </h2>
      
      <p className="text-gray-500 text-center mb-8">
        {message}
      </p>

      <Link
        to="/dashboard"
        className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
      >
        Go back to Safety
      </Link>
    </div>
  );
}
