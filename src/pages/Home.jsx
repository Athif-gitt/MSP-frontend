import { ArrowRight, LayoutDashboard, ShieldCheck, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { ROUTES } from "../config/routes";

const highlights = [
  {
    title: "Operational clarity",
    description: "Track projects, responsibilities, and deadlines from one structured workspace.",
    icon: LayoutDashboard,
  },
  {
    title: "Built for teams",
    description: "Keep stakeholders aligned with shared visibility across members, boards, and workstreams.",
    icon: Users,
  },
  {
    title: "Reliable access control",
    description: "Support secure collaboration with role-aware access and protected workflows.",
    icon: ShieldCheck,
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.24),_transparent_42%)]" />
        <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 sm:px-8 lg:px-10">
          <header className="flex items-center justify-between py-2">
            <Link
              to={ROUTES.HOME}
              className="flex items-center gap-3 text-sm font-semibold tracking-[0.24em] text-slate-200 uppercase"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-base tracking-normal text-white">
                M
              </span>
              MSP
            </Link>

            <div className="flex items-center gap-3">
              <Link
                to={ROUTES.LOGIN}
                className="rounded-lg border border-white/15 px-4 py-2 text-sm font-medium text-slate-100 transition hover:border-white/30 hover:bg-white/5"
              >
                Log in
              </Link>
              <Link
                to={ROUTES.REGISTER}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
              >
                Get started
              </Link>
            </div>
          </header>

          <div className="flex flex-1 items-center py-16 sm:py-20">
            <div className="grid w-full gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,420px)] lg:items-center">
              <div className="max-w-3xl">
                <p className="mb-5 inline-flex rounded-full border border-blue-400/30 bg-blue-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-blue-200">
                  Modern workspace management
                </p>
                <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                  A polished home for managing projects, teams, and daily execution.
                </h1>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                  MSP gives your organization a clean operating layer for planning work, coordinating members,
                  and keeping delivery visible from one secure dashboard.
                </p>

                <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                  <Link
                    to={ROUTES.REGISTER}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
                  >
                    Create account
                    <ArrowRight size={16} />
                  </Link>
                  <Link
                    to={ROUTES.LOGIN}
                    className="inline-flex items-center justify-center rounded-lg border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/5"
                  >
                    Access your workspace
                  </Link>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-slate-950/40 backdrop-blur">
                <div className="grid gap-4">
                  {highlights.map(({ title, description, icon: Icon }) => (
                    <div
                      key={title}
                      className="rounded-xl border border-white/8 bg-slate-900/80 p-5"
                    >
                      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-blue-600/15 text-blue-300">
                        <Icon size={20} />
                      </div>
                      <h2 className="text-lg font-semibold text-white">{title}</h2>
                      <p className="mt-2 text-sm leading-6 text-slate-300">{description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
