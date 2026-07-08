import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MyReviewsModal from "../components/reviews/MyReviewsModal";
import MyReportsModal from "../components/MyReportsModal";
import PaymentPolicyModal from "../components/PaymentPolicyModal";

function IconUser(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 3.5-7 8-7s8 3 8 7" />
    </svg>
  );
}

function IconSearch(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </svg>
  );
}

function IconClipboard(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="5" y="4" width="14" height="17" rx="2" />
      <path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" />
      <path d="M9 12h6M9 16h6" />
    </svg>
  );
}

function IconVideo(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="6" width="14" height="12" rx="2" />
      <path d="M16 10l6-3v10l-6-3" />
    </svg>
  );
}

function IconStar(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z" />
    </svg>
  );
}

function IconFlag(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <path d="M4 22V15" />
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

function IconLogout(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  );
}

function StudentDashboard() {
  const navigate = useNavigate();
  const [showMyReviews, setShowMyReviews] = useState(false);
  const [showMyReports, setShowMyReports] = useState(false);
  const studentProfileId = localStorage.getItem("profileId");
  const username = localStorage.getItem("username");

  const [showPolicyModal, setShowPolicyModal] = useState(
    !localStorage.getItem("paymentPolicyAckStudent")
  );

  const secondaryCards = [
    {
      title: "My profile",
      description: "View and manage your student profile details.",
      action: () => navigate("/student-profile"),
      icon: <IconUser className="h-6 w-6" />,
    },
    {
      title: "Session requests",
      description: "Track pending, accepted and rejected requests.",
      action: () => navigate("/student-session-requests"),
      icon: <IconClipboard className="h-6 w-6" />,
    },
    {
      title: "Upcoming sessions",
      description: "View your scheduled Google Meet sessions.",
      action: () => navigate("/student-sessions"),
      icon: <IconVideo className="h-6 w-6" />,
    },
    {
      title: "My reviews",
      description: "See reviews you've written for educators.",
      action: () => setShowMyReviews(true),
      icon: <IconStar className="h-6 w-6" />,
      accent: true,
    },
    {
      title: "My reports",
      description: "View and remove reports you've filed.",
      action: () => setShowMyReports(true),
      icon: <IconFlag className="h-6 w-6" />,
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-slate-950 dark:bg-slate-950 dark:text-white selection:bg-indigo-600 selection:text-white antialiased relative overflow-hidden">

      {/* Ambient background */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-200/40 dark:bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-amber-100/40 dark:bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative mx-auto max-w-6xl px-6 py-16 sm:px-8 sm:py-20">

        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 dark:border-white/10 dark:bg-white/5 backdrop-blur-sm px-3 py-1 text-xs font-semibold tracking-wide text-indigo-600 dark:text-indigo-400">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-pulse" />
              Student dashboard
            </div>

            <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-5xl">
              Welcome back, <span className="text-indigo-600 dark:text-indigo-400">{username}</span>
            </h1>
            <p className="mt-3 text-[15px] font-medium text-slate-600 dark:text-slate-300">
              What would you like to do today?
            </p>
          </div>

          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/";
            }}
            className="group inline-flex items-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 transition-colors duration-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:border-red-500/20 dark:hover:bg-red-500/10 dark:hover:text-red-400"
          >
            <IconLogout className="h-4 w-4" />
            Logout
          </button>
        </div>

        {/* Featured primary action */}
        <button
          onClick={() => navigate("/educators")}
          className="group relative mt-12 flex w-full flex-col overflow-hidden rounded-3xl border-2 border-indigo-100 bg-gradient-to-br from-indigo-50 to-white p-8 text-left shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_-16px_rgba(79,70,229,0.18)] dark:border-indigo-500/20 dark:from-indigo-500/10 dark:to-transparent dark:shadow-none sm:flex-row sm:items-center sm:justify-between sm:p-10"
        >
          <div className="flex items-start gap-5 sm:items-center">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20">
              <IconSearch className="h-7 w-7" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                Start here
              </p>
              <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white">
                Browse educators
              </h2>
              <p className="mt-2 max-w-md text-[14.5px] font-medium leading-relaxed text-slate-600 dark:text-slate-300">
                Find the right educator for your subject and request a one-on-one session.
              </p>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-2 text-sm font-bold text-indigo-600 dark:text-indigo-400 sm:mt-0">
            Open
            <IconArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </button>

        {/* Secondary actions */}
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {secondaryCards.map((card) => (
            <button
              key={card.title}
              onClick={card.action}
              className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_32px_-12px_rgba(15,23,42,0.12)] dark:border-white/10 dark:bg-white/[0.03] dark:shadow-none"
            >
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                  card.accent
                    ? "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
                    : "bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-slate-300"
                }`}
              >
                {card.icon}
              </div>

              <h3 className="mt-5 text-base font-bold text-slate-950 dark:text-white">
                {card.title}
              </h3>
              <p className="mt-2 text-[13.5px] font-medium leading-relaxed text-slate-500 dark:text-slate-400">
                {card.description}
              </p>

              <div className="mt-5 flex items-center gap-1.5 text-xs font-bold text-slate-400 transition-colors duration-200 group-hover:text-indigo-600 dark:text-slate-500 dark:group-hover:text-indigo-400">
                Open
                <IconArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </button>
          ))}
        </div>

      </div>

      {showMyReviews && (
        <MyReviewsModal
          studentId={studentProfileId}
          onClose={() => setShowMyReviews(false)}
        />
      )}

      {showMyReports && (
        <MyReportsModal
          studentId={studentProfileId}
          onClose={() => setShowMyReports(false)}
        />
      )}

      {showPolicyModal && (
        <PaymentPolicyModal
          onAcknowledge={() => {
            localStorage.setItem("paymentPolicyAckStudent", "true");
            setShowPolicyModal(false);
          }}
        />
      )}

    </div>
  );
}

export default StudentDashboard;
