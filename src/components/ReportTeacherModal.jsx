import { useState } from "react";
import api from "../api/axios";

const REASONS = [
  "Inappropriate behavior",
  "No-show / didn't attend session",
  "Poor teaching quality",
  "Harassment",
  "Incorrect payment details",
  "Other",
];

function IconX(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M18 6 6 18" />
      <path d="M6 6l12 12" />
    </svg>
  );
}

/**
 * Modal for a student to report a teacher.
 *
 * Props:
 * - studentProfileId, teacherProfileId
 * - teacherName: string
 * - onClose: () => void
 * - onSubmitted: () => void
 */
function ReportTeacherModal({
  studentProfileId,
  teacherProfileId,
  teacherName,
  onClose,
  onSubmitted,
}) {
  const [reason, setReason] = useState(REASONS[0]);
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    setSubmitting(true);
    try {
      const res = await api.post("/report", null, {
        params: {
          studentProfileId,
          teacherProfileId,
          reason,
          description: description.trim() || undefined,
        },
      });

      if (res.data === false) {
        setError("Unable to submit this report. Please try again.");
        setSubmitting(false);
        return;
      }

      onSubmitted();
    } catch (err) {
      setError(
        err.response?.data || "Something went wrong. Please try again."
      );
      setSubmitting(false);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 sm:p-8"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-[32px] bg-white p-8 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-lg font-bold text-slate-800">
              Report Educator
            </p>
            {teacherName && (
              <p className="text-sm text-slate-400">{teacherName}</p>
            )}
          </div>

          <button
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <IconX className="h-5 w-5" />
          </button>
        </div>

        <p className="mt-4 rounded-xl bg-slate-50 p-3.5 text-sm text-slate-500">
          Reports are reviewed by our team. Please only report genuine
          issues — misuse of this feature may affect your account.
        </p>

        <label className="mt-6 block text-sm font-semibold text-slate-700">
          Reason
        </label>
        <select
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="mt-2 w-full rounded-xl border border-slate-300 p-3.5 outline-none transition focus:border-blue-500"
        >
          {REASONS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        <label className="mt-5 block text-sm font-semibold text-slate-700">
          Additional details (optional)
        </label>
        <textarea
          rows="4"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Tell us what happened..."
          className="mt-2 w-full resize-none rounded-xl border border-slate-300 p-3.5 outline-none transition focus:border-blue-500"
        />

        {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="mt-6 w-full rounded-2xl bg-red-600 py-3.5 font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {submitting ? "Submitting..." : "Submit Report"}
        </button>
      </div>
    </div>
  );
}

export default ReportTeacherModal;
