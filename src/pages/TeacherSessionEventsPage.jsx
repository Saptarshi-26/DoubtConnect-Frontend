import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const FILTERS = [
  { key: "UPCOMING", label: "Upcoming" },
  { key: "ONGOING", label: "Ongoing" },
  { key: "COMPLETED", label: "Completed" },
  { key: "CANCELLED", label: "Cancelled" },
  { key: "ALL", label: "All" },
];

const STATUS_STYLES = {
  UPCOMING: "bg-sky-50 text-sky-700 border-sky-300 dark:bg-sky-500/10 dark:text-sky-400 dark:border-sky-500/20",
  ONGOING: "bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
  COMPLETED: "bg-slate-100 text-slate-600 border-slate-300 dark:bg-white/5 dark:text-slate-400 dark:border-white/10",
  CANCELLED: "bg-red-50 text-red-700 border-red-300 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20",
};

const ACCENT_GLOWS = {
  UPCOMING: { ring: "hover:border-sky-400 dark:hover:border-sky-500/50", glow: "group-hover:bg-sky-100/40 dark:group-hover:bg-sky-500/5" },
  ONGOING: { ring: "hover:border-emerald-400 dark:hover:border-emerald-500/50", glow: "group-hover:bg-emerald-100/40 dark:group-hover:bg-emerald-500/5" },
  COMPLETED: { ring: "hover:border-violet-400 dark:hover:border-violet-500/50", glow: "group-hover:bg-violet-100/40 dark:group-hover:bg-violet-500/5" },
  CANCELLED: { ring: "hover:border-slate-400 dark:hover:border-white/20", glow: "group-hover:bg-slate-100/40 dark:group-hover:bg-white/5" },
  ALL: { ring: "hover:border-slate-400 dark:hover:border-white/20", glow: "group-hover:bg-slate-100/40 dark:group-hover:bg-white/5" }
};

function IconArrowLeft(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}

function IconVideo(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M15 10l5-3v10l-5-3" />
      <rect x="3" y="6" width="12" height="12" rx="2" />
    </svg>
  );
}

function IconRupee(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M6 4h12M6 8h12M6 8c5 0 8 1.5 8 4.5S11 17 6 17M6 17l8 7" />
    </svg>
  );
}

function IconX(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

function IconClock(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  );
}

