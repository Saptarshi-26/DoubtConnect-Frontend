import { CheckCircle2, Circle, Lock, X } from "lucide-react";

function formatTime(dateTime) {
  return new Date(dateTime).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function isPastDateSlot(slot) {
  const todayStr = new Date().toISOString().substring(0, 10);
  const slotDateStr = slot.startTime.substring(0, 10);
  return slotDateStr < todayStr;
}

function SlotList({
  selectedDate,
  groupedSlots,
  selectedSlots,
  setSelectedSlots,
  onCancelBookedSlot,
  cancellingSlotId,
}) {
  const slots = groupedSlots[selectedDate] || [];
  const isChecked = (slot) => {
    if (slot.booked) {
      return true;
    }

    return selectedSlots.includes(slot.id)
      ? !slot.available
      : slot.available;
  };

  const toggleSlot = (slotId) => {
    setSelectedSlots((previous) => {
      if (previous.includes(slotId)) {
        return previous.filter((id) => id !== slotId);
      }

      return [...previous, slotId];
    });
  };

  const handleCancelClick = (slot) => {
    if (!onCancelBookedSlot) return;

    const confirmed = window.confirm(
      `This slot is part of a booked session. Cancelling it will cancel the entire session and free up all its slots. Continue?`
    );

    if (confirmed) {
      onCancelBookedSlot(slot.id);
    }
  };

  if (!selectedDate) {
    return (
      <div className="rounded-3xl bg-white dark:bg-[#0C0E14] dark:border dark:border-white/10 p-10 shadow-xl dark:shadow-none">

        <div className="flex h-96 items-center justify-center">

          <div className="text-center">

            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
              Select a Day
            </h2>

            <p className="mt-3 text-slate-500 dark:text-slate-400">
              Choose a date from the calendar.
            </p>

          </div>

        </div>

      </div>
    );
  }

  return (
<div className="rounded-3xl bg-white dark:bg-[#0C0E14] dark:border dark:border-white/10 p-8 shadow-xl dark:shadow-none flex flex-col h-[700px]">
     <div className="sticky top-0 z-10 -mx-8 -mt-8 rounded-t-3xl border-b border-slate-200 dark:border-white/10 bg-white dark:bg-[#0C0E14] px-8 pt-8 pb-5">

  <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
        {new Date(selectedDate).toDateString()}
      </h2>

      <p className="mt-2 text-slate-500 dark:text-slate-400">
        Manage your availability for this day. Click a booked slot to cancel that session.
      </p>
      </div>

<div className="mt-8 flex-1 space-y-4 overflow-y-auto pr-2">
        {slots.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 dark:border-white/15 p-12 text-center text-slate-500 dark:text-slate-400">
            No slots found.
          </div>
        ) : (
          slots.map((slot) => {
            const isPast = !slot.booked && isPastDateSlot(slot);

            return (
              <div
                key={slot.id}
              className={`flex items-center justify-between rounded-2xl border p-5 transition-all duration-200 hover:shadow-md dark:hover:shadow-none hover:-translate-y-0.5

                ${
                  slot.booked
                    ? "border-red-200 bg-red-50 dark:border-red-500/30 dark:bg-red-500/10"
                    : isPast
                    ? "border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/[0.02] opacity-60"
                    : slot.available
                    ? "border-green-200 bg-green-50 dark:border-green-500/30 dark:bg-green-500/10"
                    : "border-slate-200 dark:border-white/10 dark:bg-white/[0.02]"
                }

                `}
              >
                <div>

                  <div className="text-lg font-semibold text-slate-900 dark:text-white">

                    {formatTime(slot.startTime)}

                    {" - "}

                    {formatTime(slot.endTime)}

                  </div>

                  <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">

                    {slot.booked
                      ? "Booked"
                      : isPast
                      ? "Past"
                      : slot.available
                      ? "Available"
                      : "Unavailable"}

                  </div>

                </div>

                {slot.booked ? (
                  <button
                    onClick={() => handleCancelClick(slot)}
                    disabled={cancellingSlotId === slot.id}
                    title="Cancel this booked session"
                    className="flex h-10 w-10 items-center justify-center rounded-full text-red-500 dark:text-red-400 transition hover:bg-red-100 dark:hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {cancellingSlotId === slot.id ? (
                      <span className="text-xs font-semibold">...</span>
                    ) : (
                      <Lock size={22} />
                    )}
                  </button>
                ) : (
                 <button
  onClick={() => {
    if (!slot.booked && !isPast) {
      toggleSlot(slot.id);
    }
  }}
  disabled={slot.booked || isPast}
  title={isPast ? "Can't edit availability for a past date" : undefined}
  className="transition hover:scale-110 disabled:cursor-not-allowed disabled:hover:scale-100"
>
  {isPast ? (
    <Circle
      size={30}
      className="text-slate-300 dark:text-slate-700"
    />
  ) : isChecked(slot) ? (
    <CheckCircle2
      size={30}
      className="text-green-600 dark:text-green-400"
    />
  ) : (
    <Circle
      size={30}
      className="text-slate-400 dark:text-slate-500"
    />
  )}
</button>
                )}

              </div>
            );
          })
        )}

      </div>

    </div>
  );
}

export default SlotList;