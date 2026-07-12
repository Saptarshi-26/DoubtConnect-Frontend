import { ChevronLeft, ChevronRight } from "lucide-react";

function AvailabilityCalendar({
  currentMonth,
  setCurrentMonth,
  selectedDate,
  setSelectedDate,
  groupedSlots,
}) {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const monthTitle = currentMonth.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const firstDay = new Date(year, month, 1);

  const lastDay = new Date(year, month + 1, 0);

  const firstWeekDay = firstDay.getDay();

  const totalDays = lastDay.getDate();

  const cells = [];

  for (let i = 0; i < firstWeekDay; i++) {
    cells.push(null);
  }

  for (let day = 1; day <= totalDays; day++) {
    cells.push(new Date(year, month, day));
  }

  const previousMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  return (
    <div className="rounded-3xl bg-white dark:bg-[#0C0E14] dark:border dark:border-white/10 p-8 shadow-xl dark:shadow-none">

      <div className="mb-8 flex items-center justify-between">

        <button
          onClick={previousMonth}
          className="rounded-xl p-2 text-slate-700 dark:text-slate-300 transition hover:bg-slate-100 dark:hover:bg-white/10"
        >
          <ChevronLeft size={22} />
        </button>

        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          {monthTitle}
        </h2>

        <button
          onClick={nextMonth}
          className="rounded-xl p-2 text-slate-700 dark:text-slate-300 transition hover:bg-slate-100 dark:hover:bg-white/10"
        >
          <ChevronRight size={22} />
        </button>

      </div>

      <div className="mb-5 grid grid-cols-7 text-center text-sm font-semibold text-slate-500 dark:text-slate-400">

        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>

      </div>

      <div className="grid grid-cols-7 gap-3">

        {cells.map((date, index) => {

          if (!date) {
            return (
              <div
                key={index}
                className="aspect-square"
              />
            );
          }

const key =
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
          const slots = groupedSlots[key] || [];

          const hasBooked =
            slots.some((s) => s.booked);

          const hasAvailable =
            slots.some((s) => s.available);

          const isToday =
            key ===
            new Date().toISOString().substring(0, 10);

          const isSelected =
            key === selectedDate;

          return (
            <button
              key={key}
              onClick={() => setSelectedDate(key)}
              className={`aspect-square rounded-2xl border-2 transition-all

              ${
                isSelected
                  ? "border-blue-600 bg-blue-50 dark:border-blue-400 dark:bg-blue-500/10"
                  : "border-slate-200 bg-white hover:border-blue-300 dark:border-white/10 dark:bg-white/[0.02] dark:hover:border-blue-400/60"
              }

              `}
            >

              <div className="mt-2 flex justify-center">

                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-slate-900 dark:text-white

                  ${
                    isToday
                      ? "bg-blue-600 text-white dark:bg-blue-500 dark:text-white"
                      : ""
                  }

                  `}
                >
                  {date.getDate()}
                </span>

              </div>

              <div className="mt-2 flex justify-center">

                {hasBooked ? (
                  <div className="h-2 w-2 rounded-full bg-red-500 dark:bg-red-400" />
                ) : hasAvailable ? (
                  <div className="h-2 w-2 rounded-full bg-green-500 dark:bg-green-400" />
                ) : (
                  <div className="h-2 w-2 rounded-full bg-slate-300 dark:bg-white/15" />
                )}

              </div>

            </button>
          );
        })}

      </div>

    </div>
  );
}

export default AvailabilityCalendar;
