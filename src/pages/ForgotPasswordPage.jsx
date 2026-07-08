import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

function IconMail(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function IconCheckCircle(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <path d="M22 4 12 14.01l-3-3" />
    </svg>
  );
}

function ForgotPasswordPage() {
  const [googleEmail, setGoogleEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/reset-password/forgot-password", { googleEmail });
      setSent(true);
    } catch (err) {
      setError(
        err.response?.data ||
          "We couldn't find an account with that email."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#FAFAF9] dark:bg-slate-950">
      {/* Left panel */}
      <div className="relative hidden w-1/2 items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-16 text-white lg:flex">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-indigo-500/20 blur-[100px]" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-blue-500/10 blur-[100px]" />

        <div className="relative max-w-md">
          <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-indigo-400">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
            DoubtConnect
          </p>
          <h1 className="mt-6 text-5xl font-bold leading-tight tracking-tight">
            Forgot your password?
          </h1>
          <p className="mt-8 text-lg leading-8 text-slate-300">
            No worries — we'll email you a link to reset it.
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex flex-1 items-center justify-center p-6 sm:p-8">
        <div className="w-full max-w-md rounded-3xl border border-slate-200/70 bg-white p-10 shadow-[0_2px_8px_rgba(15,23,42,0.04),0_24px_48px_-16px_rgba(15,23,42,0.12)] dark:border-white/10 dark:bg-white/[0.04] dark:shadow-none">
          {!sent ? (
            <form onSubmit={handleSubmit}>
              <h2 className="text-[2.25rem] font-bold tracking-tight text-slate-900 dark:text-white">
                Reset Password
              </h2>

              <p className="mt-3 leading-6 text-slate-500 dark:text-slate-400">
                Enter the email linked to your account and we'll send you a
                reset link.
              </p>

              <div className="relative mt-9">
                <IconMail className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                <input
                  type="email"
                  className="w-full rounded-xl border border-slate-200 bg-white py-4 pl-11 pr-4 text-slate-800 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-indigo-300 focus:shadow-[0_0_0_4px_rgba(99,102,241,0.08)] dark:border-white/10 dark:bg-white/[0.03] dark:text-white dark:placeholder:text-slate-500 dark:focus:border-indigo-400/50"
                  placeholder="Email address"
                  value={googleEmail}
                  onChange={(e) => setGoogleEmail(e.target.value)}
                  required
                />
              </div>

              {error && (
                <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600 dark:border-rose-400/20 dark:bg-rose-500/10 dark:text-rose-300">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-8 w-full rounded-xl bg-slate-900 py-4 font-semibold text-white transition-all duration-200 hover:bg-indigo-600 hover:shadow-[0_8px_24px_-6px_rgba(79,70,229,0.45)] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none dark:bg-white dark:text-slate-900 dark:hover:bg-indigo-500 dark:hover:text-white dark:disabled:bg-slate-700 dark:disabled:text-slate-500"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent opacity-60" />
                    Sending…
                  </span>
                ) : (
                  "Send Reset Link"
                )}
              </button>

              <p className="mt-6 text-center text-slate-500 dark:text-slate-400">
                Remembered your password?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  Back to login
                </Link>
              </p>
            </form>
          ) : (
            <div
              className="opacity-0"
              style={{ animation: "fadeScaleIn 0.4s ease-out forwards" }}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 ring-1 ring-emerald-100 dark:bg-emerald-500/10 dark:ring-emerald-400/20">
                <IconCheckCircle className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
              </div>

              <h2 className="mt-6 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Check your email
              </h2>
              <p className="mt-4 leading-7 text-slate-500 dark:text-slate-400">
                We've sent a password reset link to{" "}
                <strong className="font-semibold text-slate-800 dark:text-slate-200">
                  {googleEmail}
                </strong>
                . It expires in 5 minutes, so use it soon.
              </p>
              <Link
                to="/login"
                className="mt-8 block w-full rounded-xl bg-slate-900 py-4 text-center font-semibold text-white transition-all duration-200 hover:bg-indigo-600 hover:shadow-[0_8px_24px_-6px_rgba(79,70,229,0.45)] dark:bg-white dark:text-slate-900 dark:hover:bg-indigo-500 dark:hover:text-white"
              >
                Back to Login
              </Link>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeScaleIn {
          from {
            opacity: 0;
            transform: scale(0.97);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}

export default ForgotPasswordPage;