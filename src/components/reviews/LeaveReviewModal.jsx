import { useState } from "react";
import api from "../../api/axios";
import StarRating from "./StarRating";

function IconX(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M18 6 6 18" />
      <path d="M6 6l12 12" />
    </svg>
  );
}

const REVIEW_LIMIT = 500;

/**
 * Modal that lets a student rate (1-5 stars) and optionally review a
 * COMPLETED, not-yet-rated session event. A star rating is required; the
 * written review is optional — a student can submit a rating-only
 * feedback with no text. Sends one atomic request.
 *
 * Props:
 * - event: the session event object ({ id, teacherName, teacherProfilePictureUrl })
 * - onClose: () => void
 * - onSubmitted: (eventId) => void
 */
function LeaveReviewModal({ event, onClose, onSubmitted }) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");

    if (rating < 1 || rating > 5) {
      setError("Please select a star rating.");
      return;
    }

    const trimmedReview = review.trim();
    if (trimmedReview.length > REVIEW_LIMIT) {
      setError(`Review must be ${REVIEW_LIMIT} characters or fewer.`);
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post("/feedback/submit", {
        sessionEventId: event.id,
        rating,
        // Send null instead of an empty string when no review was written,
        // so a rating-only submission doesn't get stored as a blank review.
        review: trimmedReview || null,
      });

      if (res.data !== "Feedback submitted") {
        setError(res.data || "Unable to submit feedback.");
        setSubmitting(false);
        return;
      }

      onSubmitted(event.id);
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
        className="w-full max-w-md rounded-[32px] bg-white p-8 shadow-2xl dark:bg-[#0C0E14] dark:border dark:border-white/10"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={
                event.teacherProfilePictureUrl ||
                "https://placehold.co/80x80?text=👤"
              }
              alt={event.teacherName}
              className="h-14 w-14 rounded-full border object-cover dark:border-white/20"
            />
            <div>
              <p className="text-lg font-bold text-slate-800 dark:text-white">
                Rate your session
              </p>
              <p className="text-sm text-slate-400 dark:text-slate-400">with {event.teacherName}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-white/10 dark:hover:text-slate-200"
          >
            <IconX className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-7 flex justify-center">
          <StarRating value={rating} onChange={setRating} />
        </div>

        <div className="mt-7 flex items-center justify-between">
          <label className="font-medium text-slate-700 dark:text-slate-200">
            Write a review <span className="font-normal text-slate-400 dark:text-slate-500">(optional)</span>
          </label>
          <span
            className={`text-xs ${
              review.length > REVIEW_LIMIT ? "text-red-500" : "text-slate-400 dark:text-slate-500"
            }`}
          >
            {review.length}/{REVIEW_LIMIT}
          </span>
        </div>
        <textarea
          rows="4"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="How was your experience? Was your doubt resolved? (optional)"
          className="mt-3 w-full resize-none rounded-2xl border border-slate-300 p-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 dark:border-white/20 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-400"
        />

        {error && <p className="mt-3 text-sm text-red-500 dark:text-red-400">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={submitting || rating < 1}
          className="mt-6 w-full rounded-2xl bg-blue-600 py-3.5 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-400 dark:disabled:bg-white/10"
        >
          {submitting ? "Submitting..." : "Submit Review"}
        </button>
      </div>
    </div>
  );
}

export default LeaveReviewModal;
