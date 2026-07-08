import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

const FILTERS = [
  { key: "ALL", label: "All" },
  { key: "PENDING", label: "Pending" },
  { key: "ACCEPTED", label: "Accepted" },
  { key: "BOOKED", label: "Booked" },
  { key: "REJECTED", label: "Rejected" },
  { key: "CANCELLED", label: "Cancelled" },
];

const STATUS_STYLES = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
  ACCEPTED: "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-300 dark:bg-fuchsia-500/10 dark:text-fuchsia-400 dark:border-fuchsia-500/20",
  BOOKED: "bg-indigo-50 text-indigo-700 border-indigo-300 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20",
  REJECTED: "bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20",
  CANCELLED: "bg-slate-100 text-slate-600 border-slate-300 dark:bg-white/5 dark:text-slate-400 dark:border-white/10",
};

const REQUEST_ACCENTS = {
  PENDING: { ring: "hover:border-amber-400 dark:hover:border-amber-500/50", glow: "group-hover:bg-amber-100/40 dark:group-hover:bg-amber-500/5" },
  ACCEPTED: { ring: "hover:border-fuchsia-400 dark:hover:border-fuchsia-500/50", glow: "group-hover:bg-fuchsia-100/40 dark:group-hover:bg-fuchsia-500/5" },
  BOOKED: { ring: "hover:border-indigo-400 dark:hover:border-indigo-500/50", glow: "group-hover:bg-indigo-100/40 dark:group-hover:bg-indigo-500/5" },
  REJECTED: { ring: "hover:border-rose-400 dark:hover:border-rose-500/50", glow: "group-hover:bg-rose-100/40 dark:group-hover:bg-rose-500/5" },
  CANCELLED: { ring: "hover:border-slate-400 dark:hover:border-white/30", glow: "group-hover:bg-slate-100/40 dark:group-hover:bg-white/5" },
};

function IconArrowLeft(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}

function IconClock(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  );
}

function IconRupee(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M6 4h12M6 8h12M6 8c5 0 8 1.5 8 4.5S11 17 6 17M6 17l8 7" />
    </svg>
  );
}

function IconX(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

function IconCalendarPlus(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4M12 14v5M9.5 16.5h5" />
    </svg>
  );
}

function IconInbox(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"
      strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 12h-6l-2 3h-4l-2-3H2" />
      <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </svg>
  );
}

