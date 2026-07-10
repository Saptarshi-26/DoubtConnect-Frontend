import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  ACCEPTED: "bg-sky-50 text-sky-700 border-sky-300 dark:bg-sky-500/10 dark:text-sky-400 dark:border-sky-500/20",
  BOOKED: "bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
  REJECTED: "bg-red-50 text-red-700 border-red-300 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20",
  CANCELLED: "bg-slate-100 text-slate-600 border-slate-300 dark:bg-white/5 dark:text-slate-400 dark:border-white/10",
};

const CARD_ACCENTS = {
  PENDING: { ring: "hover:border-amber-400 dark:hover:border-amber-500/50", glow: "group-hover:bg-amber-100/30 dark:group-hover:bg-amber-500/5" },
  ACCEPTED: { ring: "hover:border-sky-400 dark:hover:border-sky-500/50", glow: "group-hover:bg-sky-100/30 dark:group-hover:bg-sky-500/5" },
  BOOKED: { ring: "hover:border-emerald-400 dark:hover:border-emerald-500/50", glow: "group-hover:bg-emerald-100/30 dark:group-hover:bg-emerald-500/5" },
  REJECTED: { ring: "hover:border-red-400 dark:hover:border-red-500/50", glow: "group-hover:bg-red-100/30 dark:group-hover:bg-red-500/5" },
  CANCELLED: { ring: "hover:border-slate-400 dark:hover:border-white/20", glow: "group-hover:bg-slate-100/40 dark:group-hover:bg-white/5" },
};

