import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import AvailabilityCalendar from "../components/availability/AvailabilityCalendar";
import SlotList from "../components/availability/SlotList";
import AvailabilityToolbar from "../components/availability/AvailabilityToolbar";

function IconArrowLeft(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}

function TeacherAvailabilityPage() {
  const profileId = localStorage.getItem("profileId");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [cancellingSlotId, setCancellingSlotId] = useState(null);

  const [slots, setSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Tracks the previous selectedDate so we only clear selections on an
  // actual date *change*, not on the initial mount (when it goes null -> first date).
  const previousDateRef = useRef(null);

  useEffect(() => {
    loadSlots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadSlots = async () => {
    try {
      const res = await api.get(`/teacher-availability/${profileId}`);
      if (Array.isArray(res.data)) {
        setSlots(res.data);
      } else {
        setSlots([]);
      }
    } catch {
      setSlots([]);
    } finally {
      setLoading(false);
    }
  };

  const generateNextMonth = async () => {
    try {
      setGenerating(true);
      const res = await api.post(`/teacher-availability/generate/${profileId}`);
      await loadSlots();

      if (Array.isArray(res.data) && res.data.length === 0) {
        alert("No new slots were generated.");
      } else {
        alert("Next month's availability generated successfully.");
      }
    } catch (error) {
      if (error.response?.data) {
        alert(error.response.data);
      } else {
        alert("Failed to generate availability.");
      }
    } finally {
      setGenerating(false);
    }
  };

 const saveAvailability = async () => {
    try {
      setSaving(true);

      const todayStr = new Date().toISOString().substring(0, 10);

      const availableIds = [];
      let droppedPastSelections = 0;

      slots.forEach((slot) => {
        if (slot.booked) return;

        const slotDateStr = slot.startTime.substring(0, 10);
        if (slotDateStr < todayStr) {
          // Selection on a past-date slot should never reach the payload.
          // Track it so we can tell the user their toggle was ignored,
          // instead of silently claiming success.
          if (selectedSlots.includes(slot.id)) droppedPastSelections++;
          return;
        }

        const shouldBeAvailable = selectedSlots.includes(slot.id)
          ? !slot.available
          : slot.available;

        if (shouldBeAvailable) {
          availableIds.push(slot.id);
        }
      });

      if (droppedPastSelections > 0 && availableIds.length === 0 && selectedSlots.length === droppedPastSelections) {
        // Every selected slot was a past-date slot — nothing was actually saved.
        alert("Can't update availability for past dates. No changes were made.");
        setSelectedSlots([]);
        return;
      }

      await api.put(`/teacher-availability/available/${profileId}`, availableIds);

      await loadSlots();
      setSelectedSlots([]);

      if (droppedPastSelections > 0) {
        alert("Availability updated successfully. Note: past-date selections were ignored.");
      } else {
        alert("Availability updated successfully.");
      }
    } catch (error) {
      if (error.response?.data) {
        alert(error.response.data);
      } else {
        alert("Failed to update availability.");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCancelBookedSlot = async (slotId) => {
  try {
    setCancellingSlotId(slotId);
    await api.put(`/teacher-availability/cancel/${profileId}`, [slotId]);
    await loadSlots();
    alert("Session cancelled and slots are now unavailable.");
  } catch (error) {
    if (typeof error.response?.data === "string") {
      alert(error.response.data);
    } else {
      alert("Failed to cancel this session.");
    }
  } finally {
    setCancellingSlotId(null);
  }
};
  const groupedSlots = useMemo(() => {
    const map = {};
    slots.forEach((slot) => {
      const date = slot.startTime.substring(0, 10);
      if (!map[date]) {
        map[date] = [];
      }
      map[date].push(slot);
    });
    return map;
  }, [slots]);

  // Default date: earliest date that is today or later, not just
  // whichever date happened to come first in the raw slots array.
  useEffect(() => {
    if (selectedDate) return;

    const dates = Object.keys(groupedSlots).sort();
    if (dates.length === 0) return;

    const todayStr = new Date().toISOString().substring(0, 10);
    const nextAvailable = dates.find((d) => d >= todayStr);

    const initialDate = nextAvailable || dates[dates.length - 1];
    previousDateRef.current = initialDate;
    setSelectedDate(initialDate);
  }, [groupedSlots, selectedDate]);

  // Clear any selected (but unsaved) slot toggles whenever the viewed
  // date actually changes, so switching dates never carries stale
  // selections from a previous date into the next save.
  useEffect(() => {
    if (selectedDate === null) return;
    if (previousDateRef.current === selectedDate) return;

    previousDateRef.current = selectedDate;
    setSelectedSlots([]);
  }, [selectedDate]);

  const monthName = currentMonth.toLocaleString("default", { month: "long" });
  const year = currentMonth.getFullYear();

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-slate-950 dark:bg-slate-950 dark:text-white selection:bg-emerald-600 selection:text-white antialiased relative overflow-hidden">
      
      {/* Premium background mesh layers in custom Emerald theme */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[500px] bg-emerald-100/50 dark:bg-emerald-600/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[450px] h-[450px] bg-teal-100/40 dark:bg-teal-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-6 py-12 sm:px-8 sm:py-16">
        
        {/* Navigation Action */}
        <Link
          to="/teacher"
          className="group inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 transition-colors"
        >
          <IconArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
          Back to Dashboard
        </Link>

        {/* Header Block Section */}
        <div className="mt-6 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 dark:border-white/10 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/80 dark:border-white/20 dark:bg-white/[0.06] backdrop-blur-sm px-3 py-1 text-xs font-semibold tracking-wide text-emerald-700 dark:text-emerald-400 shadow-sm dark:shadow-none">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-pulse" />
              Availability Engine
            </div>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-5xl">
              Manage Availability
            </h1>
            <p className="mt-2 text-[15px] font-medium text-slate-600 dark:text-slate-400">
              Configure and allocate calendar vectors where students can lock slots for video sessions.
            </p>
          </div>
        </div>

        {/* Master Toolbar Wrapper */}
        <div className="mt-8 rounded-3xl border-2 border-slate-300 bg-white p-4 dark:bg-[#0C0E14] dark:border-white/20 shadow-sm dark:shadow-none">
          <AvailabilityToolbar
            generating={generating}
            saving={saving}
            selectedSlots={selectedSlots}
            onGenerate={generateNextMonth}
            onSave={saveAvailability}
          />
        </div>

        {/* Conditional Core Layout Workspace */}
        {loading ? (
          <div className="py-32 text-center text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 animate-pulse">
            Synchronizing calendar timeline configurations...
          </div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[400px_1fr] items-start">
            
            {/* Calendar Card Component Frame */}
            <div className="rounded-3xl border-2 border-slate-300 bg-white p-6 dark:bg-[#0C0E14] dark:border-white/20 shadow-sm dark:shadow-none group relative overflow-hidden">
              <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full blur-3xl transition-colors duration-300 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-500/5 pointer-events-none" />
              <div className="relative">
                <AvailabilityCalendar
                  currentMonth={currentMonth}
                  setCurrentMonth={setCurrentMonth}
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                  groupedSlots={groupedSlots}
                />
              </div>
            </div>

            {/* Selected Coordinates SlotList Frame */}
            <div className="rounded-3xl border-2 border-slate-300 bg-white p-6 dark:bg-[#0C0E14] dark:border-white/20 shadow-sm dark:shadow-none group relative overflow-hidden">
              <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full blur-3xl transition-colors duration-300 group-hover:bg-teal-50/50 dark:group-hover:bg-teal-500/5 pointer-events-none" />
              <div className="relative">
                <SlotList
                  selectedDate={selectedDate}
                  groupedSlots={groupedSlots}
                  selectedSlots={selectedSlots}
                  setSelectedSlots={setSelectedSlots}
                  onCancelBookedSlot={handleCancelBookedSlot}
                  cancellingSlotId={cancellingSlotId}
                />
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

export default TeacherAvailabilityPage;
