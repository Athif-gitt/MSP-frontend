import React from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Mail,
  Shield,
  Users,
} from "lucide-react";
import InviteMemberButton from "../features/invitations/components/InviteMemberButton";
import { useInvitations, useMembers } from "../features/invitations/hooks";
import PermissionGuard from "../components/PermissionGuard";
import { PERMISSIONS } from "../rbac/permissions";
import { usePermission } from "../hooks/usePermission";

const ROLE_STYLES = {
  OWNER: "bg-amber-50 text-amber-700 border-amber-200",
  ADMIN: "bg-blue-50 text-blue-700 border-blue-200",
  MEMBER: "bg-slate-100 text-slate-700 border-slate-200",
};

function formatDate(value) {
  if (!value) return "N/A";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function getRoleClass(role) {
  return ROLE_STYLES[role] || ROLE_STYLES.MEMBER;
}

function StatCard({ icon, label, value, tone = "slate" }) {
  const toneStyles = {
    slate: "bg-slate-100 text-slate-700",
    blue: "bg-blue-50 text-blue-700",
    amber: "bg-amber-50 text-amber-700",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{value}</p>
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${toneStyles[tone]}`}>
          {React.createElement(icon, { className: "h-5 w-5" })}
        </div>
      </div>
    </div>
  );
}

function SectionCard({ title, description, children, action = null }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-slate-100 px-6 py-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900">{title}</h3>
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        </div>
        {action}
      </div>
      <div>{children}</div>
    </section>
  );
}

function ErrorState({ message }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      <AlertTriangle className="h-5 w-5 shrink-0" />
      <span>{message}</span>
    </div>
  );
}

function EmptyState({ icon, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-500">
        {React.createElement(icon, { className: "h-6 w-6" })}
      </div>
      <h4 className="mt-4 text-lg font-semibold text-slate-900">{title}</h4>
      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">{description}</p>
    </div>
  );
}

export default function Members() {
  const { hasPermission, isLoading: isPermissionLoading } = usePermission();
  const canInviteMembers = !isPermissionLoading && hasPermission(PERMISSIONS.INVITE_MEMBER);

  const {
    data: members = [],
    isLoading: isMembersLoading,
    isError: isMembersError,
    error: membersError,
  } = useMembers();

  const {
    data: invitations = [],
    isLoading: isInvitationsLoading,
    isError: isInvitationsError,
    error: invitationsError,
  } = useInvitations(canInviteMembers);

  const ownersCount = members.filter((member) => member.role === "OWNER").length;
  const adminsCount = members.filter((member) => member.role === "ADMIN").length;

  return (
    <div className="space-y-8 p-8">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
            Workspace Access
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Members & invitations
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Manage who has access to your organization, review pending invitations, and keep role
            assignments clear across the workspace.
          </p>
        </div>

        <PermissionGuard permission={PERMISSIONS.INVITE_MEMBER}>
          <InviteMemberButton />
        </PermissionGuard>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard icon={Users} label="Active members" value={members.length} tone="slate" />
        <StatCard icon={Clock3} label="Pending invites" value={invitations.length} tone="blue" />
        <StatCard icon={Shield} label="Admins & owners" value={ownersCount + adminsCount} tone="amber" />
      </section>

      <SectionCard
        title="Team directory"
        description="Current members in this organization and the role each teammate holds."
      >
        {isMembersLoading ? (
          <div className="space-y-3 px-6 py-6">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="h-16 animate-pulse rounded-xl bg-slate-100" />
            ))}
          </div>
        ) : isMembersError ? (
          <div className="px-6 py-6">
            <ErrorState
              message={
                membersError?.response?.data?.detail ||
                membersError?.message ||
                "Failed to load organization members."
              }
            />
          </div>
        ) : members.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No members found"
            description="Once teammates are added to this organization, they’ll appear here with their role and join date."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50/80">
                <tr className="text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                  <th className="px-6 py-4">Member</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {members.map((member) => (
                  <tr key={member.id} className="transition-colors hover:bg-slate-50/80">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700">
                          {member.email?.slice(0, 1)?.toUpperCase() || "U"}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{member.email}</p>
                          <p className="text-xs text-slate-500">Organization member</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${getRoleClass(
                          member.role
                        )}`}
                      >
                        {member.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{formatDate(member.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>

      <SectionCard
        title="Pending invitations"
        description="Invitations that have been sent but not accepted yet."
        action={
          <PermissionGuard
            permission={PERMISSIONS.INVITE_MEMBER}
            fallback={
              <div className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-xs font-medium text-slate-500">
                View only
              </div>
            }
          >
            <InviteMemberButton />
          </PermissionGuard>
        }
      >
        {!canInviteMembers ? (
          <EmptyState
            icon={Mail}
            title="Invitation access restricted"
            description="Only organization admins and owners can review or send pending invitations."
          />
        ) : isInvitationsLoading ? (
          <div className="space-y-3 px-6 py-6">
            {[...Array(2)].map((_, index) => (
              <div key={index} className="h-20 animate-pulse rounded-xl bg-slate-100" />
            ))}
          </div>
        ) : isInvitationsError ? (
          <div className="px-6 py-6">
            <ErrorState
              message={
                invitationsError?.response?.data?.detail ||
                invitationsError?.message ||
                "Failed to load pending invitations."
              }
            />
          </div>
        ) : invitations.length === 0 ? (
          <EmptyState
            icon={Mail}
            title="No pending invites"
            description="New invitations will appear here so the team can track who still needs to join."
          />
        ) : (
          <div className="divide-y divide-slate-100">
            {invitations.map((invitation) => (
              <div
                key={invitation.id}
                className="flex flex-col gap-4 px-6 py-5 transition-colors hover:bg-slate-50/80 lg:flex-row lg:items-center lg:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-sm font-semibold text-slate-900">{invitation.email}</p>
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${getRoleClass(
                        invitation.role
                      )}`}
                    >
                      {invitation.role}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      {invitation.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-500">
                    Invited by {invitation.invited_by} on {formatDate(invitation.created_at)}
                  </p>
                </div>

                <div className="grid gap-2 text-sm text-slate-600 lg:text-right">
                  <span>Workspace: {invitation.organization_name}</span>
                  <span>Expires: {formatDate(invitation.expires_at)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
