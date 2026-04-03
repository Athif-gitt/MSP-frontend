import React, { useState } from 'react';
import { Plus } from "lucide-react";
import InviteMemberModal from './InviteMemberModal';

export default function InviteMemberButton({ disabled = false }: { disabled?: boolean }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsModalOpen(true)}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
      >
        <Plus className="h-4 w-4" />
        Invite Member
      </button>
      
      {isModalOpen && (
        <InviteMemberModal onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
}
