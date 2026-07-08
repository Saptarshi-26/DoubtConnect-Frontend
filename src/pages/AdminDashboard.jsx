import { useNavigate } from "react-router-dom";
import {
  Users,
  GraduationCap,
  BookOpen,
  CalendarDays,
  Clock3,
  MessageSquare,
  Star,
  Settings,
  Flag,
  FlaskConical,
  ArrowRight,
  LogOut,
} from "lucide-react";

const cards = [
  {
    title: "Educators",
    desc: "View and manage teacher profiles.",
    icon: GraduationCap,
    path: "/educators",
    tint: "indigo",
  },
  {
    title: "Students",
    desc: "View and manage student profiles.",
    icon: Users,
    path: "/admin/students",
    tint: "blue",
  },
  {
    title: "Reports",
    desc: "Look up reports filed against educators.",
    icon: Flag,
    path: "/admin/reports",
    tint: "rose",
  },
  {
    title: "Test Data",
    desc: "Preview seeded demo teachers and students.",
    icon: FlaskConical,
    path: "/admin/test-data",
    tint: "amber",
  },
  {
    title: "Sessions",
    desc: "Manage all learning sessions.",
    icon: BookOpen,
    tint: "violet",
  },
  {
    title: "Session Requests",
    desc: "Monitor incoming requests.",
    icon: MessageSquare,
    tint: "teal",
  },
  {
    title: "Session Events",
    desc: "Google Meet sessions.",
    icon: CalendarDays,
    tint: "sky",
  },
  {
    title: "Teacher Availability",
    desc: "Available teaching slots.",
    icon: Clock3,
    tint: "emerald",
  },
  {
    title: "Feedback",
    desc: "Ratings and reviews.",
    icon: Star,
    tint: "amber",
  },
  {
    title: "Settings",
    desc: "Application configuration.",
    icon: Settings,
    tint: "fuchsia",
  },
];

const tintStyles = {
  indigo: {
    iconBg: "bg-gradient-to-br from-indigo-500 to-indigo-600",
    ring: "hover:ring-indigo-300",
    glow: "hover:shadow-[0_12px_32px_-8px_rgba(79,70,229,0.4)]",
    top: "from-indigo-500 to-indigo-400",
    link: "text-indigo-600",
  },
  blue: {
    iconBg: "bg-gradient-to-br from-blue-500 to-blue-600",
    ring: "hover:ring-blue-300",
    glow: "hover:shadow-[0_12px_32px_-8px_rgba(37,99,235,0.4)]",
    top: "from-blue-500 to-blue-400",
    link: "text-blue-600",
  },
  rose: {
    iconBg: "bg-gradient-to-br from-rose-500 to-rose-600",
    ring: "hover:ring-rose-300",
    glow: "hover:shadow-[0_12px_32px_-8px_rgba(244,63,94,0.35)]",
    top: "from-rose-500 to-rose-400",
    link: "text-rose-600",
  },
  amber: {
    iconBg: "bg-gradient-to-br from-amber-500 to-orange-500",
    ring: "hover:ring-amber-300",
    glow: "hover:shadow-[0_12px_32px_-8px_rgba(217,119,6,0.35)]",
    top: "from-amber-500 to-orange-400",
    link: "text-amber-600",
  },
  violet: {
    iconBg: "bg-gradient-to-br from-violet-500 to-purple-600",
    ring: "hover:ring-violet-300",
    glow: "hover:shadow-[0_12px_32px_-8px_rgba(124,58,237,0.35)]",
    top: "from-violet-500 to-purple-400",
    link: "text-violet-600",
  },
  teal: {
    iconBg: "bg-gradient-to-br from-teal-500 to-emerald-600",
    ring: "hover:ring-teal-300",
    glow: "hover:shadow-[0_12px_32px_-8px_rgba(13,148,136,0.35)]",
    top: "from-teal-500 to-emerald-400",
    link: "text-teal-600",
  },
  sky: {
    iconBg: "bg-gradient-to-br from-sky-500 to-blue-600",
    ring: "hover:ring-sky-300",
    glow: "hover:shadow-[0_12px_32px_-8px_rgba(14,165,233,0.35)]",
    top: "from-sky-500 to-blue-400",
    link: "text-sky-600",
  },
  emerald: {
    iconBg: "bg-gradient-to-br from-emerald-500 to-green-600",
    ring: "hover:ring-emerald-300",
    glow: "hover:shadow-[0_12px_32px_-8px_rgba(5,150,105,0.35)]",
    top: "from-emerald-500 to-green-400",
    link: "text-emerald-600",
  },
  fuchsia: {
    iconBg: "bg-gradient-to-br from-fuchsia-500 to-pink-600",
    ring: "hover:ring-fuchsia-300",
    glow: "hover:shadow-[0_12px_32px_-8px_rgba(192,38,211,0.35)]",
    top: "from-fuchsia-500 to-pink-400",
    link: "text-fuchsia-600",
  },
};

