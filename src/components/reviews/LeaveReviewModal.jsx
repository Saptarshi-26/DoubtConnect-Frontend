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
 * Modal that lets a student rate (1-5 stars) and review a COMPLETED,
 * not-yet-rated session event. Sends one atomic request so a partial
 * rating-without-review (or vice versa) can never happen.
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
    if (!review.trim()) {
      setError("Please write a short review.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post("/feedback/submit", {
        sessionEventId: event.id,
        rating,
        review: review.trim(),
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
        className="w-full max-w-md rounded-[32px] bg-white p-8 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={
                event.teacherProfilePictureUrl ||
                "https://placehold.co/80x80?text=👤"
              }
              alt={event.teacherName}
              className="h-14 w-14 rounded-full border object-cover"
            />
            <div>
              <p className="text-lg font-bold text-slate-800">
                Rate your session
              </p>
              <p className="text-sm text-slate-400">with {event.teacherName}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <IconX className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-7 flex justify-center">
          <StarRating value={rating} onChange={setRating} />
        </div>

        <div className="mt-7 flex items-center justify-between">
          <label className="font-medium text-slate-700">
            Write a review
          </label>
          <span
            className={`text-xs ${
              review.length > REVIEW_LIMIT ? "text-red-500" : "text-slate-400"
            }`}
          >
            {review.length}/{REVIEW_LIMIT}
          </span>
        </div>
        <textarea
          rows="4"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="How was your experience? Was your doubt resolved?"
          className="mt-3 w-full resize-none rounded-2xl border border-slate-300 p-4 outline-none transition focus:border-blue-500"
        />

        {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="mt-6 w-full rounded-2xl bg-blue-600 py-3.5 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {submitting ? "Submitting..." : "Submit Review"}
        </button>
      </div>
    </div>
  );
}

export default LeaveReviewModal;