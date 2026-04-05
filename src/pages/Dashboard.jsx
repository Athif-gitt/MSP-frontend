import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  FolderKanban,
  Loader2,
  ShieldAlert,
  Users2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getDashboardMetrics } from "../services/dashboardService";
import { ROUTES } from "../config/routes";

const DASHBOARD_QUERY_KEY = ["dashboard", "metrics"];

const formatMetric = (value) => new Intl.NumberFormat().format(Number(value || 0));

const getTimeGreeting = () => {
  const hour = new Date().getHours();

  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

const getUserDisplayName = (user) => {
  const fullName = [user?.first_name, user?.last_name].filter(Boolean).join(" ").trim();
  if (fullName) return fullName;
  if (user?.email) return user.email;
  return "Team";
};

const buildMetricCards = (metrics) => [
  {
    key: "active_projects",
    label: "Active projects",
    value: metrics.active_projects,
    icon: FolderKanban,
    tone: "text-sky-700 bg-sky-50 ring-sky-100",
    helper: "Programs currently in motion",
  },
  {
    key: "tasks_due_today",
    label: "Due today",
    value: metrics.tasks_due_today,
    icon: Clock3,
    tone: "text-amber-700 bg-amber-50 ring-amber-100",
    helper: "Items requiring attention this cycle",
  },
  {
    key: "overdue_tasks",
    label: "Overdue tasks",
    value: metrics.overdue_tasks,
    icon: ShieldAlert,
    tone: "text-rose-700 bg-rose-50 ring-rose-100",
    helper: "Delivery risk requiring intervention",
  },
  {
    key: "completed_tasks",
    label: "Completed tasks",
    value: metrics.completed_tasks,
    icon: CheckCircle2,
    tone: "text-emerald-700 bg-emerald-50 ring-emerald-100",
    helper: "Closed successfully across the workspace",
  },
  {
    key: "total_members",
    label: "Team members",
    value: metrics.total_members,
    icon: Users2,
    tone: "text-violet-700 bg-violet-50 ring-violet-100",
    helper: "People currently operating in this org",
  },
];

export default function Dashboard() {
  const { user } = useAuth();
  const workspaceName =
    user?.current_organization?.name || user?.organizations?.[0]?.name || "Workspace";

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: DASHBOARD_QUERY_KEY,
    queryFn: getDashboardMetrics,
  });

  const metrics = {
    active_projects: data?.active_projects ?? 0,
    tasks_due_today: data?.tasks_due_today ?? 0,
    overdue_tasks: data?.overdue_tasks ?? 0,
    completed_tasks: data?.completed_tasks ?? 0,
    total_members: data?.total_members ?? 0,
  };

  const totalOpenLoad = metrics.tasks_due_today + metrics.overdue_tasks;
  const totalTrackedTasks = totalOpenLoad + metrics.completed_tasks;
  const completionRate =
    totalTrackedTasks > 0
      ? Math.round((metrics.completed_tasks / totalTrackedTasks) * 100)
      : 0;
  const riskLevel =
    metrics.overdue_tasks >= 5 ? "High" : metrics.overdue_tasks > 0 ? "Moderate" : "Low";
  const workforceUtilization =
    metrics.total_members > 0
      ? Math.round(((metrics.tasks_due_today + metrics.completed_tasks) / metrics.total_members) * 10) /
        10
      : 0;

  const metricCards = buildMetricCards(metrics);

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-[linear-gradient(135deg,#0f172a_0%,#172554_48%,#eff6ff_48.5%,#f8fafc_100%)] shadow-[0_20px_60px_rgba(15,23,42,0.10)]">
        <div className="grid gap-8 px-6 py-7 lg:grid-cols-[1.5fr_0.85fr] lg:px-8">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-100">
              <BriefcaseBusiness size={14} />
              Executive Operations View
            </div>

            <div className="space-y-3">
              <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-white md:text-4xl">
                {getTimeGreeting()}, {getUserDisplayName(user)}.
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-slate-200/90 md:text-base">
                This dashboard summarizes delivery health, execution pressure, and team capacity
                for {workspaceName}. It is designed to surface operational signal quickly without
                noise.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to={ROUTES.PROJECTS}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
              >
                Review projects
                <ArrowRight size={16} />
              </Link>
              <Link
                to={ROUTES.TRASH}
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/15"
              >
                Audit deleted work
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-white/50 bg-white/88 p-5 backdrop-blur">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Workspace Health
                </p>
                <p className="mt-2 text-4xl font-semibold tracking-tight text-slate-950">
                  {completionRate}%
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  Execution completion rate across currently tracked tasks.
                </p>
              </div>
              <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700">
                <CheckCircle2 size={22} />
              </div>
            </div>

            <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,#0f766e_0%,#16a34a_100%)] transition-all"
                style={{ width: `${Math.min(completionRate, 100)}%` }}
              />
            </div>

            <dl className="mt-5 grid grid-cols-2 gap-4 text-sm">
              <div className="rounded-2xl bg-slate-50 p-4">
                <dt className="text-slate-500">Operational risk</dt>
                <dd className="mt-1 text-lg font-semibold text-slate-900">{riskLevel}</dd>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <dt className="text-slate-500">Workload per member</dt>
                <dd className="mt-1 text-lg font-semibold text-slate-900">
                  {workforceUtilization}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {isLoading ? (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="h-10 w-10 animate-pulse rounded-xl bg-slate-100" />
              <div className="mt-6 h-3 w-24 animate-pulse rounded bg-slate-100" />
              <div className="mt-3 h-8 w-20 animate-pulse rounded bg-slate-100" />
              <div className="mt-4 h-3 w-full animate-pulse rounded bg-slate-100" />
            </div>
          ))}
        </section>
      ) : isError ? (
        <section className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-900 shadow-sm">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5" size={18} />
            <div className="space-y-3">
              <div>
                <h2 className="text-base font-semibold">Dashboard metrics could not be loaded</h2>
                <p className="mt-1 text-sm text-rose-800">
                  {error?.response?.data?.detail ||
                    error?.message ||
                    "The metrics endpoint returned an unexpected response."}
                </p>
              </div>
              <button
                onClick={() => refetch()}
                className="inline-flex items-center gap-2 rounded-xl bg-rose-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-950"
              >
                Retry
              </button>
            </div>
          </div>
        </section>
      ) : (
        <>
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {metricCards.map((card) => {
              const Icon = card.icon;

              return (
                <article
                  key={card.key}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className={`rounded-2xl p-3 ring-1 ${card.tone}`}>
                      <Icon size={20} />
                    </div>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                      Live
                    </span>
                  </div>

                  <p className="mt-5 text-sm font-medium text-slate-500">{card.label}</p>
                  <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                    {formatMetric(card.value)}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{card.helper}</p>
                </article>
              );
            })}
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
            <article className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 px-6 py-5">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Delivery Summary
                </p>
                <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">
                  Operational posture
                </h2>
              </div>

              <div className="grid gap-4 p-6 md:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-5">
                  <p className="text-sm font-medium text-slate-500">Projects in flight</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">
                    {formatMetric(metrics.active_projects)}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    Active delivery streams currently being tracked across the selected
                    organization.
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-5">
                  <p className="text-sm font-medium text-slate-500">Execution pressure</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">
                    {formatMetric(totalOpenLoad)}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    Combined due-today and overdue workload that may require manager review.
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-5">
                  <p className="text-sm font-medium text-slate-500">Completed output</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">
                    {formatMetric(metrics.completed_tasks)}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    Completed tasks provide the current indicator of throughput and closure.
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-5">
                  <p className="text-sm font-medium text-slate-500">Team capacity base</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">
                    {formatMetric(metrics.total_members)}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    Active member count available to absorb operational demand in this workspace.
                  </p>
                </div>
              </div>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 px-6 py-5">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Controls
                </p>
                <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">
                  Recommended actions
                </h2>
              </div>

              <div className="space-y-4 p-6">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Review active delivery</p>
                      <p className="mt-1 text-sm text-slate-600">
                        Validate project scope, ownership, and execution velocity.
                      </p>
                    </div>
                    <Link
                      to={ROUTES.PROJECTS}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                    >
                      Open
                    </Link>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Inspect trash queue</p>
                      <p className="mt-1 text-sm text-slate-600">
                        Audit deleted tasks before permanent removal or recovery.
                      </p>
                    </div>
                    <Link
                      to={ROUTES.TRASH}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                    >
                      Open
                    </Link>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-900">Data freshness</p>
                  <p className="mt-1 text-sm text-slate-600">
                    {isFetching
                      ? "Refreshing dashboard metrics now."
                      : "Metrics are sourced directly from the dashboard endpoint for the active organization context."}
                  </p>
                </div>
              </div>
            </article>
          </section>
        </>
      )}
    </div>
  );
}
