import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { CheckCircle2, Mail, ShieldCheck, UserPlus, X } from "lucide-react";
import { useInviteMember } from "../hooks";

interface InviteMemberForm {
  email: string;
  role: "MEMBER" | "ADMIN";
}

const ROLE_OPTIONS: Array<{
  value: InviteMemberForm["role"];
  label: string;
  description: string;
}> = [
  {
    value: "MEMBER",
    label: "Member",
    description: "Can collaborate on projects and work with tasks.",
  },
  {
    value: "ADMIN",
    label: "Admin",
    description: "Can invite teammates and manage organization operations.",
  },
];

function getErrorMessage(error: any) {
  if (error?.response?.status === 403) {
    return "Permission denied. Only admins or owners can send invitations.";
  }

  const data = error?.response?.data;

  if (typeof data?.error === "string") return data.error;
  if (typeof data?.detail === "string") return data.detail;
  if (Array.isArray(data?.non_field_errors)) return data.non_field_errors[0];
  if (Array.isArray(data?.email)) return data.email[0];
  if (Array.isArray(data?.role)) return data.role[0];

  return "Failed to send invitation. Please try again.";
}

export default function InviteMemberModal({ onClose }: { onClose: () => void }) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<InviteMemberForm>({
    defaultValues: { email: "", role: "MEMBER" },
  });

  const selectedRole = watch("role");
  const { mutate: inviteMember, isPending } = useInviteMember();
  const [apiError, setApiError] = useState<string | null>(null);
  const [invitedEmail, setInvitedEmail] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const activeRole = useMemo(
    () => ROLE_OPTIONS.find((option) => option.value === selectedRole) ?? ROLE_OPTIONS[0],
    [selectedRole]
  );

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isPending) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isPending, onClose]);

  const onSubmit = (data: InviteMemberForm) => {
    setApiError(null);

    inviteMember(data, {
      onSuccess: () => {
        setInvitedEmail(data.email);
        setIsSuccess(true);
        reset({ email: "", role: "MEMBER" });
      },
      onError: (error: any) => {
        setApiError(getErrorMessage(error));
      },
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm"
      onClick={() => !isPending && onClose()}
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="invite-member-title"
      >
        <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Team Access
              </p>
              <h2 id="invite-member-title" className="mt-2 text-2xl font-bold text-slate-900">
                Invite a teammate
              </h2>
              <p className="mt-1 max-w-lg text-sm text-slate-500">
                Send a secure email invitation and assign the right workspace role from the start.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              aria-label="Close invite modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {isSuccess ? (
          <div className="px-6 py-10">
            <div className="mx-auto flex max-w-md flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-green-600">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <h3 className="mt-5 text-xl font-bold text-slate-900">Invitation sent</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                <span className="font-semibold text-slate-900">{invitedEmail}</span> will receive an
                invitation email shortly. You can track the pending invite from the members page.
              </p>
              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsSuccess(false);
                    setInvitedEmail("");
                  }}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                >
                  Invite another
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-0 md:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-5 px-6 py-6">
              {apiError ? (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {apiError}
                </div>
              ) : null}

              <div>
                <label htmlFor="invite-email" className="mb-2 block text-sm font-medium text-slate-700">
                  Work email
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="invite-email"
                    type="email"
                    placeholder="name@company.com"
                    className={`w-full rounded-xl border bg-white py-3 pl-10 pr-3 text-sm text-slate-900 shadow-sm outline-none transition ${
                      errors.email
                        ? "border-red-300 ring-2 ring-red-100"
                        : "border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    }`}
                    {...register("email", {
                      required: "Email is required.",
                      pattern: {
                        value: /^\S+@\S+\.\S+$/i,
                        message: "Enter a valid email address.",
                      },
                    })}
                  />
                </div>
                {errors.email ? (
                  <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
                ) : (
                  <p className="mt-2 text-sm text-slate-500">
                    The invite will be sent to this address and can only be accepted by that account.
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Access level</label>
                <div className="space-y-3">
                  {ROLE_OPTIONS.map((option) => {
                    const checked = selectedRole === option.value;

                    return (
                      <label
                        key={option.value}
                        className={`flex cursor-pointer gap-3 rounded-xl border px-4 py-3 transition ${
                          checked
                            ? "border-blue-500 bg-blue-50 shadow-sm"
                            : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                      >
                        <input
                          type="radio"
                          value={option.value}
                          className="mt-1 h-4 w-4 text-blue-600"
                          {...register("role")}
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-900">{option.label}</p>
                          <p className="mt-1 text-sm leading-5 text-slate-500">{option.description}</p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
                >
                  {isPending ? "Sending..." : "Send invitation"}
                </button>
              </div>
            </div>

            <aside className="border-t border-slate-100 bg-slate-50/80 px-6 py-6 md:border-l md:border-t-0">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    {activeRole.value === "ADMIN" ? (
                      <ShieldCheck className="h-5 w-5" />
                    ) : (
                      <UserPlus className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{activeRole.label} invitation</p>
                    <p className="text-xs uppercase tracking-wide text-slate-400">Selected role</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-600">{activeRole.description}</p>
              </div>

              <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-semibold text-slate-900">What happens next</p>
                <ul className="mt-3 space-y-3 text-sm leading-6 text-slate-600">
                  <li>We send a unique invitation link to the teammate’s email address.</li>
                  <li>Their membership stays in a pending state until the invite is accepted.</li>
                  <li>You can review pending invitations from the members workspace.</li>
                </ul>
              </div>
            </aside>
          </form>
        )}
      </div>
    </div>
  );
}
