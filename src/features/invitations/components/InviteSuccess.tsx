import React from "react";

interface InviteSuccessProps {
  organizationName: string;
}

export default function InviteSuccess({ organizationName }: InviteSuccessProps) {
  return (
    <div className="w-full max-w-md bg-white shadow-xl rounded-xl p-8 border border-gray-100 flex flex-col items-center animate-fade-in-up">
      <div className="p-4 bg-green-50 rounded-full mb-6">
        <svg
          className="w-12 h-12 text-green-500 animate-bounce"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="3"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 text-center mb-3">
        🎉 You have joined!
      </h2>
      
      <p className="text-gray-500 text-center text-lg">
        Successfully joined <span className="font-semibold text-gray-900">{organizationName}</span>.
      </p>
      
      <p className="text-sm text-gray-400 mt-8 animate-pulse">
        Redirecting to dashboard...
      </p>
    </div>
  );
}