function IconArrowLeft(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M19 12H5M12 19l-7-7 7-7" />
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

function IconCheck(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20 6 9 17l-5-5" />
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

function TeacherSessionRequestsPage() {
  const navigate = useNavigate();
  const teacherProfileId = localStorage.getItem("profileId");

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [filter, setFilter] = useState("PENDING");
  const [actioningId, setActioningId] = useState(null);
  const [lightboxUrl, setLightboxUrl] = useState(null);
  const [toast, setToast] = useState("");

  const [inspectStudent, setInspectStudent] = useState(null);
  const [loadingStudent, setLoadingStudent] = useState(false);

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
      const res = await api.get(`/session/teacher/${teacherProfileId}`);
      setRequests(res.data || []);
    } catch (err) {
      if (err?.response?.status === 404) {
        setRequests([]);
      } else {
        setLoadError("Unable to load session requests. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInspectStudentProfile = async (e, requestRecord) => {
    e.stopPropagation();
    
    // Safely evaluates assignment check patterns without throwing String conversion errors
    const targetId = requestRecord.studentProfileId || requestRecord.studentId;
    if (!targetId || targetId === "undefined") {
      alert("This student data vector is missing or malformed.");
      return;
    }

    setLoadingStudent(true);
    try {
      const res = await api.get(`/student/${targetId}`);
      setInspectStudent(res.data);
    } catch (err) {
      alert(err.response?.data || "Unable to display student specifications.");
    } finally {
      setLoadingStudent(false);
    }
  };

  const counts = useMemo(() => {
    return requests.reduce(
      (acc, r) => {
        acc[r.status] = (acc[r.status] || 0) + 1;
        return acc;
      },
      { PENDING: 0, ACCEPTED: 0, BOOKED: 0, REJECTED: 0, CANCELLED: 0 }
    );
  }, [requests]);

  const visibleRequests = useMemo(() => {
    if (filter === "ALL") return requests;
    return requests.filter((r) => r.status === filter);
  }, [requests, filter]);

  const handleDecision = async (request, decision) => {
    if (request.studentName?.toLowerCase().startsWith("delete")) {
      alert("This student doesn't exists anymore");
      return;
    }

    if (decision === "ACCEPTED") {
      try {
        await api.get("/payout");
      } catch (err) {
        const goToPayout = window.confirm(
          "You haven't added your payment details yet. Students pay you directly, so this needs to be set up before you can accept a session. Add your payment details now?"
        );
        if (goToPayout) {
          navigate("/payout");
        }
        return;
      }
    }

    if (decision === "REJECTED") {
      const confirmed = window.confirm(
        `Reject the request from ${request.studentName}? This can't be undone.`
      );
      if (!confirmed) return;
    }

    setActioningId(request.id);
    try {
      const endpoint = decision === "ACCEPTED" ? "/session/accept" : "/session/reject";
      await api.post(endpoint, {
        sessionRequestId: request.id,
        teacherProfileId: Number(teacherProfileId),
      });

      setRequests((prev) =>
        prev.map((r) => (r.id === request.id ? { ...r, status: decision } : r))
      );
      setToast(
        decision === "ACCEPTED"
          ? `Accepted ${request.studentName}'s request.`
          : `Rejected ${request.studentName}'s request.`
      );
    } catch (err) {
      alert("Unable to update this request. Please try again.");
    } finally {
      setActioningId(null);
    }
  };
  return (
    <div className="min-h-screen bg-[#FAFAF9] text-slate-950 dark:bg-[#06050C] dark:text-white antialiased relative overflow-hidden">
      
      <div className="absolute top-[-10%] left-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-violet-200 to-indigo-300 opacity-40 dark:from-violet-500/10 dark:to-indigo-500/5 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-purple-200 to-fuchsia-300 opacity-35 dark:from-purple-500/5 dark:to-fuchsia-500/5 rounded-full blur-[110px] pointer-events-none" />

      <div className="relative mx-auto max-w-6xl px-6 py-12 sm:px-8 sm:py-16 z-10">
        
        <button onClick={() => navigate("/teacher")} className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"><IconArrowLeft className="h-3.5 w-3.5" />Dashboard</button>

        <div className="mt-6 flex flex-col justify-between gap-6 lg:flex-row lg:items-end border-b border-slate-200 dark:border-white/10 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/80 dark:border-white/20 dark:bg-white/5 backdrop-blur-sm px-3 py-1 text-xs font-semibold tracking-wide text-violet-600 dark:text-violet-400 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-600 dark:bg-violet-400 animate-pulse" />
              Incoming requests stream
            </div>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">Session Requests</h1>
            <p className="mt-2 text-[15px] font-medium text-slate-500 dark:text-slate-400">Review incoming student requests and manage acceptance workflows.</p>
          </div>

          <div className="flex gap-6 rounded-2xl border-2 border-slate-300 bg-white px-6 py-3.5 dark:bg-[#0F0D1A] dark:border-white/20 shadow-sm shrink-0">
            <div className="text-center">
              <p className="text-xl font-black text-amber-500">{counts.PENDING}</p>
              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400 mt-0.5">Pending</p>
            </div>
            <div className="w-[1px] bg-slate-200 dark:bg-white/10" />
            <div className="text-center">
              <p className="text-xl font-black text-sky-500">{counts.ACCEPTED}</p>
              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400 mt-0.5">Accepted</p>
            </div>
            <div className="w-[1px] bg-slate-200 dark:bg-white/10" />
            <div className="text-center">
              <p className="text-xl font-black text-emerald-500">{counts.BOOKED}</p>
              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400 mt-0.5">Booked</p>
            </div>
            <div className="w-[1px] bg-slate-200 dark:bg-white/10" />
            <div className="text-center">
              <p className="text-xl font-black text-rose-400">{counts.REJECTED}</p>
              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400 mt-0.5">Rejected</p>
            </div>
          </div>
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
              {[1, 2, 3, 4].map((i) => <div key={i} className="h-56 animate-pulse rounded-3xl border-2 border-slate-300 bg-white/70 dark:border-white/20 dark:bg-white/[0.02]" />)}
            </div>
          )}

          {!loading && loadError && (
            <div className="rounded-3xl border-2 border-rose-300 bg-rose-500/[0.02] p-8 text-center max-w-xl mx-auto shadow-sm">
              <p className="text-sm font-bold text-rose-600 dark:text-rose-400">{loadError}</p>
              <button onClick={loadRequests} className="mt-4 rounded-xl bg-rose-600 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-rose-700 transition">Try again</button>
            </div>
          )}

          {!loading && !loadError && visibleRequests.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-slate-300 bg-white p-16 text-center dark:border-white/20 dark:bg-[#0F0D1A] shadow-sm max-w-xl mx-auto">
              <IconInbox className="h-12 w-12 text-slate-300 dark:text-slate-600" />
              <h3 className="mt-5 text-lg font-bold text-slate-950 dark:text-white">{filter === "ALL" ? "No session requests yet" : `No ${filter.toLowerCase()} requests`}</h3>
            </div>
          )}

          {!loading && !loadError && visibleRequests.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2">
              {visibleRequests.map((request) => {
                const currentAccent = CARD_ACCENTS[request.status] || CARD_ACCENTS.CANCELLED;
                const isDeletedStudent = request.studentName?.toLowerCase().startsWith("delete");
                const cleanStudentName = isDeletedStudent ? "Student not available" : request.studentName;
                return (
                  <div key={request.id} className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border-2 border-slate-300 bg-white p-6 sm:p-8 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:bg-[#0F0D1A] dark:border-white/20 dark:shadow-none ${currentAccent.ring}`}>
                    <div className={`absolute -top-10 -right-10 h-40 w-40 rounded-full blur-3xl transition-colors duration-300 pointer-events-none ${currentAccent.glow}`} />

                    <div className="relative flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <img src={request.studentProfilePictureUrl || "https://placehold.co/80x80?text=👤"} alt={cleanStudentName} className="h-11 w-11 rounded-xl border border-slate-300 object-cover bg-slate-50 dark:border-white/30 shrink-0" />
                            <div>
                              <p 
                                onClick={(e) => {
                                  if (isDeletedStudent) {
                                    e.stopPropagation();
                                    alert("This student doesn't exists anymore");
                                  } else {
                                    handleInspectStudentProfile(e, request);
                                  }
                                }}
                                className="font-extrabold text-slate-950 dark:text-white cursor-pointer hover:text-violet-600 dark:hover:text-violet-400 underline decoration-dotted"
                              >
                                {cleanStudentName}
                              </p>
                              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Student</p>
                            </div>
                          </div>

                          <span className={`shrink-0 rounded-full border-2 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLES[request.status] || "border-slate-300 bg-slate-50 text-slate-500"}`}>{request.status}</span>
                        </div>

                        <h3 className="mt-6 text-xl font-extrabold tracking-tight text-slate-950 dark:text-white">{request.subject}</h3>

                        {isDeletedStudent ? (
                          <p className="mt-4 text-sm font-bold text-red-500">This student doesn't exists anymore</p>
                        ) : (
                          <p className="mt-2 text-sm font-medium leading-relaxed text-slate-600 dark:text-slate-400 line-clamp-4">{request.description}</p>
                        )}

                        {request.images?.length > 0 && !isDeletedStudent && (
                          <div className="mt-4 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                            {request.images.map((img) => (
                              <img key={img.id} src={img.imageUrl} alt="Attachment asset" onClick={(e) => { e.stopPropagation(); setLightboxUrl(img.imageUrl); }} className="h-16 w-16 shrink-0 cursor-pointer rounded-xl border-2 border-slate-300 object-cover transition duration-150 hover:border-violet-500 hover:scale-[1.02] dark:border-white/20" />
                            ))}
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="mt-6 flex items-center gap-5 border-t border-slate-200 dark:border-white/10 pt-5 text-xs font-bold uppercase tracking-widest text-slate-400">
                          <span className="flex items-center gap-1.5 text-slate-900 dark:text-white"><IconClock className="h-4 w-4 text-slate-400" />{request.sessionDuration} min</span>
                          <span className="flex items-center gap-1.5 text-violet-600 dark:text-violet-400"><IconRupee className="h-4 w-4" />₹{request.totalAmount}</span>
                        </div>

                        {request.status === "PENDING" && !isDeletedStudent && (
                          <div className="mt-6 flex gap-3 relative z-20">
                            <button type="button" onClick={(e) => { e.stopPropagation(); handleDecision(request, "REJECTED"); }} disabled={actioningId === request.id} className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-slate-300 bg-white py-3 text-xs font-bold uppercase tracking-wider text-slate-600 transition hover:border-red-400 hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/30 dark:bg-transparent dark:text-slate-300"><IconX className="h-4 w-4" />Reject</button>
                            <button type="button" onClick={(e) => { e.stopPropagation(); handleDecision(request, "ACCEPTED"); }} disabled={actioningId === request.id} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-violet-600 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-violet-700 shadow-sm disabled:cursor-not-allowed disabled:opacity-50"><IconCheck className="h-4 w-4" />{actioningId === request.id ? "Saving..." : "Accept"}</button>
                          </div>
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

      {/* OVERLAY DTO METRICS PREVIEW MODAL SHEET */}
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

export default TeacherSessionRequestsPage;