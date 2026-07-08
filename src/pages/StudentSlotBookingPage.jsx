import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

function IconArrowLeft(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}

function IconCheck(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function IconCalendar(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </svg>
  );
}

function formatDayLabel(dateStr) {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function formatTime(dateTimeStr) {
  return new Date(dateTimeStr).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

function StudentSlotBookingPage() {
  const { sessionRequestId } = useParams();
  const navigate = useNavigate();

  const [sessionRequest, setSessionRequest] = useState(null);
  const [loadingRequest, setLoadingRequest] = useState(true);
  const [requestError, setRequestError] = useState("");

  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [slotsError, setSlotsError] = useState("");

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const [booking, setBooking] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [bookedEvent, setBookedEvent] = useState(null);

  useEffect(() => {
    loadSessionRequest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionRequestId]);

  const loadSessionRequest = async () => {
    setLoadingRequest(true);
    setRequestError("");
    try {
      const res = await api.get(`/session/${sessionRequestId}`);
      setSessionRequest(res.data);

      if (res.data.status !== "ACCEPTED") {
        setRequestError(
          `This request is ${res.data.status.toLowerCase()} and can't be booked.`
        );
      } else {
        loadSlots(res.data.teacherId);
      }
    } catch (err) {
      setRequestError("Unable to load this session request.");
    } finally {
      setLoadingRequest(false);
    }
  };

  const studentProfileId = localStorage.getItem("profileId");

  const loadSlots = async (teacherId) => {
    setLoadingSlots(true);
    setSlotsError("");
    try {
      const res = await api.get(
        `/teacher-availability/student/${teacherId}/${studentProfileId}`
      );
      setSlots((res.data || []).filter((s) => s.available && !s.booked));
    } catch (err) {
      setSlotsError("Unable to load this educator's available slots.");
    } finally {
      setLoadingSlots(false);
    }
  };

  const groupedSlots = useMemo(() => {
    const map = {};
    slots.forEach((slot) => {
      const date = slot.startTime.substring(0, 10);
      if (!map[date]) map[date] = [];
      map[date].push(slot);
    });
    Object.values(map).forEach((list) =>
      list.sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
    );
    return map;
  }, [slots]);

  const sortedDates = useMemo(
    () => Object.keys(groupedSlots).sort(),
    [groupedSlots]
  );

  useEffect(() => {
    if (sortedDates.length > 0 && !selectedDate) {
      setSelectedDate(sortedDates[0]);
    }
  }, [sortedDates, selectedDate]);

  const slotsNeeded = sessionRequest
    ? Math.max(1, Math.round(sessionRequest.sessionDuration / 30))
    : null;

  const handleConfirmBooking = async () => {
    if (!selectedSlotId) return;
    setBooking(true);
    setBookingError("");
    try {
      const res = await api.post("/slot-booking/book", null, {
        params: {
          sessionRequestId: Number(sessionRequestId),
          slotId: selectedSlotId,
        },
      });
      setBookedEvent(res.data);
    } catch (err) {
      bookingError(
        "This slot doesn't have enough consecutive free time for this session. Please try a different slot."
      );
    } finally {
      setBooking(false);
    }
  };

  // --- Premium Success Screen State ---
  if (bookedEvent) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAFAF9] text-slate-950 dark:bg-slate-950 dark:text-white px-6 antialiased relative overflow-hidden">
        <div className="absolute top-0 w-full h-[500px] bg-gradient-to-b from-blue-500/10 to-transparent blur-[80px] pointer-events-none" />
        
        <div className="w-full max-w-md rounded-3xl border-2 border-slate-300 bg-white dark:bg-slate-900 dark:border-white/20 p-8 sm:p-10 text-center shadow-xl relative z-10">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
            <IconCheck className="h-6 w-6" />
          </div>
          <h2 className="mt-6 text-2xl font-extrabold tracking-tight">
            Session booked
          </h2>
          <p className="mt-3 text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
            Your session with <span className="font-bold">{sessionRequest?.teacherName}</span> is confirmed for{" "}
            <span className="font-semibold text-slate-950 dark:text-white">
              {new Date(bookedEvent.startTime).toLocaleString(undefined, {
                weekday: "long",
                day: "numeric",
                month: "long",
                hour: "numeric",
                minute: "2-digit",
              })}
            </span>
            .
          </p>
          <div className="mt-8 flex flex-col gap-3">
            <button
              onClick={() => navigate("/student-sessions")}
              className="w-full rounded-xl bg-indigo-600 py-3.5 text-sm font-bold uppercase tracking-wider text-white hover:bg-indigo-700 active:scale-[0.98] transition-all duration-200 shadow-md shadow-indigo-600/10"
            >
              View my sessions
            </button>
            <Link
              to="/student"
              className="w-full rounded-xl border-2 border-slate-300 dark:border-white/20 bg-transparent py-3.5 text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] text-center block transition-all duration-200"
            >
              Back to dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-slate-950 dark:bg-[#06070B] dark:text-white antialiased relative overflow-hidden">
      
      {/* Background soft color lighting shapes */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/10 dark:bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-5%] right-[5%] w-[450px] h-[450px] bg-sky-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative mx-auto max-w-5xl px-6 py-12 sm:px-8 sm:py-16">
        
        {/* Navigation / Header Actions */}
        <button
          onClick={() => navigate("/student-session-requests")}
          className="group inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-800 hover:text-indigo-600 dark:text-slate-200 dark:hover:text-indigo-400 transition-colors duration-200"
        >
          <IconArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
          Back to My Requests
        </button>

        <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-5xl">
          Book a Slot
        </h1>

        {loadingRequest && (
          <p className="mt-6 text-sm font-bold text-slate-500 dark:text-slate-400 animate-pulse">Loading request matrix parameters...</p>
        )}

        {!loadingRequest && requestError && (
          <div className="mt-8 rounded-3xl border-2 border-rose-300 bg-rose-500/[0.02] p-8 text-center max-w-xl mx-auto shadow-sm">
            <p className="text-sm font-bold text-rose-600 dark:text-rose-400">{requestError}</p>
            <Link
              to="/student-session-requests"
              className="mt-4 inline-block rounded-xl bg-rose-600 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-rose-700 transition"
            >
              Back to My Requests
            </Link>
          </div>
        )}

        {!loadingRequest && sessionRequest && !requestError && (
          <>
            {/* Educator Context Header Card */}
            <div className="mt-6 rounded-3xl border-2 border-slate-300 bg-white p-6 sm:p-7 dark:border-white/20 dark:bg-[#0C0E14] shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 border-b border-slate-200 dark:border-white/10 pb-5">
                <div className="flex items-center gap-4">
                  <img
                    src={
                      sessionRequest.teacherProfilePictureUrl ||
                      "https://placehold.co/80x80?text=👤"
                    }
                    alt={sessionRequest.teacherName}
                    className="h-14 w-14 rounded-xl border border-slate-300 object-cover bg-slate-100 dark:border-white/30 shrink-0"
                  />
                  <div>
                    <p className="text-lg font-bold text-slate-950 dark:text-white">
                      {sessionRequest.teacherName}
                    </p>
                    <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mt-0.5">
                      {sessionRequest.subject} · <span className="text-indigo-600 dark:text-indigo-400">{sessionRequest.sessionDuration} min session</span>
                    </p>
                  </div>
                </div>
              </div>
              <p className="mt-4 text-xs font-semibold leading-relaxed text-slate-500 dark:text-slate-400">
                This session configuration requires <span className="font-bold text-slate-950 dark:text-white">{slotsNeeded} consecutive 30-minute block{slotsNeeded > 1 ? "s" : ""}</span>. 
                Select an entry coordinate below — consecutive timeline nodes are synchronized automatically.
              </p>
            </div>

            {/* Main Interactive Scheduler Layout Workspace */}
            <div className="mt-8">
              {loadingSlots && (
                <p className="text-sm font-bold text-slate-500 dark:text-slate-400 animate-pulse">Scanning upcoming slot matrices...</p>
              )}

              {!loadingSlots && slotsError && (
                <div className="rounded-3xl border-2 border-rose-300 bg-rose-500/[0.02] p-8 text-center max-w-xl mx-auto">
                  <p className="text-sm font-bold text-rose-600 dark:text-rose-400">{slotsError}</p>
                </div>
              )}

              {!loadingSlots && !slotsError && sortedDates.length === 0 && (
                <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-slate-300 bg-white p-16 text-center dark:border-white/20 dark:bg-[#0C0E14] shadow-sm max-w-xl mx-auto">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-300 bg-slate-50 text-slate-400 dark:border-white/20 dark:bg-white/5">
                    <IconCalendar className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-slate-950 dark:text-white">
                    No open slots right now
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-medium max-w-xs leading-normal">
                    This educator hasn't opened up any availability vectors yet. Check back soon.
                  </p>
                </div>
              )}

              {!loadingSlots && !slotsError && sortedDates.length > 0 && (
                <div className="grid gap-6 lg:grid-cols-[220px_1fr] items-start">
                  
                  {/* Left Column: Date Selectors list */}
                  <div className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible pb-2 lg:pb-0 scrollbar-none">
                    {sortedDates.map((date) => {
                      const isDateSelected = selectedDate === date;
                      return (
                        <button
                          key={date}
                          type="button"
                          onClick={() => {
                            setSelectedDate(date);
                            setSelectedSlotId(null);
                            setBookingError("");
                          }}
                          className={`shrink-0 rounded-xl px-4 py-3 text-left font-bold text-xs uppercase tracking-wider border-2 transition-all duration-200 ${
                            isDateSelected
                              ? "border-indigo-600 bg-indigo-600 text-white shadow-sm"
                              : "border-slate-300 bg-white text-slate-700 hover:border-slate-400 dark:border-white/20 dark:bg-[#0C0E14] dark:text-slate-300 dark:hover:border-white/40"
                          }`}
                        >
                          {formatDayLabel(date)}
                        </button>
                      );
                    })}
                  </div>

                  {/* Right Column: Time Coordinates Grid Card */}
                  <div className="rounded-3xl border-2 border-slate-300 bg-white p-6 sm:p-7 dark:border-white/20 dark:bg-[#0C0E14] shadow-sm">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200 dark:border-white/10 pb-3">
                      {selectedDate ? formatDayLabel(selectedDate) : "Select a target date"}
                    </h3>

                    <div className="mt-5 grid grid-cols-3 gap-2.5 sm:grid-cols-4">
                      {(groupedSlots[selectedDate] || []).map((slot) => {
                        const isSlotSelected = selectedSlotId === slot.id;
                        return (
                          <button
                            key={slot.id}
                            type="button"
                            onClick={() => {
                              setSelectedSlotId(slot.id);
                              setBookingError("");
                            }}
                            className={`rounded-xl border-2 py-3 text-center text-xs font-bold transition-all duration-200 ${
                              isSlotSelected
                                ? "border-indigo-600 bg-indigo-50 text-indigo-600 dark:border-indigo-400 dark:bg-indigo-400/20 dark:text-indigo-400"
                                : "border-slate-300 bg-white text-slate-700 hover:border-slate-400 dark:border-white/20 dark:bg-[#0C0E14] dark:text-slate-300 dark:hover:border-white/40"
                            }`}
                          >
                            {formatTime(slot.startTime)}
                          </button>
                        );
                      })}
                    </div>

                    {bookingError && (
                      <p className="mt-4 text-xs font-semibold text-rose-600 dark:text-rose-400 leading-normal">· {bookingError}</p>
                    )}

                    {/* Master Action Trigger Button */}
                    <button
                      type="button"
                      onClick={handleConfirmBooking}
                      disabled={!selectedSlotId || booking}
                      className="mt-6 w-full rounded-xl bg-slate-950 py-3.5 text-xs font-bold uppercase tracking-wider text-white transition-all duration-200 hover:bg-indigo-600 dark:bg-white dark:text-slate-950 dark:hover:bg-indigo-400 dark:hover:text-white disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 dark:disabled:bg-white/5 dark:disabled:text-slate-600 shadow-sm"
                    >
                      {booking ? "Confirming Booking variables..." : "Confirm Booking"}
                    </button>
                  </div>

                </div>
              )}
            </div>
          </>
        )}

      </div>
    </div>
  );
}

export default StudentSlotBookingPage;