function AdminDashboard() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const activeCount = cards.filter((c) => c.path).length;

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      {/* Rich ambient background */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-32 left-[10%] h-[36rem] w-[36rem] rounded-full bg-indigo-600/25 blur-[120px]" />
        <div className="absolute top-1/4 right-[5%] h-[28rem] w-[28rem] rounded-full bg-fuchsia-500/15 blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 h-[26rem] w-[26rem] rounded-full bg-teal-500/15 blur-[130px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-5">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 text-sm font-semibold text-white shadow-[0_4px_20px_-2px_rgba(139,92,246,0.6)]">
              {(username || "A").charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-[1.35rem] font-semibold tracking-tight text-white">
                Admin Dashboard
              </h1>
              <p className="text-sm text-slate-400">
                Welcome back, {username}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/";
            }}
            className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-300 transition-all duration-200 hover:border-rose-400/40 hover:bg-rose-500/10 hover:text-rose-300"
          >
            <LogOut className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
            Logout
          </button>
        </div>
      </header>

      {/* Body */}
      <div className="relative mx-auto max-w-7xl px-8 py-10">
        <div className="mb-8 flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-violet-400">
              Overview
            </h2>
            <p className="mt-1.5 text-lg text-slate-300">
              Manage every part of the platform from one place.
            </p>
          </div>
          <span className="rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-sm font-medium text-slate-300">
            {activeCount} of {cards.length} modules active
          </span>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {cards.map((card, i) => {
            const Icon = card.icon;
            const enabled = Boolean(card.path);
            const tint = tintStyles[card.tint] || tintStyles.indigo;

            return (
              <button
                key={card.title}
                onClick={() => enabled && navigate(card.path)}
                disabled={!enabled}
                style={{
                  animation: `fadeSlideUp 0.5s ease-out ${i * 0.05}s both`,
                }}
                className={`group relative overflow-hidden rounded-2xl border p-6 text-left transition-all duration-300 ${
                  enabled
                    ? `border-white/10 bg-white/[0.06] ring-1 ring-transparent backdrop-blur-sm hover:-translate-y-1 hover:bg-white/[0.09] ${tint.ring} ${tint.glow}`
                    : "cursor-not-allowed border-white/5 bg-white/[0.02]"
                }`}
              >
                {/* top accent bar */}
                {enabled && (
                  <div
                    className={`absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r ${tint.top} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                  />
                )}

                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl shadow-lg transition-transform duration-300 ${
                    enabled
                      ? `${tint.iconBg} text-white group-hover:scale-105 group-hover:rotate-3`
                      : "bg-white/5 text-slate-500"
                  }`}
                >
                  <Icon className="h-6 w-6" />
                </div>

                <h3
                  className={`mt-5 text-[1.05rem] font-semibold tracking-tight ${
                    enabled ? "text-white" : "text-slate-500"
                  }`}
                >
                  {card.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {card.desc}
                </p>

                {enabled ? (
                  <div
                    className={`mt-5 flex items-center gap-1.5 text-sm font-semibold ${tint.link} brightness-125`}
                  >
                    Open
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                ) : (
                  <div className="mt-5 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
                    <span className="text-sm font-medium text-slate-500">
                      Coming soon
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes fadeSlideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default AdminDashboard;