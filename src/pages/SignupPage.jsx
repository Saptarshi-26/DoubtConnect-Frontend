import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function IconSpark(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function IconChalkboard(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="4" width="18" height="12" rx="1.5" />
      <path d="M8 16l-1.5 4M16 16l1.5 4M12 16v4" />
      <path d="M7 9l3 2 2-3 4 3" />
    </svg>
  );
}

function IconCheck(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function IconArrowRight(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M5 12h14" />
      <path d="M13 5l7 7-7 7" />
    </svg>
  );
}

function RolePath({ icon, eyebrow, title, description, features, accent, onClick }) {
  const accentMap = {
    indigo: {
      ring: "hover:border-indigo-400 dark:hover:border-indigo-400/60",
      iconWrap: "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400",
      check: "bg-indigo-500 text-white dark:bg-indigo-500/20 dark:text-indigo-400",
      cta: "text-indigo-600 dark:text-indigo-400",
      glow: "group-hover:bg-indigo-200/50 dark:group-hover:bg-indigo-500/10",
    },
    emerald: {
      ring: "hover:border-emerald-400 dark:hover:border-emerald-400/60",
      iconWrap: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
      check: "bg-emerald-500 text-white dark:bg-emerald-500/20 dark:text-emerald-400",
      cta: "text-emerald-600 dark:text-emerald-400",
      glow: "group-hover:bg-emerald-200/50 dark:group-hover:bg-emerald-500/10",
    },
  }[accent];

  return (
    <button
      onClick={onClick}
      className={`group relative flex flex-col overflow-hidden rounded-3xl border-2 border-slate-200 bg-white p-8 text-left shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_-16px_rgba(15,23,42,0.16)] dark:border-white/10 dark:bg-white/[0.03] dark:shadow-none sm:p-10 ${accentMap.ring}`}
    >
      {/* corner glow, appears on hover */}
      <div className={`absolute -top-10 -right-10 h-40 w-40 rounded-full blur-3xl transition-colors duration-300 ${accentMap.glow}`} />

      <div className="relative">
        <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${accentMap.iconWrap}`}>
          {icon}
        </div>

        <p className="mt-6 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
          {eyebrow}
        </p>
        <h2 className="mt-1.5 text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white">
          {title}
        </h2>
        <p className="mt-3 text-[14.5px] font-medium leading-relaxed text-slate-500 dark:text-slate-400">
          {description}
        </p>

        <ul className="mt-6 space-y-3">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-sm font-medium text-slate-700 dark:text-slate-200">
              <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md mt-0.5 ${accentMap.check}`}>
                <IconCheck className="h-3 w-3" />
              </span>
              <span>{f}</span>
            </li>
          ))}
        </ul>

        <div className={`mt-8 flex items-center gap-2 text-sm font-bold ${accentMap.cta}`}>
          Continue
          <IconArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </div>
    </button>
  );
}

function SignupPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-slate-950 dark:bg-slate-950 dark:text-white selection:bg-indigo-600 selection:text-white antialiased relative overflow-hidden">

      {/* Ambient background */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-200/40 dark:bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-emerald-100/40 dark:bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative mx-auto max-w-5xl px-6 py-16 sm:px-8 sm:py-24">

        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 dark:border-white/10 dark:bg-white/5 backdrop-blur-sm px-3 py-1 text-xs font-semibold tracking-wide text-indigo-600 dark:text-indigo-400">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-pulse" />
            Join DoubtConnect
          </div>

          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-5xl">
            How do you want to show up?
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[15px] font-medium leading-relaxed text-slate-600 dark:text-slate-300">
            Whether you're stuck on a problem or you're the one who can explain
            it, your account looks a little different depending on which side
            you're on.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          <RolePath
            icon={<IconSpark className="h-6 w-6" />}
            eyebrow="For students"
            title="I need help"
            description="Find an educator who actually gets your subject, book a session, and get unstuck — today, not next week."
            features={[
              "Search educators by subject and rating",
              "Book and pay directly, no middleman",
              "Get a Meet link the moment it's confirmed",
            ]}
            accent="indigo"
            onClick={() => navigate("/signup/student")}
          />

          <RolePath
            icon={<IconChalkboard className="h-6 w-6" />}
            eyebrow="For educators"
            title="I can teach"
            description="Set your own rates, build a public profile students actually search for, and turn your free hours into income."
            features={[
              "Set your own subjects and pricing",
              "Public profile with reviews and ratings",
              "Payments land straight in your account",
            ]}
            accent="emerald"
            onClick={() => navigate("/signup/teacher")}
          />
        </div>

        <p className="mt-10 text-center text-sm font-medium text-slate-500 dark:text-slate-400">
          Already have an account?{" "}
          <Link to="/login" className="font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">
            Log in
          </Link>
        </p>

      </div>
    </div>
  );
}

export default SignupPage;