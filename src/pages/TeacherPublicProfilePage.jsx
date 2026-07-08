import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import StarRating from "../components/reviews/StarRating";
import TeacherReviewsModal from "../components/reviews/TeacherReviewsModal";
import ReportTeacherModal from "../components/ReportTeacherModal";

function IconArrowLeft(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}

function IconHeart({ filled, ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"}
      stroke="currentColor" strokeWidth="2" strokeLinecap="round"
      strokeLinejoin="round" {...props}>
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 12 5.5 5.5 5.5 0 0 0 4.5 8.5C4.5 13 12 21 12 21s7.5-8 7.5-8" />
    </svg>
  );
}

function TeacherPublicProfilePage() {
  const navigate = useNavigate();
  const { teacherId } = useParams();

  const role = localStorage.getItem("role");
  const studentProfileId = localStorage.getItem("profileId");
  const isStudent = role === "STUDENT";

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [showReviews, setShowReviews] = useState(false);

  const [isFavourite, setIsFavourite] = useState(false);
  const [favouriteBusy, setFavouriteBusy] = useState(false);

  const [isReported, setIsReported] = useState(false);
  const [reportBusy, setReportBusy] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    loadProfile();
    if (isStudent) {
      loadFavouriteStatus();
      loadReportStatus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teacherId]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const loadProfile = async () => {
    setLoading(true);
    setLoadError("");
    try {
      const res = await api.get(`/teacher/${teacherId}`);
      setProfile(res.data);
    } catch (err) {
      console.log(err);
      setLoadError("Unable to load this profile right now.");
    } finally {
      setLoading(false);
    }
  };

  const loadFavouriteStatus = async () => {
    try {
      const res = await api.get(`/student/${studentProfileId}/favourites`);
      const list = Array.isArray(res.data) ? res.data : [];
      setIsFavourite(list.some((t) => String(t.id) === String(teacherId)));
    } catch (err) {
      console.log(err);
    }
  };

  const toggleFavourite = async () => {
    if (favouriteBusy) return;

    const wasFavourite = isFavourite;
    setFavouriteBusy(true);
    setIsFavourite(!wasFavourite);

    try {
      if (wasFavourite) {
        await api.delete("/student/favourite", {
          data: { studentId: studentProfileId, teacherId },
        });
      } else {
        await api.post("/student/favourite", {
          studentId: studentProfileId,
          teacherId,
        });
      }
    } catch (err) {
      console.log(err);
      setIsFavourite(wasFavourite);
    } finally {
      setFavouriteBusy(false);
    }
  };

  const loadReportStatus = async () => {
    try {
      const res = await api.get("/report", {
        params: { studentProfileId },
      });
      const list = Array.isArray(res.data) ? res.data : [];
      const reported = list.some((r) => {
        const rTeacherId =
          r.teacherProfileId ?? r.teacherProfile?.id ?? r.teacherId;
        return String(rTeacherId) === String(teacherId);
      });
      setIsReported(reported);
    } catch (err) {
      console.log(err);
    }
  };

  const handleRemoveReport = async () => {
    if (reportBusy) return;
    if (!window.confirm("Remove your report for this educator?")) return;

    setReportBusy(true);
    try {
      await api.delete("/report", {
        params: { studentProfileId, teacherProfileId: teacherId },
      });
      setIsReported(false);
      setToast("Report removed.");
    } catch (err) {
      console.log(err);
      alert("Unable to remove report. Please try again.");
    } finally {
      setReportBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-slate-950 dark:bg-[#06070B] dark:text-white antialiased relative overflow-hidden">
      
      {/* Premium Minimal Blue & Glass background ambient lighting */}
      <div className="absolute top-[-5%] left-1/4 w-[550px] h-[500px] bg-indigo-500/10 dark:bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-1/4 w-[450px] h-[450px] bg-sky-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative mx-auto max-w-3xl px-6 py-12 sm:px-8 sm:py-16 z-10">
        
        {/* Navigation Action */}
        <button
          onClick={() => navigate(-1)}
          className="group inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          <IconArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
          Back
        </button>

        {loading && (
          <div className="mt-8 h-96 animate-pulse rounded-3xl border-2 border-slate-300 bg-white/70 dark:border-white/20 dark:bg-white/[0.02]" />
        )}

        {!loading && loadError && (
          <div className="mt-8 rounded-2xl border-2 border-rose-300 bg-rose-500/[0.02] p-8 text-center shadow-sm">
            <p className="text-sm font-bold text-rose-600 dark:text-rose-400">{loadError}</p>
            <button
              onClick={loadProfile}
              className="mt-4 rounded-xl bg-rose-600 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-rose-700 transition"
            >
              Try again
            </button>
          </div>
        )}

        {!loading && !loadError && profile && (
          <div className="mt-8 rounded-3xl border-2 border-slate-300 bg-white p-6 sm:p-10 dark:bg-[#0C0E14] dark:border-white/20 shadow-sm space-y-6 group relative overflow-hidden">
            <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full blur-3xl transition-colors duration-300 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/5 pointer-events-none" />

            {/* Public Identity Profile Row */}
            <div className="relative flex flex-col sm:flex-row sm:items-start justify-between gap-5 border-b border-slate-200 dark:border-white/10 pb-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
                <img
                  src={profile.profilePictureUrl || "https://placehold.co/100x100?text=👤"}
                  alt={profile.name}
                  className="h-20 w-20 rounded-2xl border-2 border-slate-300 object-cover bg-slate-50 dark:border-white/30 shrink-0 shadow-sm animate-fade-in"
                />
                <div>
                  <h1 className="text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white">
                    {profile.name}
                  </h1>
                  <p className="mt-1 text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">{profile.language}</p>
                  
                  {profile.paymentMethod && (
                    <span className="mt-2.5 inline-block rounded-full bg-emerald-50 border border-emerald-200 px-3 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-400/20">
                      💳 Accepts {profile.paymentMethod === "BANK" ? "Bank Transfer" : profile.paymentMethod}
                    </span>
                  )}
                </div>
              </div>

              {isStudent && (
                <button
                  onClick={toggleFavourite}
                  disabled={favouriteBusy}
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 shadow-sm transition-all duration-200 ${
                    isFavourite
                      ? "border-rose-400 bg-rose-50 text-rose-600 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-400"
                      : "border-slate-300 bg-white text-slate-400 hover:border-rose-400 hover:bg-rose-50 hover:text-rose-500 dark:border-white/20 dark:bg-[#0C0E14] dark:hover:border-rose-500/40"
                  }`}
                >
                  <IconHeart filled={isFavourite} className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Subjects Cluster Vector */}
            {profile.subjects?.length > 0 && (
              <div className="relative">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Instructed Subjects</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {profile.subjects.map((subject) => (
                    <span
                      key={subject}
                      className="rounded-full bg-indigo-50 border border-indigo-200 px-3 py-1 text-xs font-bold text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300 dark:border-indigo-400/20"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* About Textarea Space */}
            {profile.bio && (
              <div className="relative">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">About Educator</p>
                <p className="mt-2 whitespace-pre-line text-sm font-medium leading-relaxed text-slate-700 dark:text-slate-300">
                  {profile.bio}
                </p>
              </div>
            )}

            {/* Pricing / Valuation Row Block Elements */}
            <div className="relative mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border-2 border-slate-300 bg-slate-50/60 p-5 dark:border-white/20 dark:bg-white/[0.01]">
              <button
                onClick={() => setShowReviews(true)}
                className="flex items-center gap-3 border border-slate-300 bg-white rounded-xl px-3 py-2 text-slate-800 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 hover:border-slate-400 transition shadow-sm"
              >
                <StarRating value={profile.rating || 0} readOnly size="h-4 w-4" />
                <span className="text-sm font-bold">
                  {(profile.rating || 0).toFixed(1)}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  ({profile.numberOfRatings || 0} reviews)
                </span>
              </button>

              {profile.ratePerThirtyMin != null && (
                <div className="text-right">
                  <p className="text-2xl font-black tracking-tight text-indigo-600 dark:text-indigo-400">
                    ₹{profile.ratePerThirtyMin}
                  </p>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">/ 30 min</p>
                </div>
              )}
            </div>

            {/* Core Operation Intent CTA Trigger Button */}
            {isStudent && (
              <div className="relative pt-2">
                <button
                  onClick={() => navigate(`/session-request/${teacherId}`)}
                  className="w-full rounded-xl bg-slate-950 py-3.5 text-xs font-bold uppercase tracking-wider text-white transition-all duration-200 hover:bg-indigo-600 dark:bg-white dark:text-slate-950 dark:hover:bg-indigo-400 dark:hover:text-white shadow-sm"
                >
                  Request Session
                </button>
              </div>
            )}

            {/* Low-Key Moderator Report Action Container Section */}
            {isStudent && (
              <div className="relative pt-2 text-center">
                {isReported ? (
                  <button
                    onClick={handleRemoveReport}
                    disabled={reportBusy}
                    className="text-xs font-bold uppercase tracking-wider text-slate-400 transition hover:text-rose-500 disabled:opacity-50"
                  >
                    {reportBusy ? "Removing report..." : "✓ Reported — remove report"}
                  </button>
                ) : (
                  <button
                    onClick={() => setShowReportModal(true)}
                    className="text-xs font-bold uppercase tracking-wider text-slate-400 transition hover:text-rose-500"
                  >
                    Report this educator
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Global State Toast rendering */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl border border-slate-700 bg-slate-950 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-2xl backdrop-blur-md">
          {toast}
        </div>
      )}

      {/* External Components Mount Overlay Portals */}
      {showReportModal && (
        <ReportTeacherModal
          studentProfileId={studentProfileId}
          teacherProfileId={teacherId}
          teacherName={profile?.name}
          onClose={() => setShowReportModal(false)}
          onSubmitted={() => {
            setShowReportModal(false);
            setIsReported(true);
            setToast("Report submitted. Our team will review it.");
          }}
        />
      )}

      {showReviews && (
        <TeacherReviewsModal
          teacherId={teacherId}
          teacherName={profile?.name}
          onClose={() => setShowReviews(false)}
        />
      )}
    </div>
  );
}

export default TeacherPublicProfilePage;