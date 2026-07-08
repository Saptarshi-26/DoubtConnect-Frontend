import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import LeaveReviewModal from "../components/reviews/LeaveReviewModal";

const FILTERS = [
  { key: "UPCOMING", label: "Upcoming" },
  { key: "ONGOING", label: "Ongoing" },
  { key: "COMPLETED", label: "Completed" },
  { key: "CANCELLED", label: "Cancelled" },
  { key: "ALL", label: "All" },
];

const STATUS_STYLES = {
  UPCOMING: "bg-sky-50 text-sky-600 border-sky-300 dark:bg-sky-500/10 dark:text-sky-400 dark:border-sky-500/20",
  ONGOING: "bg-emerald-50 text-emerald-600 border-emerald-300 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
  COMPLETED: "bg-slate-100 text-slate-600 border-slate-300 dark:bg-white/5 dark:text-slate-400 dark:border-white/10",
  CANCELLED: "bg-red-50 text-red-600 border-red-300 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20",
};

function IconArrowLeft(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}

const FILTER_ACCENTS = {
  UPCOMING: { ring: "hover:border-sky-400 dark:hover:border-sky-400/60", glow: "group-hover:bg-sky-200/50 dark:group-hover:bg-sky-500/10" },
  ONGOING: { ring: "hover:border-emerald-400 dark:hover:border-emerald-400/60", glow: "group-hover:bg-emerald-200/50 dark:group-hover:bg-emerald-500/10" },
  COMPLETED: { ring: "hover:border-indigo-400 dark:hover:border-indigo-400/60", glow: "group-hover:bg-indigo-200/50 dark:group-hover:bg-indigo-500/10" },
  CANCELLED: { ring: "hover:border-rose-400 dark:hover:border-rose-400/60", glow: "group-hover:bg-rose-200/50 dark:group-hover:bg-rose-500/10" },
  ALL: { ring: "hover:border-slate-400 dark:hover:border-slate-400/60", glow: "group-hover:bg-slate-200/50 dark:group-hover:bg-slate-500/10" }
};

