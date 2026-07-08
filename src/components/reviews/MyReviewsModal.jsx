import { useEffect, useState } from "react";
import api from "../../api/axios";

function IconX(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M18 6 6 18" />
      <path d="M6 6l12 12" />
    </svg>
  );
}

function IconQuote(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M7 7c-2.2 0-4 1.8-4 4v6h6v-6H6.5c0-1.1.9-2 2-2V7zm10 0c-2.2 0-4 1.8-4 4v6h6v-6h-2.5c0-1.1.9-2 2-2V7z" />
    </svg>
  );
}

function IconInbox(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 12h-6l-2 3h-4l-2-3H2" />
      <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </svg>
  );
}

/**
 * Modal that fetches and displays the reviews a student has written.
 *
 * Props:
 * - studentId: number
 * - onClose: () => void
 */
function MyReviewsModal({ studentId, onClose }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadReviews = async () => {
      setLoading(true);
      setLoadError("");
      try {
        const res = await api.get(`/feedback/student/${studentId}`);
        if (!cancelled) setReviews(res.data || []);
      } catch (err) {
        if (!cancelled) {
          console.log(err);
          setLoadError("Unable to load your reviews right now.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadReviews();
    return () => {
      cancelled = true;
    };
  }, [studentId]);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 sm:p-8"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-[32px] bg-white p-8 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-lg font-bold text-slate-800">My Reviews</p>
            <p className="text-sm text-slate-400">
              Reviews you've written for educators
            </p>
          </div>

          <button
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <IconX className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6">
          {loading && (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-20 animate-pulse rounded-2xl bg-slate-100"
                />
              ))}
            </div>
          )}

          {!loading && loadError && (
            <p className="rounded-2xl border border-red-200 bg-red-50 p-5 text-center text-red-600">
              {loadError}
            </p>
          )}

          {!loading && !loadError && reviews.length === 0 && (
            <div className="flex flex-col items-center rounded-2xl bg-slate-50 p-10 text-center">
              <IconInbox className="h-10 w-10 text-slate-300" />
              <p className="mt-4 font-semibold text-slate-700">
                You haven't reviewed anyone yet
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Once you rate a completed session, it'll show up here.
              </p>
            </div>
          )}

          {!loading && !loadError && reviews.length > 0 && (
            <div className="space-y-4">
              {reviews.map((r, idx) => (
                <div
                  key={r.sessionEventId ?? idx}
                  className="rounded-2xl bg-slate-50 p-5"
                >
                  <IconQuote className="h-5 w-5 text-amber-300" />
                  <p className="mt-2 leading-6 text-slate-700">{r.review}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyReviewsModal;
