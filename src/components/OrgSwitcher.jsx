import React, { useEffect, useMemo, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Building2, Check, ChevronDown, Plus } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getOrgId, setOrgId } from "../utils/authStore";

const normalizeOrganizations = (user) => {
  if (!user) return [];

  if (Array.isArray(user.organizations) && user.organizations.length > 0) {
    return user.organizations.map((org) => ({
      id: String(org.id),
      name: org.name || "Organization",
      role: org.role || null,
    }));
  }

  if (Array.isArray(user.memberships) && user.memberships.length > 0) {
    return user.memberships.map((membership) => ({
      id: String(
        membership.organization_id ||
          membership.organization?.id ||
          membership.organization
      ),
      name:
        membership.organization_name ||
        membership.organization?.name ||
        "Organization",
      role: membership.role || null,
    }));
  }

  if (user.current_organization?.id) {
    return [
      {
        id: String(user.current_organization.id),
        name: user.current_organization.name || "Organization",
        role: user.current_organization.role || null,
      },
    ];
  }

  return [];
};

export default function OrgSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const queryClient = useQueryClient();
  const { user, setUser } = useAuth();

  const organizations = useMemo(() => normalizeOrganizations(user), [user]);
  const selectedOrgId = getOrgId();

  const currentOrganization = useMemo(() => {
    if (user?.current_organization?.id) {
      return {
        id: String(user.current_organization.id),
        name: user.current_organization.name || "Organization",
        role: user.current_organization.role || null,
      };
    }

    if (selectedOrgId) {
      const matchedOrg = organizations.find((org) => org.id === String(selectedOrgId));
      if (matchedOrg) return matchedOrg;
    }

    return organizations[0] || null;
  }, [organizations, selectedOrgId, user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSwitchOrg = (org) => {
    setOrgId(org.id);

    if (user) {
      setUser({
        ...user,
        current_organization: {
          id: org.id,
          name: org.name,
          role: org.role,
        },
      });
    }

    queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    queryClient.invalidateQueries({ queryKey: ["projects"] });
    queryClient.invalidateQueries({ queryKey: ["project"] });
    queryClient.invalidateQueries({ queryKey: ["tasks"] });
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
    queryClient.invalidateQueries({ queryKey: ["trash"] });

    setIsOpen(false);
  };

  const handleCreateOrganization = () => {
    setIsOpen(false);
    window.alert("Create Organization UI is not added yet.");
  };

  const displayName = currentOrganization?.name || "Organization";

  return (
    <div className="relative shrink-0" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm transition-colors hover:border-slate-300 hover:bg-slate-50"
      >
        <Building2 size={16} className="text-slate-500" />
        <span className="max-w-[160px] truncate font-medium">{displayName}</span>
        <ChevronDown size={16} className="text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
          <div className="border-b border-slate-100 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              Workspace
            </p>
            <p className="mt-1 text-sm font-medium text-slate-900">{displayName}</p>
          </div>

          <div className="max-h-72 overflow-y-auto py-2">
            {organizations.length > 0 ? (
              organizations.map((org) => {
                const isCurrent = currentOrganization?.id === org.id;

                return (
                  <button
                    key={org.id}
                    type="button"
                    onClick={() => handleSwitchOrg(org)}
                    className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-slate-50"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-900">
                        {org.name}
                      </p>
                      <p className="text-xs uppercase tracking-wide text-slate-500">
                        {org.role || "Member"}
                      </p>
                    </div>
                    {isCurrent ? (
                      <Check size={16} className="shrink-0 text-blue-600" />
                    ) : null}
                  </button>
                );
              })
            ) : (
              <div className="px-4 py-6 text-sm text-slate-500">
                No organizations available yet.
              </div>
            )}
          </div>

          <div className="border-t border-slate-100 p-2">
            <button
              type="button"
              onClick={handleCreateOrganization}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              <Plus size={16} />
              Create Organization
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
