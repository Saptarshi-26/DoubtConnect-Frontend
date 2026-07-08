import { CalendarPlus, Save, Loader2 } from "lucide-react";
function AvailabilityToolbar({
  generating,
  saving,
  selectedSlots,
  onGenerate,
  onSave,
  onCancel,
}) {
  return (
   <div className="sticky top-6 rounded-3xl bg-white p-6 shadow-xl border border-slate-200">

      <div className="flex flex-wrap gap-4">

        <button
          onClick={onGenerate}
          disabled={generating}
          className="flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {generating ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <CalendarPlus size={20} />
          )}

          Generate Next Month
        </button>

        <button
          onClick={onSave}
          disabled={saving || selectedSlots.length === 0}
          className="flex items-center gap-2 rounded-2xl bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <Save size={20} />
          )}

          Save Availability
        </button>

       

      </div>

      <div className="mt-5 text-sm text-slate-500">

        {selectedSlots.length === 0
          ? "No slots selected."
          : `${selectedSlots.length} slot(s) selected.`}

      </div>

    </div>
  );
}

export default AvailabilityToolbar;