function StudentSessionRequestsPage() {
  const navigate = useNavigate();
  const studentProfileId = localStorage.getItem("profileId");

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [actioningId, setActioningId] = useState(null);
  const [lightboxUrl, setLightboxUrl] = useState(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    loadRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const loadRequests = async () => {
    setLoading(true);
    setLoadError("");
    try {
      const res = await api.get(`/session/student/${studentProfileId}`);
      setRequests(res.data || []);
    } catch (err) {
      if (err?.response?.status === 404) {
        setRequests([]);
      } else {
        setLoadError("Unable to load your session requests. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const counts = useMemo(() => {
    return requests.reduce((acc, r) => {
      acc[r.status] = (acc[r.status] || 0) + 1;
      return acc;
    }, {});
  }, [requests]);

  const visibleRequests = useMemo(() => {
    if (filter === "ALL") return requests;
    return requests.filter((r) => r.status === filter);
  }, [requests, filter]);

  const handleCancel = async (request) => {
    if (request.teacherName?.toLowerCase().startsWith("delete")) {
      alert("This teacher doesn't exists anymore");
      return;
    }

    const confirmed = window.confirm(
      `Cancel your request to ${request.teacherName}? This can't be undone.`
    );
    if (!confirmed) return;

    setActioningId(request.id);
    try {
      await api.delete(`/session/delete/${request.id}`);
      setRequests((prev) => prev.filter((r) => r.id !== request.id));
      setToast("Request cancelled.");
    } catch (err) {
      alert("Unable to cancel this request. Please try again.");
    } finally {
      setActioningId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBFB] text-slate-950 dark:bg-[#09070F] dark:text-white selection:bg-fuchsia-600 selection:text-white antialiased relative overflow-hidden">
      
      <div className="absolute top-[-5%] left-1/4 w-[600px] h-[500px] bg-fuchsia-300/30 dark:bg-fuchsia-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-1/4 w-[500px] h-[500px] bg-violet-200/40 dark:bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative mx-auto max-w-6xl px-6 py-16 sm:px-8 sm:py-24">
        
        <button
          onClick={() => navigate("/student")}
          className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-fuchsia-600 dark:text-slate-400 dark:hover:text-fuchsia-400 transition-colors duration-200"
        >
          <IconArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
          Back to Dashboard
        </button>

        <div className="mt-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/80 dark:border-white/20 dark:bg-white/5 backdrop-blur-sm px-3 py-1 text-xs font-semibold tracking-wide text-fuchsia-600 dark:text-fuchsia-400 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-fuchsia-600 dark:bg-fuchsia-400 animate-pulse" />
            Proposal track
          </div>
          <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-5xl">
            My Session Requests
          </h1>
          <p className="mt-3 max-w-xl text-[15px] font-medium leading-relaxed text-slate-600 dark:text-slate-300">
            Track the live transmission matrix and state indicators of standard requests dispatched to mentors.
          </p>
        </div>

        <div className="mt-10 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {FILTERS.map((f) => {
            const isSelected = filter === f.key;
            return (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`whitespace-nowrap rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                  isSelected
                    ? "bg-fuchsia-600 text-white shadow-lg shadow-fuchsia-600/20 dark:bg-fuchsia-500"
                    : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-300 dark:bg-white/5 dark:text-slate-300 dark:border-white/20 dark:hover:bg-white/10"
                }`}
              >
                {f.label}
                {f.key !== "ALL" && (
                  <span className={`ml-2 opacity-70 ${isSelected ? "text-white" : "text-slate-400"}`}>
                    {counts[f.key] || 0}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-12">
          {loading && (
            <div className="grid gap-6 md:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-56 animate-pulse rounded-3xl border-2 border-slate-300 bg-white/70 dark:border-white/20 dark:bg-white/[0.03]" />
              ))}
            </div>
          )}

          {!loading && loadError && (
            <div className="rounded-3xl border-2 border-red-300 bg-red-50/50 p-8 text-center backdrop-blur-sm dark:border-red-500/30 dark:bg-red-500/5">
              <p className="text-red-600 dark:text-red-400 font-medium">{loadError}</p>
              <button
                onClick={loadRequests}
                className="mt-4 rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white hover:bg-red-700 transition shadow-lg shadow-red-600/10"
              >
                Try again
              </button>
            </div>
          )}

          {!loading && !loadError && visibleRequests.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-slate-300 bg-white p-16 text-center dark:border-white/20 dark:bg-white/[0.03] shadow-sm">
              <IconInbox className="h-12 w-12 text-slate-300 dark:text-slate-600" />
              <h3 className="mt-5 text-xl font-extrabold tracking-tight text-slate-950 dark:text-white">
                {filter === "ALL" ? "No session requests yet" : `No ${filter.toLowerCase()} requests`}
              </h3>
              <p className="mt-2 max-w-sm text-[14.5px] font-medium leading-relaxed text-slate-500 dark:text-slate-400">
                Browse educators and send your first request to get started.
              </p>
              <Link
                to="/educators"
                className="mt-6 rounded-xl bg-fuchsia-600 px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-fuchsia-700 shadow-lg shadow-fuchsia-600/20"
              >
                Browse Educators
              </Link>
            </div>
          )}

          {!loading && !loadError && visibleRequests.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2">
              {visibleRequests.map((request) => {
                const currentAccent = REQUEST_ACCENTS[request.status] || REQUEST_ACCENTS.CANCELLED;
                const isDeletedTeacher = request.teacherName?.toLowerCase().startsWith("delete");
                const cleanTeacherName = isDeletedTeacher ? "Teacher not available" : request.teacherName;
                return (
                  <div
                    key={request.id}
                    onClick={() => {
                      if (isDeletedTeacher) {
                        alert("This teacher doesn't exists anymore");
                      }
                    }}
                    className={`group relative flex flex-col overflow-hidden rounded-3xl border-2 border-slate-300 bg-white p-8 text-left shadow-[0_2px_16px_rgba(0,0,0,0.01)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_-16px_rgba(141,51,210,0.12)] dark:border-white/20 dark:bg-[#110E1A]/60 dark:backdrop-blur-md dark:shadow-none ${currentAccent.ring}`}
                  >
                    <div className={`absolute -top-10 -right-10 h-40 w-40 rounded-full blur-3xl transition-colors duration-300 pointer-events-none ${currentAccent.glow}`} />

                    <div className="relative flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <img
                              src={request.teacherProfilePictureUrl || "https://placehold.co/80x80?text=👤"}
                              alt={cleanTeacherName}
                              className="h-12 w-12 rounded-full object-cover border border-slate-300 dark:border-white/30 ring-2 ring-slate-100 dark:ring-white/10"
                            />
                            <div>
                              <p className="font-extrabold text-slate-950 dark:text-white">
                                {cleanTeacherName}
                              </p>
                              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Educator Node</p>
                            </div>
                          </div>

                          <span className={`shrink-0 rounded-full border-2 px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${
                            STATUS_STYLES[request.status] || "border-slate-300 bg-slate-50 text-slate-500"
                          }`}>
                            {request.status}
                          </span>
                        </div>

                        <h3 className="mt-6 text-xl font-extrabold tracking-tight text-slate-950 dark:text-white">
                          {request.subject}
                        </h3>

                        {isDeletedTeacher ? (
                          <p className="mt-4 text-sm font-bold text-red-500">
                            This teacher doesn't exists anymore
                          </p>
                        ) : (
                          <p className="mt-2 text-[14.5px] font-medium leading-relaxed text-slate-600 dark:text-slate-400 line-clamp-4">
                            {request.description}
                          </p>
                        )}

                        {request.images?.length > 0 && !isDeletedTeacher && (
                          <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
                            {request.images.map((img) => (
                              <img
                                key={img.id}
                                src={img.imageUrl}
                                alt="Attachment"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setLightboxUrl(img.imageUrl);
                                }}
                                className="h-16 w-16 shrink-0 cursor-pointer rounded-xl border border-slate-300 object-cover transition duration-150 hover:border-fuchsia-500 hover:scale-[1.02] dark:border-white/20"
                              />
                            ))}
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="mt-6 flex items-center gap-5 border-t border-slate-200 dark:border-white/10 pt-5 text-xs font-bold uppercase tracking-widest text-slate-400">
                          <span className="flex items-center gap-1.5 text-slate-900 dark:text-white">
                            <IconClock className="h-4 w-4 text-slate-400" />
                            {request.sessionDuration} min
                          </span>
                          <span className="flex items-center gap-1.5 text-fuchsia-600 dark:text-fuchsia-400">
                            <IconRupee className="h-4 w-4" />
                            ₹{request.totalAmount}
                          </span>
                        </div>

                        <div className="mt-6 flex flex-col gap-2.5">
                          {request.status === "ACCEPTED" && !isDeletedTeacher && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/book-slot/${request.id}`);
                              }}
                              className="w-full flex items-center justify-center gap-2 rounded-xl bg-fuchsia-600 py-3 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-fuchsia-700 shadow-lg shadow-fuchsia-600/20"
                            >
                              <IconCalendarPlus className="h-4 w-4" />
                              Book a Slot
                            </button>
                          )}

                          {(request.status === "PENDING" || request.status === "ACCEPTED") && !isDeletedTeacher && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCancel(request);
                              }}
                              disabled={actioningId === request.id}
                              className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-slate-300 bg-white py-3 text-xs font-bold uppercase tracking-widest text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/30 dark:bg-white/5 dark:text-slate-300 dark:hover:border-red-500/20 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                            >
                              <IconX className="h-4 w-4" />
                              {actioningId === request.id ? "Terminating..." : "Cancel Request"}
                            </button>
                          )}

                          {request.status === "BOOKED" && !isDeletedTeacher && (
                            <Link
                              to="/student-sessions"
                              onClick={(e) => e.stopPropagation()}
                              className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-fuchsia-300 py-3 text-xs font-bold uppercase tracking-widest text-fuchsia-600 transition hover:bg-fuchsia-50 dark:border-fuchsia-500/30 dark:text-fuchsia-400 dark:hover:bg-fuchsia-500/10 text-center block"
                            >
                              View in My Sessions
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {lightboxUrl && (
        <div
          onClick={() => setLightboxUrl(null)}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/80 p-6 backdrop-blur-md"
        >
          <button
            onClick={() => setLightboxUrl(null)}
            className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white hover:bg-white/20 border border-white/10"
          >
            <IconX className="h-5 w-5" />
          </button>
          <img
            src={lightboxUrl}
            alt="Attachment enlarged"
            className="max-h-full max-w-full rounded-2xl border border-white/10 shadow-2xl"
          />
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-2xl bg-slate-900 px-6 py-3.5 text-xs font-bold uppercase tracking-widest text-white shadow-xl dark:bg-white dark:text-slate-900">
          {toast}
        </div>
      )}
    </div>
  );
}

export default StudentSessionRequestsPage;