import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function IconArrowLeft(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M19 12H5" />
      <path d="M12 19l-7-7 7-7" />
    </svg>
  );
}

function IconAlertTriangle(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}

function DeleteTeacherPage() {
  const navigate = useNavigate();
  const teacherProfileId = localStorage.getItem("profileId");

  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    setDeleting(true);
    setError("");
    try {
      await api.delete(`/teacher/${teacherProfileId}`);
      localStorage.clear();
      window.location.href = "/";
    } catch (err) {
      setError(
        err.response?.data || "Unable to delete your account. Please try again."
      );
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] dark:bg-slate-950">
      <div className="mx-auto max-w-2xl px-6 py-10 sm:px-8 sm:py-14">
        <button
          onClick={() => navigate("/teacher-profile")}
          className="group inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors duration-200 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
        >
          <IconArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
          Back to Profile
        </button>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_16px_32px_-12px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/[0.04] dark:shadow-none sm:p-10">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 ring-1 ring-rose-100 dark:bg-rose-500/10 dark:ring-rose-400/20">
            <IconAlertTriangle className="h-7 w-7 text-rose-600 dark:text-rose-400" />
          </div>

          <h1 className="mt-6 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Delete your account?
          </h1>

          <p className="mt-3 leading-7 text-slate-600 dark:text-slate-400">
            This will permanently delete your DoubtConnect account, including
            your subjects, bio, and payout details. Any pending session
            requests and upcoming sessions will be cancelled, and your
            availability slots will be removed. This action cannot be undone.
          </p>

          <div className="mt-6 grid gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 dark:border-white/10 dark:bg-white/[0.03]">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
              This will remove:
            </p>
            <ul className="ml-1 space-y-1 text-sm text-slate-500 dark:text-slate-400">
              <li className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-slate-400" />
                Subjects, bio, and public profile
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-slate-400" />
                Payout details and history
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-slate-400" />
                Availability slots and upcoming sessions
              </li>
            </ul>
          </div>

          {error && (
            <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600 dark:border-rose-400/20 dark:bg-rose-500/10 dark:text-rose-300">
              {error}
            </div>
          )}

          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row">
            <button
              onClick={() => navigate("/teacher-profile")}
              disabled={deleting}
              className="flex-1 rounded-xl border border-slate-200 px-6 py-3 font-semibold text-slate-700 transition-all duration-200 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/[0.05] sm:flex-none"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex-1 rounded-xl bg-rose-600 px-6 py-3 font-semibold text-white transition-all duration-200 hover:bg-rose-500 hover:shadow-[0_4px_16px_-4px_rgba(225,29,72,0.5)] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none dark:disabled:bg-slate-700 sm:flex-none"
            >
              {deleting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Deleting…
                </span>
              ) : (
                "Yes, Delete My Account"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeleteTeacherPage;