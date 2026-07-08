import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import StarRating from "../components/reviews/StarRating";
import TeacherReviewsModal from "../components/reviews/TeacherReviewsModal";

function IconArrowRight(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );
}

function IconLogout(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
    </svg>
  );
}

function IconPayout(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" x2="22" y1="10" y2="10" />
    </svg>
  );
}

function IconAvailability(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function IconRequests(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9.5C2 7 4 5 6.5 5H18c2.5 0 4 2 4 4.5V17z" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function IconSessions(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m22 8-6 4 6 4V8Z" />
      <rect width="14" height="12" x="2" y="6" rx="2" ry="2" />
    </svg>
  );
}

function IconReviewStar(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function TeacherDashboard() {
  const navigate = useNavigate();
  const [hasPayout, setHasPayout] = useState(false);
  const profileId = localStorage.getItem("profileId");
  const [profile, setProfile] = useState(null);
  const [profileError, setProfileError] = useState(false);
  const [showReviews, setShowReviews] = useState(false);

  useEffect(() => {
    checkPayout();
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await api.get(`/teacher/${profileId}`);
      setProfile(res.data);
    } catch (err) {
      console.log(err);
      setProfileError(true);
    }
  };

  const checkPayout = async () => {
    try {
      await api.get("/payout");
      setHasPayout(true);
    } catch (err) {
      setHasPayout(false);
    }
  };

  const handleAvailability = async () => {
    try {
      const res = await api.get(`/teacher-meeting/${profileId}`);
      if (res.data?.meetingLink) {
        navigate("/teacher-availability");
      } else {
        navigate("/teacher-meeting-setup");
      }
    } catch (err) {
      console.log(err);
      navigate("/teacher-meeting-setup");
    }
  };

  const cards = [
    {
      title: hasPayout ? "Update Payout Details" : "Complete Payout Details",
      description: hasPayout
        ? "Update your UPI ID or bank account information."
        : "Add your UPI ID or bank account to start receiving payments.",
      icon: <IconPayout className="h-6 w-6" />,
      action: () => navigate("/payout"),
      highlight: !hasPayout,
      accentColor: "indigo",
    },
    {
      title: "Manage Availability",
      description: "Choose when students can book sessions with you.",
      icon: <IconAvailability className="h-6 w-6" />,
      action: handleAvailability,
      accentColor: "emerald",
    },
    {
      title: "Session Requests",
      description: "Accept or reject incoming session requests.",
      icon: <IconRequests className="h-6 w-6" />,
      action: () => navigate("/teacher-sessions"),
      accentColor: "indigo",
    },
    {
      title: "Upcoming Sessions",
      description: "View your booked sessions and Google Meet links.",
      icon: <IconSessions className="h-6 w-6" />,
      action: () => navigate("/teacher-session-events"),
      accentColor: "indigo",
    },
    {
      title: "Reviews",
      description: "See what students are saying about your teaching.",
      icon: <IconReviewStar className="h-6 w-6" />,
      action: () => setShowReviews(true),
      accentColor: "amber",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-slate-950 dark:bg-slate-950 dark:text-white selection:bg-indigo-600 selection:text-white antialiased relative overflow-hidden">
      
      {/* Dynamic Ambient Background Waves */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-200/40 dark:bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-amber-100/40 dark:bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative mx-auto max-w-6xl px-6 py-16 sm:px-8 sm:py-20">
        
        {/* Upper Identity Header Row */}
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/80 dark:border-white/20 dark:bg-white/5 backdrop-blur-sm px-3 py-1 text-xs font-semibold tracking-wide text-indigo-600 dark:text-indigo-400 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-pulse" />
              Educator Workspace console
            </div>

            <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-5xl">
              Welcome, <span className="text-indigo-600 dark:text-indigo-400">{localStorage.getItem("username")}</span>
            </h1>
            <p className="mt-3 text-[15px] font-medium text-slate-600 dark:text-slate-300">
              Complete your onboarding configuration to activate mentoring routes on DoubtConnect.
            </p>
          </div>

          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/";
            }}
            className="group inline-flex items-center gap-2 rounded-xl border-2 border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 transition-colors duration-200 hover:border-red-300 hover:bg-red-50 hover:text-red-600 dark:border-white/20 dark:bg-white/5 dark:text-slate-300 dark:hover:border-red-500/20 dark:hover:bg-red-500/10 dark:hover:text-red-400"
          >
            <IconLogout className="h-4 w-4" />
            Logout
          </button>
        </div>

        {/* Labeled Profile Overview Section Block */}
        {profile && !profileError && (
          <div className="group relative mt-12 flex w-full flex-col overflow-hidden rounded-3xl border-2 border-slate-300 bg-white p-6 dark:border-white/20 dark:bg-white/[0.03] sm:flex-row sm:items-center sm:gap-6 sm:p-8">
            <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full blur-3xl transition-colors duration-300 group-hover:bg-indigo-100/30 dark:group-hover:bg-indigo-500/5 pointer-events-none" />
            
            <img
              src={profile.profilePictureUrl || "https://placehold.co/100x100?text=👤"}
              alt={profile.name}
              className="h-16 w-16 rounded-2xl border border-slate-300 object-cover bg-slate-50 dark:border-white/20 shrink-0"
            />

            <div className="relative flex-1 mt-4 sm:mt-0">
              <h2 className="text-xl font-extrabold tracking-tight text-slate-950 dark:text-white">
                {profile.name}
              </h2>

              {profile.subjects?.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {profile.subjects.map((subject) => (
                    <span
                      key={subject}
                      className="rounded-full bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 text-xs font-bold text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300 dark:border-indigo-400/20"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              )}

              {/* Dynamic Interactive Metrics Bar */}
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm font-semibold">
                <button
                  onClick={() => setShowReviews(true)}
                  className="flex items-center gap-2 border border-slate-300 bg-slate-50 rounded-xl px-3 py-1.5 text-slate-800 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 hover:border-slate-400 transition"
                >
                  <StarRating value={profile.rating || 0} readOnly size="h-4 w-4" />
                  <span>{(profile.rating || 0).toFixed(1)}</span>
                  <span className="text-xs text-slate-400 font-medium">({profile.numberOfRatings || 0} reviews)</span>
                </button>

                <button
                  onClick={() => navigate("/teacher-profile")}
                  className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  View Full Profile →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Secondary Operations Bento Grid Framework */}
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => {
            const isHighlight = card.highlight;
            const glowColor = card.accentColor === "emerald" 
              ? "group-hover:bg-emerald-100/40 dark:group-hover:bg-emerald-500/5"
              : card.accentColor === "amber"
              ? "group-hover:bg-amber-100/40 dark:group-hover:bg-amber-500/5"
              : "group-hover:bg-indigo-100/40 dark:group-hover:bg-indigo-500/5";

            return (
              <button
                key={card.title}
                onClick={card.action}
                className={`group relative flex flex-col justify-between rounded-3xl border-2 p-6 sm:p-8 text-left shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_-16px_rgba(15,23,42,0.12)] ${
                  isHighlight
                    ? "border-indigo-500 bg-indigo-500/[0.02] dark:border-indigo-500/50"
                    : "border-slate-300 bg-white dark:border-white/20 dark:bg-white/[0.03] dark:shadow-none hover:border-indigo-400"
                }`}
              >
                {/* Localized adaptive border light glow on card cursor focus */}
                <div className={`absolute -top-10 -right-10 h-40 w-40 rounded-full blur-3xl transition-colors duration-300 pointer-events-none ${glowColor}`} />

                <div className="relative">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl border ${
                    isHighlight 
                      ? "bg-indigo-600 border-indigo-700 text-white shadow-md shadow-indigo-600/10" 
                      : card.accentColor === "emerald"
                      ? "bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"
                      : card.accentColor === "amber"
                      ? "bg-amber-50 border-amber-200 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20"
                      : "bg-slate-50 border-slate-200 text-slate-700 dark:bg-white/5 dark:text-slate-300 dark:border-white/10"
                  }`}>
                    {card.icon}
                  </div>

                  <h2 className="mt-5 text-xl font-extrabold tracking-tight text-slate-950 dark:text-white">
                    {card.title}
                  </h2>

                  <p className="mt-2 text-xs font-semibold leading-relaxed text-slate-500 dark:text-slate-400">
                    {card.description}
                  </p>

                  {isHighlight && (
                    <span className="mt-4 inline-block rounded-full bg-indigo-600 border border-indigo-700 px-3 py-0.5 text-[10px] font-black uppercase tracking-wider text-white shadow-sm">
                      Action Required
                    </span>
                  )}
                </div>

                <div className="mt-6 relative flex items-center gap-1.5 text-xs font-bold text-slate-400 transition-colors duration-200 group-hover:text-indigo-600 dark:text-slate-500 dark:group-hover:text-indigo-400 pt-4 border-t border-slate-200 dark:border-white/10 w-full">
                  Open Engine
                  <IconArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                </div>
              </button>
            );
          })}
        </div>

      </div>

      {/* Review Modal System mounting point */}
      {showReviews && (
        <TeacherReviewsModal
          teacherId={profileId}
          teacherName={profile?.name}
          onClose={() => setShowReviews(false)}
        />
      )}

    </div>
  );
}

export default TeacherDashboard;