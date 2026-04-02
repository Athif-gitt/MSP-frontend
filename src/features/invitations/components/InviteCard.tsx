import React from "react";

interface InviteCardProps {
  organizationName: string;
  role: string;
  invitedByEmail: string;
  onAccept: () => void;
  isAccepting: boolean;
}

export default function InviteCard({
  organizationName,
  role,
  invitedByEmail,
  onAccept,
  isAccepting,
}: InviteCardProps) {
  return (
    <div className="w-full max-w-md bg-white shadow-xl rounded-xl p-8 border border-gray-100 flex flex-col items-center">
      <div className="p-4 bg-blue-50 rounded-full mb-6">
        <svg
          className="w-10 h-10 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
        You're invited to join <span className="text-blue-600">{organizationName}</span>
      </h2>
      
      <div className="w-full bg-gray-50 rounded-lg p-4 mt-4 mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-500">Invited by</span>
          <span className="text-sm font-medium text-gray-900">{invitedByEmail}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Role</span>
          <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded capitalize">{role}</span>
        </div>
      </div>

      <button
        onClick={onAccept}
        disabled={isAccepting}
        className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isAccepting ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Accepting...
          </>
        ) : (
          "Accept Invitation"
        )}
      </button>
    </div>
  );
}