function IconVideo(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M15 10l5-3v10l-5-3" />
      <rect x="3" y="6" width="12" height="12" rx="2" />
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

function IconStar(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2.5l2.9 6.2 6.8.7-5.1 4.6 1.5 6.7L12 17.6l-6.1 3.1 1.5-6.7L2.3 9.4l6.8-.7L12 2.5z" />
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

function IconInbox(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"
      strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 12h-6l-2 3h-4l-2-3H2" />
      <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </svg>
  );
}

function formatDateTime(dateTimeStr) {
  return new Date(dateTimeStr).toLocaleString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

function StudentSessionEventsPage() {
  const navigate = useNavigate();
  const studentProfileId = localStorage.getItem("profileId");

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [filter, setFilter] = useState("UPCOMING");
  const [actioningId, setActioningId] = useState(null);
  const [toast, setToast] = useState("");

  const [detailEvent, setDetailEvent] = useState(null);
  const [requestDetails, setRequestDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [detailsError, setDetailsError] = useState("");
  const [lightboxUrl, setLightboxUrl] = useState(null);
  const [reviewEvent, setReviewEvent] = useState(null);

  useEffect(() => {
    loadEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const loadEvents = async () => {
    setLoading(true);
    setLoadError("");
    try {
      const res = await api.get(`/session-event/student/${studentProfileId}`);
      setEvents(res.data || []);
    } catch (err) {
      setLoadError("Unable to load your sessions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const openDetails = async (event) => {
    setDetailEvent(event);
    setRequestDetails(null);

    if (event.teacherName?.toLowerCase().startsWith("delete")) {
      setDetailsError("This teacher doesn't exists anymore");
      setLoadingDetails(false);
      return;
    }

    setDetailsError("");
    setLoadingDetails(true);
    try {
      const res = await api.get(`/session/${event.sessionRequestId}`);
      setRequestDetails(res.data);
    } catch (err) {
      setDetailsError("Unable to load the full request details.");
    } finally {
      setLoadingDetails(false);
    }
  };

  const closeDetails = () => {
    setDetailEvent(null);
    setRequestDetails(null);
    setDetailsError("");
  };

  const counts = useMemo(() => {
    return events.reduce((acc, e) => {
      acc[e.eventStatus] = (acc[e.eventStatus] || 0) + 1;
      return acc;
    }, {});
  }, [events]);

  const visibleEvents = useMemo(() => {
    const list =
      filter === "ALL" ? events : events.filter((e) => e.eventStatus === filter);
    return [...list].sort(
      (a, b) => new Date(a.startTime) - new Date(b.startTime)
    );
  }, [events, filter]);

  const handleCancel = async (event) => {
    if (event.teacherName?.toLowerCase().startsWith("delete")) {
      alert("This teacher doesn't exists anymore");
      return;
    }

    const confirmed = window.confirm(
      `Cancel your session with ${event.teacherName} on ${formatDateTime(
        event.startTime
      )}? This can't be undone.`
    );
    if (!confirmed) return;

    setActioningId(event.id);
    try {
      await api.delete("/slot-booking/cancel", {
        params: { sessionEventId: event.id },
      });
      setEvents((prev) =>
        prev.map((e) =>
          e.id === event.id ? { ...e, eventStatus: "CANCELLED" } : e
        )
      );
      setDetailEvent((prev) =>
        prev && prev.id === event.id ? { ...prev, eventStatus: "CANCELLED" } : prev
      );
      setToast("Session cancelled.");
    } catch (err) {
      alert("Unable to cancel this session. Please try again.");
    } finally {
      setActioningId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-slate-950 dark:bg-slate-950 dark:text-white selection:bg-indigo-600 selection:text-white antialiased relative overflow-hidden">
      
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-200/40 dark:bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-emerald-100/40 dark:bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative mx-auto max-w-6xl px-6 py-16 sm:px-8 sm:py-24">
        
        <button
          onClick={() => navigate("/student")}
          className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors duration-200"
        >
          <IconArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
          Back to Dashboard
        </button>

        <div className="mt-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/80 dark:border-white/20 dark:bg-white/5 backdrop-blur-sm px-3 py-1 text-xs font-semibold tracking-wide text-indigo-600 dark:text-indigo-400">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-pulse" />
            Student sessions
          </div>
          <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-5xl">
            My Sessions
          </h1>
          <p className="mt-3 max-w-xl text-[15px] font-medium leading-relaxed text-slate-600 dark:text-slate-300">
            Your booked sessions and confirmed Google Meet streaming connections organized inside premium interface cards.
          </p>
        </div>

        <div className="mt-10 flex gap-2 overflow-x-auto pb-2">
          {FILTERS.map((f) => {
            const isSelected = filter === f.key;
            return (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`whitespace-nowrap rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                  isSelected
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 dark:bg-indigo-500"
                    : "bg-white text-slate-600 hover:bg-slate-50 border-2 border-slate-300 dark:bg-white/5 dark:text-slate-300 dark:border-white/20 dark:hover:bg-white/10"
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
                <div key={i} className="h-48 animate-pulse rounded-3xl border-2 border-slate-300 bg-white/70 dark:border-white/20 dark:bg-white/[0.03]" />
              ))}
            </div>
          )}

          {!loading && loadError && (
            <div className="rounded-3xl border-2 border-red-300 bg-red-50/50 p-8 text-center backdrop-blur-sm dark:border-red-500/30 dark:bg-red-500/5">
              <p className="text-red-600 dark:text-red-400 font-medium">{loadError}</p>
              <button
                onClick={loadEvents}
                className="mt-4 rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white hover:bg-red-700 transition shadow-lg shadow-red-600/10"
              >
                Try again
              </button>
            </div>
          )}

          {!loading && !loadError && visibleEvents.length === 0 && (
            <div className="flex flex-col items-center rounded-3xl border-2 border-slate-300 bg-white p-16 text-center dark:border-white/20 dark:bg-white/[0.03] shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
              <IconInbox className="h-12 w-12 text-slate-300 dark:text-slate-600" />
              <h3 className="mt-5 text-xl font-extrabold tracking-tight text-slate-950 dark:text-white">
                {filter === "ALL" ? "No sessions yet" : `No ${filter.toLowerCase()} sessions`}
              </h3>
              <p className="mt-2 max-w-sm text-[14.5px] font-medium leading-relaxed text-slate-500 dark:text-slate-400">
                Once you book a slot with an educator, it'll show up here.
              </p>
            </div>
          )}

          {!loading && !loadError && visibleEvents.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2">
              {visibleEvents.map((event) => {
                const currentAccent = FILTER_ACCENTS[event.eventStatus] || FILTER_ACCENTS.ALL;
                const isDeletedTeacher = event.teacherName?.toLowerCase().startsWith("delete");
                const cleanTeacherName = isDeletedTeacher ? "Teacher not available" : event.teacherName;
                return (
                  <div
                    key={event.id}
                    onClick={() => openDetails(event)}
                    className={`group relative flex cursor-pointer flex-col overflow-hidden rounded-3xl border-2 border-slate-300 bg-white p-8 text-left shadow-[0_1px_3px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_-16px_rgba(15,23,42,0.14)] dark:border-white/20 dark:bg-white/[0.03] dark:shadow-none ${currentAccent.ring}`}
                  >
                    <div className={`absolute -top-10 -right-10 h-40 w-40 rounded-full blur-3xl transition-colors duration-300 pointer-events-none ${currentAccent.glow}`} />

                    <div className="relative flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-4">
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              if (isDeletedTeacher) {
                                alert("This teacher doesn't exists anymore");
                                return;
                              }
                              navigate(`/educators/${event.teacherId}`);
                            }}
                            className="flex cursor-pointer items-center gap-4 group/teacher"
                          >
                            <img
                              src={event.teacherProfilePictureUrl || "https://placehold.co/80x80?text=👤"}
                              alt={cleanTeacherName}
                              className="h-12 w-12 rounded-full object-cover border border-slate-300 dark:border-white/30 ring-2 ring-slate-100 dark:ring-white/10"
                            />
                            <div>
                              <p className="font-extrabold text-slate-950 dark:text-white group-hover/teacher:text-indigo-600 dark:group-hover/teacher:text-indigo-400 transition-colors duration-200">
                                {cleanTeacherName}
                              </p>
                              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Educator</p>
                            </div>
                          </div>

                          <span className={`shrink-0 rounded-full border-2 px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${
                            STATUS_STYLES[event.eventStatus] || "border-slate-300 bg-slate-50 text-slate-500"
                          }`}>
                            {event.eventStatus}
                          </span>
                        </div>

                        <p className="mt-6 text-xl font-extrabold tracking-tight text-slate-950 dark:text-white">
                          {formatDateTime(event.startTime)}
                        </p>
                        <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                          until {formatDateTime(event.endTime)}
                        </p>

                        {event.paymentAvailable && event.sessionPaymentDetailsDto && (
                          <div className="mt-5 rounded-2xl border-2 border-emerald-300 bg-emerald-50/40 p-5 dark:border-emerald-500/30 dark:bg-emerald-500/5">
                            <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                              <IconRupee className="h-4 w-4" />
                              Pay your educator directly
                            </p>

                            {event.sessionPaymentDetailsDto.upiId ? (
                              <p className="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
                                <span className="font-bold text-slate-400 uppercase tracking-wider text-xs block mb-0.5">UPI ID</span>
                                {event.sessionPaymentDetailsDto.upiId}
                              </p>
                            ) : (
                              <div className="mt-3 space-y-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                                <p><span className="font-bold text-slate-400 uppercase tracking-wider text-[11px] block">Account holder</span>{event.sessionPaymentDetailsDto.accountHolderName}</p>
                                <p><span className="font-bold text-slate-400 uppercase tracking-wider text-[11px] block">Account number</span>{event.sessionPaymentDetailsDto.accountNumber}</p>
                                <p><span className="font-bold text-slate-400 uppercase tracking-wider text-[11px] block">IFSC</span>{event.sessionPaymentDetailsDto.ifscCode}</p>
                              </div>
                            )}

                            <p className="mt-3 text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                              Pay your educator directly for this session — the amount was agreed when you sent the request.
                            </p>
                          </div>
                        )}

                        {event.paymentAvailable && !event.sessionPaymentDetailsDto && (
                          <span className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold tracking-wide text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20">
                            <IconRupee className="h-3.5 w-3.5" />
                            Payment details released
                          </span>
                        )}
                      </div>

                      <div className="mt-8 flex flex-wrap gap-3">
                        {event.meetLink && (event.eventStatus === "UPCOMING" || event.eventStatus === "ONGOING") && !isDeletedTeacher && (
                          <a
                            href={event.meetLink}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 text-center"
                          >
                            <IconVideo className="h-4 w-4" />
                            Join Meet
                          </a>
                        )}

                        {event.eventStatus === "UPCOMING" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCancel(event);
                            }}
                            disabled={actioningId === event.id}
                            className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-slate-300 bg-white py-3 text-xs font-bold uppercase tracking-widest text-slate-600 transition hover:border-red-400 hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/30 dark:bg-white/5 dark:text-slate-300 dark:hover:border-red-500/20 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                          >
                            <IconX className="h-4 w-4" />
                            {actioningId === event.id ? "Cancelling..." : "Cancel"}
                          </button>
                        )}

                        {event.eventStatus === "COMPLETED" && !event.rated && !isDeletedTeacher && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setReviewEvent(event);
                            }}
                            className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-amber-300 py-3 text-xs font-bold uppercase tracking-widest text-amber-600 transition hover:bg-amber-500 hover:text-white hover:border-amber-500 dark:border-amber-500/30 dark:text-amber-400 dark:hover:bg-amber-500 dark:hover:text-white"
                          >
                            <IconStar className="h-4 w-4" />
                            Leave a Review
                          </button>
                        )}

                        {event.eventStatus === "COMPLETED" && event.rated && !isDeletedTeacher && (
                          <span className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-50 border border-slate-300 py-3 text-xs font-bold uppercase tracking-widest text-slate-400 dark:bg-white/5 dark:border-white/20 dark:text-slate-500">
                            <IconStar className="h-4 w-4" />
                            Reviewed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-2xl bg-slate-900 px-6 py-3.5 text-xs font-bold uppercase tracking-widest text-white shadow-xl dark:bg-white dark:text-slate-900">
          {toast}
        </div>
      )}

      {detailEvent && (
        <div
          onClick={closeDetails}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm sm:p-8"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[32px] border-2 border-slate-300 bg-white p-8 shadow-2xl dark:border-white/20 dark:bg-[#0C0E14]"
          >
            <div className="flex items-start justify-between gap-4">
              <div
                onClick={() => {
                  if (detailEvent.teacherName?.toLowerCase().startsWith("delete")) {
                    alert("This teacher doesn't exists anymore");
                    return;
                  }
                  navigate(`/educators/${detailEvent.teacherId}`);
                }}
                className="flex cursor-pointer items-center gap-4 group/modal-t"
              >
                <img
                  src={detailEvent.teacherProfilePictureUrl || "https://placehold.co/80x80?text=👤"}
                  alt={detailEvent.teacherName?.toLowerCase().startsWith("delete") ? "Teacher not available" : detailEvent.teacherName}
                  className="h-14 w-14 rounded-full object-cover border border-slate-300 dark:border-white/30 ring-2 ring-slate-100 dark:ring-white/10"
                />
                <div>
                  <p className="text-lg font-extrabold text-slate-950 dark:text-white group-hover/modal-t:text-indigo-600 dark:group-hover/modal-t:text-indigo-400 transition-colors">
                    {detailEvent.teacherName?.toLowerCase().startsWith("delete") ? "Teacher not available" : detailEvent.teacherName}
                  </p>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Educator</p>
                </div>
              </div>

              <button
                onClick={closeDetails}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-400 border border-slate-300 transition hover:bg-slate-50 hover:text-slate-600 dark:border-white/20 dark:hover:bg-white/5"
              >
                <IconX className="h-5 w-5" />
              </button>
            </div>

            <span className={`mt-5 inline-block rounded-full border-2 px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${
              STATUS_STYLES[detailEvent.eventStatus] || "border-slate-300 bg-slate-50 text-slate-500"
            }`}>
              {detailEvent.eventStatus}
            </span>

            <div className="mt-5 grid gap-4 rounded-2xl border-2 border-slate-300 bg-slate-50/50 p-5 sm:grid-cols-2 dark:border-white/20 dark:bg-white/[0.02]">
              <div>
                <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-slate-400">
                  <IconClock className="h-3.5 w-3.5" />
                  Starts
                </p>
                <p className="mt-1 font-extrabold text-slate-950 dark:text-white">
                  {formatDateTime(detailEvent.startTime)}
                </p>
              </div>
              <div>
                <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-slate-400">
                  <IconClock className="h-3.5 w-3.5" />
                  Ends
                </p>
                <p className="mt-1 font-extrabold text-slate-950 dark:text-white">
                  {formatDateTime(detailEvent.endTime)}
                </p>
              </div>
            </div>

            {loadingDetails && (
              <p className="mt-6 text-sm font-semibold text-slate-400 animate-pulse">Loading request details...</p>
            )}

            {(!loadingDetails && detailsError) && (
              <p className="mt-6 text-sm font-bold text-red-500">{detailsError}</p>
            )}

            {!loadingDetails && requestDetails && (
              <>
                <div className="mt-6">
                  <h3 className="text-xl font-extrabold tracking-tight text-slate-950 dark:text-white">
                    {requestDetails.subject}
                  </h3>
                  <p className="mt-2 text-[14.5px] font-medium leading-relaxed text-slate-600 dark:text-slate-300">
                    {requestDetails.description}
                  </p>
                </div>

                {requestDetails.images?.length > 0 && (
                  <div className="mt-4 flex gap-2 overflow-x-auto">
                    {requestDetails.images.map((img) => (
                      <img
                        key={img.id}
                        src={img.imageUrl}
                        alt="Attachment"
                        onClick={() => setLightboxUrl(img.imageUrl)}
                        className="h-16 w-16 shrink-0 cursor-pointer rounded-xl border-2 border-slate-300 object-cover transition hover:opacity-80 hover:border-indigo-500 dark:border-white/20"
                      />
                    ))}
                  </div>
                )}

                <div className="mt-6 flex items-center gap-6 border-t border-slate-200 pt-5 text-xs font-bold uppercase tracking-widest text-slate-400 dark:border-white/10">
                  <span className="flex items-center gap-1.5 text-slate-900 dark:text-white">
                    <IconClock className="h-4 w-4 text-slate-400" />
                    {requestDetails.sessionDuration} min
                  </span>
                  <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
                    <IconRupee className="h-4 w-4" />
                    ₹{requestDetails.totalAmount}
                  </span>
                </div>
              </>
            )}

            {detailEvent.paymentAvailable && detailEvent.sessionPaymentDetailsDto && !detailEvent.teacherName?.toLowerCase().startsWith("delete") && (
              <div className="mt-6 rounded-2xl border-2 border-emerald-300 bg-emerald-50/40 p-5 dark:border-emerald-500/30 dark:bg-emerald-500/5">
                <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                  <IconRupee className="h-3.5 w-3.5" />
                  Pay your educator directly
                </p>

                {detailEvent.sessionPaymentDetailsDto.upiId ? (
                  <p className="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
                    <span className="font-bold text-slate-400 uppercase tracking-wider text-xs block mb-0.5">UPI ID</span>
                    {detailEvent.sessionPaymentDetailsDto.upiId}
                  </p>
                ) : (
                  <div className="mt-3 space-y-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                    <p><span className="font-bold text-slate-400 uppercase tracking-wider text-[11px] block">Account holder</span>{detailEvent.sessionPaymentDetailsDto.accountHolderName}</p>
                    <p><span className="font-bold text-slate-400 uppercase tracking-wider text-[11px] block">Account number</span>{detailEvent.sessionPaymentDetailsDto.accountNumber}</p>
                    <p><span className="font-bold text-slate-400 uppercase tracking-wider text-[11px] block">IFSC</span>{detailEvent.sessionPaymentDetailsDto.ifscCode}</p>
                  </div>
                )}
              </div>
            )}

            {detailEvent.meetLink && (detailEvent.eventStatus === "UPCOMING" || detailEvent.eventStatus === "ONGOING") && !detailEvent.teacherName?.toLowerCase().startsWith("delete") && (
              <a
                href={detailEvent.meetLink}
                target="_blank"
                rel="noreferrer"
                className="mt-7 flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 text-center w-full"
              >
                <IconVideo className="h-4 w-4" />
                Join Meet
              </a>
            )}
          </div>
        </div>
      )}

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
    </div>
  );
}

export default StudentSessionEventsPage;