function IconInbox(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" {...props}>
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

function TeacherSessionEventsPage() {
  const navigate = useNavigate();
  const teacherProfileId = localStorage.getItem("profileId");

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

  // Modal display states for inline DTO preview window
  const [inspectStudent, setInspectStudent] = useState(null);
  const [loadingStudent, setLoadingStudent] = useState(false);

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
      const res = await api.get(`/session-event/teacher/${teacherProfileId}`);
      setEvents(res.data || []);
    } catch (err) {
      setLoadError("Unable to load your sessions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInspectStudentProfile = async (e, eventRecord) => {
    e.stopPropagation();
    
    // Fallback assignment check evaluates targetId safely without running into undefined parameters
    const targetId = eventRecord.studentProfileId || eventRecord.studentId;
    if (!targetId || targetId === "undefined") {
      alert("This student data vector is missing or malformed.");
      return;
    }

    setLoadingStudent(true);
    try {
      const res = await api.get(`/student/${targetId}`);
      setInspectStudent(res.data);
    } catch (err) {
      alert(err.response?.data || "Unable to load student profile records.");
    } finally {
      setLoadingStudent(false);
    }
  };

  const openDetails = async (event) => {
    setDetailEvent(event);
    setRequestDetails(null);

    if (event.studentName?.toLowerCase().startsWith("delete")) {
      setDetailsError("This student doesn't exists anymore");
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
    const list = filter === "ALL" ? events : events.filter((e) => e.eventStatus === filter);
    return [...list].sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
  }, [events, filter]);

  const handleCancel = async (event) => {
    if (event.studentName?.toLowerCase().startsWith("delete")) {
      alert("This student doesn't exists anymore");
      return;
    }

    const confirmed = window.confirm(
      `Cancel your session with ${event.studentName} on ${formatDateTime(event.startTime)}? This can't be undone, and the slot will reopen for other students.`
    );
    if (!confirmed) return;

    setActioningId(event.id);
    try {
      await api.delete("/slot-booking/cancel", { params: { sessionEventId: event.id } });
      setEvents((prev) => prev.map((e) => (e.id === event.id ? { ...e, eventStatus: "CANCELLED" } : e)));
      setDetailEvent((prev) => (prev && prev.id === event.id ? { ...prev, eventStatus: "CANCELLED" } : prev));
      setToast("Session cancelled. The slot is open again.");
    } catch (err) {
      alert("Unable to cancel this session. Please try again.");
    } finally {
      setActioningId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-slate-950 dark:bg-[#06050C] dark:text-white antialiased relative overflow-hidden">
      
      <div className="absolute top-[-10%] left-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-violet-200 to-indigo-300 opacity-40 dark:from-violet-500/10 dark:to-indigo-500/5 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-purple-200 to-fuchsia-300 opacity-35 dark:from-purple-500/5 dark:to-fuchsia-500/5 rounded-full blur-[110px] pointer-events-none" />

      <div className="relative mx-auto max-w-6xl px-6 py-12 sm:px-8 sm:py-16 z-10">
        
        <button onClick={() => navigate("/teacher")} className="group inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 transition-colors">
          <IconArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
          Back to Dashboard
        </button>

        <div className="mt-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/80 dark:border-white/20 dark:bg-white/5 backdrop-blur-sm px-3 py-1 text-xs font-semibold tracking-wide text-violet-600 dark:text-violet-400 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-600 dark:bg-violet-400 animate-pulse" />
            Instructor ledger
          </div>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">My Sessions</h1>
          <p className="mt-2 text-[15px] font-medium text-slate-500 dark:text-slate-400">Track booked room slots and launch active Google Meet learning streams.</p>
        </div>

        <div className="mt-8 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {FILTERS.map((f) => (
            <button key={f.key} onClick={() => setFilter(f.key)} className={`whitespace-nowrap rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-widest transition-all duration-200 ${filter === f.key ? "bg-violet-600 text-white shadow-md shadow-violet-600/10 dark:bg-violet-500" : "bg-white text-slate-600 hover:bg-slate-50 border-2 border-slate-300 dark:bg-[#0F0D1A] dark:text-slate-300 dark:border-white/20 dark:hover:bg-white/10"}`}>
              {f.label} {f.key !== "ALL" && <span className={`ml-2 opacity-70 ${filter === f.key ? "text-white" : "text-slate-400"}`}>{counts[f.key] || 0}</span>}
            </button>
          ))}
        </div>

        <div className="mt-8">
          {loading && (
            <div className="grid gap-6 md:grid-cols-2">
              {[1, 2, 3, 4].map((i) => <div key={i} className="h-48 animate-pulse rounded-3xl border-2 border-slate-300 bg-white/70 dark:border-white/20 dark:bg-white/[0.02]" />)}
            </div>
          )}

          {!loading && loadError && (
            <div className="rounded-3xl border-2 border-rose-300 bg-rose-500/[0.02] p-8 text-center max-w-xl mx-auto shadow-sm">
              <p className="text-sm font-bold text-rose-600 dark:text-rose-400">{loadError}</p>
              <button onClick={loadEvents} className="mt-4 rounded-xl bg-rose-600 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-rose-700 transition">Try again</button>
            </div>
          )}

          {!loading && !loadError && visibleEvents.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-slate-300 bg-white p-16 text-center dark:border-white/20 dark:bg-[#0F0D1A] shadow-sm max-w-xl mx-auto">
              <IconInbox className="h-12 w-12 text-slate-300 dark:text-slate-600" />
              <h3 className="mt-5 text-lg font-bold text-slate-950 dark:text-white">{filter === "ALL" ? "No sessions yet" : `No ${filter.toLowerCase()} sessions`}</h3>
            </div>
          )}

          {!loading && !loadError && visibleEvents.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2">
              {visibleEvents.map((event) => {
                const currentAccent = ACCENT_GLOWS[event.eventStatus] || ACCENT_GLOWS.ALL;
                const isDeletedStudent = event.studentName?.toLowerCase().startsWith("delete");
                const cleanStudentName = isDeletedStudent ? "Student not available" : event.studentName;
                return (
                  <div key={event.id} onClick={() => openDetails(event)} className={`group relative flex cursor-pointer flex-col overflow-hidden rounded-3xl border-2 border-slate-300 bg-white p-6 sm:p-8 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:bg-[#0F0D1A] dark:border-white/20 dark:shadow-none ${currentAccent.ring}`}>
                    <div className={`absolute -top-10 -right-10 h-40 w-40 rounded-full blur-3xl transition-colors duration-300 pointer-events-none ${currentAccent.glow}`} />

                    <div className="relative flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <img src={event.studentProfilePictureUrl || "https://placehold.co/80x80?text=👤"} alt={cleanStudentName} className="h-11 w-11 rounded-xl border border-slate-300 object-cover bg-slate-50 dark:border-white/30 shrink-0" />
                            <div>
                              <p 
                                onClick={(e) => {
                                  if (isDeletedStudent) {
                                    e.stopPropagation();
                                    alert("This student doesn't exists anymore");
                                  } else {
                                    handleInspectStudentProfile(e, event);
                                  }
                                }}
                                className="font-extrabold text-slate-950 dark:text-white cursor-pointer hover:text-violet-600 dark:hover:text-violet-400 underline decoration-dotted animate-pulse-short"
                              >
                                {cleanStudentName}
                              </p>
                              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Student Entry</p>
                            </div>
                          </div>
                          <span className={`shrink-0 rounded-full border-2 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLES[event.eventStatus] || "border-slate-300 bg-slate-50 text-slate-500"}`}>{event.eventStatus}</span>
                        </div>

                        <p className="mt-6 text-xl font-extrabold tracking-tight text-slate-950 dark:text-white">{formatDateTime(event.startTime)}</p>
                        <p className="mt-1 text-xs font-semibold text-slate-400">until {formatDateTime(event.endTime)}</p>

                        {event.paymentAvailable && (
                          <span className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-0.5 text-[11px] font-bold tracking-wide text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"><IconRupee className="h-3.5 w-3.5" />Payment credentials linked</span>
                        )}
                      </div>

                      <div className="mt-6 flex flex-wrap gap-2.5 relative z-20">
                        {event.meetLink && (event.eventStatus === "UPCOMING" || event.eventStatus === "ONGOING") && !isDeletedStudent && (
                          <a href={event.meetLink} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-violet-600 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-violet-700 shadow-sm text-center"><IconVideo className="h-4 w-4" />Join Meet</a>
                        )}
                        {event.eventStatus === "UPCOMING" && (
                          <button type="button" onClick={(e) => { e.stopPropagation(); handleCancel(event); }} disabled={actioningId === event.id} className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-slate-300 bg-white py-3 text-xs font-bold uppercase tracking-wider text-slate-600 transition hover:border-red-400 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/30 dark:bg-transparent dark:text-slate-300"><IconX className="h-4 w-4" />{actioningId === event.id ? "Dropping..." : "Cancel"}</button>
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

      {/* Main Detail modal layer layout */}
      {detailEvent && (
        <div onClick={closeDetails} className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm sm:p-8">
          <div onClick={(e) => e.stopPropagation()} className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[32px] border-2 border-slate-300 bg-white p-8 shadow-2xl dark:border-white/20 dark:bg-[#0F0D1A]">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-5">
              <div className="flex items-center gap-4">
                <img src={detailEvent.studentProfilePictureUrl || "https://placehold.co/80x80?text=👤"} alt="Student Profile" className="h-14 w-14 rounded-xl border border-slate-300 object-cover bg-slate-50 dark:border-white/20 shrink-0" />
                <div>
                  <p 
                    onClick={(e) => {
                      if (detailEvent.studentName?.toLowerCase().startsWith("delete")) {
                        alert("This student doesn't exists anymore");
                      } else {
                        handleInspectStudentProfile(e, detailEvent);
                      }
                    }}
                    className="text-lg font-extrabold text-slate-950 dark:text-white cursor-pointer hover:text-violet-600 dark:hover:text-violet-400 underline decoration-dotted"
                  >
                    {detailEvent.studentName?.toLowerCase().startsWith("delete") ? "Student not available" : detailEvent.studentName}
                  </p>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Student Base Profile</p>
                </div>
              </div>
              <button type="button" onClick={closeDetails} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-400 border border-slate-300 transition hover:bg-slate-50 hover:text-slate-600 dark:border-white/20 dark:hover:bg-white/5"><IconX className="h-5 w-5" /></button>
            </div>

            <span className={`mt-5 inline-block rounded-full border-2 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLES[detailEvent.eventStatus] || "border-slate-300 bg-slate-50 text-slate-500"}`}>{detailEvent.eventStatus}</span>

            <div className="mt-5 grid gap-4 rounded-2xl border-2 border-slate-300 bg-slate-50/60 p-5 sm:grid-cols-2 dark:border-white/20 dark:bg-white/[0.01]">
              <div>
                <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400"><IconClock className="h-3.5 w-3.5" />Starts</p>
                <p className="mt-1 font-extrabold text-slate-950 dark:text-white">{formatDateTime(detailEvent.startTime)}</p>
              </div>
              <div>
                <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400"><IconClock className="h-3.5 w-3.5" />Ends</p>
                <p className="mt-1 font-extrabold text-slate-950 dark:text-white">{formatDateTime(detailEvent.endTime)}</p>
              </div>
            </div>

            {loadingDetails && <p className="mt-6 text-xs font-bold tracking-wide text-slate-400 animate-pulse">Fetching request parameters...</p>}
            {(!loadingDetails && detailsError) && <p className="mt-6 text-sm font-bold text-rose-500">{detailsError}</p>}

            {!loadingDetails && requestDetails && (
              <>
                <div className="mt-6">
                  <h3 className="text-xl font-extrabold tracking-tight text-slate-950 dark:text-white">{requestDetails.subject}</h3>
                  <p className="mt-2 text-sm font-medium leading-relaxed text-slate-600 dark:text-slate-300">{requestDetails.description}</p>
                </div>
                {requestDetails.images?.length > 0 && (
                  <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
                    {requestDetails.images.map((img) => (
                      <img key={img.id} src={img.imageUrl} alt="Attachment" onClick={() => setLightboxUrl(img.imageUrl)} className="h-16 w-16 shrink-0 cursor-pointer rounded-xl border-2 border-slate-300 object-cover transition hover:border-violet-500 dark:border-white/20" />
                    ))}
                  </div>
                )}
                <div className="mt-6 flex items-center gap-6 border-t border-slate-200 pt-5 text-xs font-bold uppercase tracking-widest text-slate-400 dark:border-white/10">
                  <span className="flex items-center gap-1.5 text-slate-950 dark:text-white"><IconClock className="h-4 w-4 text-slate-400" />{requestDetails.sessionDuration} min</span>
                  <span className="flex items-center gap-1.5 text-violet-600 dark:text-violet-400"><IconRupee className="h-4 w-4" />₹{requestDetails.totalAmount}</span>
                </div>
              </>
            )}

            <div className="mt-7 flex flex-wrap gap-3">
              {detailEvent.meetLink && (detailEvent.eventStatus === "UPCOMING" || detailEvent.eventStatus === "ONGOING") && !detailEvent.studentName?.toLowerCase().startsWith("delete") && (
                <a href={detailEvent.meetLink} target="_blank" rel="noreferrer" className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-violet-600 py-3.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-violet-700 shadow-sm text-center w-full"><IconVideo className="h-4 w-4" />Join Meet</a>
              )}
              {detailEvent.eventStatus === "UPCOMING" && (
                <button type="button" onClick={() => handleCancel(detailEvent)} disabled={actioningId === detailEvent.id} className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-slate-300 bg-white py-3.5 text-xs font-bold uppercase tracking-wider text-slate-600 transition hover:border-red-400 hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/30 dark:bg-transparent dark:text-slate-300"><IconX className="h-4 w-4" />{actioningId === detailEvent.id ? "Dropping..." : "Cancel Session"}</button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* DTO VIEWER MODAL: POPPED INLINE FOR DTO OBJECTS DESCRIPTION */}
      {inspectStudent && (
        <div onClick={() => setInspectStudent(null)} className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-md">
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md overflow-hidden rounded-3xl border-2 border-slate-300 bg-white p-6 shadow-2xl dark:border-white/20 dark:bg-[#0D0B14]">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4 dark:border-white/5">
              <h4 className="text-sm font-black uppercase tracking-widest text-slate-400">Student Profile Blueprint</h4>
              <button type="button" onClick={() => setInspectStudent(null)} className="text-slate-400 hover:text-slate-600"><IconX className="h-4 w-4" /></button>
            </div>
            
            <div className="mt-6 flex flex-col items-center text-center">
              <img src={inspectStudent.profilePictureUrl || "https://placehold.co/120x120?text=👤"} alt={inspectStudent.name} className="h-20 w-20 rounded-2xl border-2 border-slate-200 object-cover shadow-sm bg-slate-50 dark:border-white/10" />
              <h3 className="mt-4 text-xl font-black text-slate-950 dark:text-white">{inspectStudent.name}</h3>
              <p className="text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400 mt-0.5">Verified Student DTO</p>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3 dark:border-white/5 dark:bg-white/[0.01]">
                <p className="text-[10px] font-bold uppercase text-slate-400">Grade</p>
                <p className="mt-1 text-sm font-extrabold text-slate-950 dark:text-white">{inspectStudent.grade || "N/A"}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3 dark:border-white/5 dark:bg-white/[0.01]">
                <p className="text-[10px] font-bold uppercase text-slate-400">Board</p>
                <p className="mt-1 text-sm font-extrabold text-slate-950 dark:text-white">{inspectStudent.board || "N/A"}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3 dark:border-white/5 dark:bg-white/[0.01]">
                <p className="text-[10px] font-bold uppercase text-slate-400">Language</p>
                <p className="mt-1 text-sm font-extrabold text-slate-950 dark:text-white">{inspectStudent.language || "N/A"}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {loadingStudent && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/20 backdrop-blur-[1px]">
          <div className="rounded-xl bg-slate-950 px-4 py-2.5 text-xs font-bold text-white uppercase tracking-wider animate-bounce">Loading profile node...</div>
        </div>
      )}

      {lightboxUrl && (
        <div onClick={() => setLightboxUrl(null)} className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/80 p-6 backdrop-blur-md">
          <button type="button" onClick={() => setLightboxUrl(null)} className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white hover:bg-white/20 border border-white/10"><IconX className="h-5 w-5" /></button>
          <img src={lightboxUrl} alt="Attachment enlarged" className="max-h-full max-w-full rounded-2xl border border-white/10 shadow-2xl" />
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl border border-slate-700 bg-slate-950 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-2xl backdrop-blur-md">{toast}</div>
      )}
    </div>
  );
}

export default TeacherSessionEventsPage;