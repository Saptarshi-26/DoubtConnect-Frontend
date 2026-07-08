import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import api from "../api/axios";

// Luxury Decorative & Functional Icons
function IconShieldKey(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <circle cx="12" cy="11" r="1" />
      <path d="M12 12v3" />
    </svg>
  );
}

function IconAlert(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function IconSuccess(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword.length < 6) {
      setError("Password parameters must extend past 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Password fields do not match parameter alignments.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/reset-password/reset-password", {
        token,
        newPassword,
      });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2500);
    } catch (err) {
      setError(
        err.response?.data ||
          "This dynamic token identity has expired or is structurally invalid."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-950 dark:bg-[#090A0F] dark:text-white antialiased relative overflow-hidden">
      
      {/* Dynamic Structural Split Grid Panel */}
      <div className="hidden lg:flex w-[45%] bg-[#030407] border-r border-slate-900 text-white flex-col justify-between p-16 relative overflow-hidden">
        {/* Subtle internal abstract light flare */}
        <div className="absolute -top-20 -left-20 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md px-3 py-1 text-xs font-semibold tracking-wider text-indigo-400">
            <span>Security Terminal</span>
          </div>
        </div>

        <div className="relative z-10 my-auto">
          <p className="text-sm font-mono tracking-widest uppercase text-slate-500">Infrastructure</p>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight leading-[1.15] text-white">
            Establish new <br />account authorization.
          </h1>
          <p className="mt-4 text-[15px] font-medium leading-relaxed text-slate-400 max-w-sm">
            Update your authentication metrics to deploy robust cryptographic verification layers across your node.
          </p>
        </div>

        <div className="relative z-10 text-xs font-mono tracking-wide text-slate-600">
          © DoubtConnect System Protocol
        </div>
      </div>

      {/* Interactive Operational Input Terminal Area */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="absolute top-12 right-12 w-[300px] h-[300px] bg-indigo-500/5 dark:bg-indigo-600/5 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="w-full max-w-[440px] rounded-2xl border-2 border-slate-950/10 bg-white p-8 shadow-xl dark:border-white/10 dark:bg-[#11131C] dark:shadow-2xl sm:p-10 transition-all">
          
          {!token ? (
            <div className="text-center py-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 border border-rose-200/50 dark:border-rose-500/20">
                <IconAlert className="h-6 w-6" />
              </div>
              <h2 className="mt-6 text-xl font-bold tracking-tight text-slate-950 dark:text-white">
                Missing Identity Token
              </h2>
              <p className="mt-2 text-[14px] font-medium leading-relaxed text-slate-600 dark:text-slate-400">
                This transaction sequence lacks active verification indicators. Please dispatch another routing link request.
              </p>
              <Link
                to="/forgot-password"
                className="mt-8 flex w-full items-center justify-center rounded-xl bg-slate-950 py-3.5 text-xs font-bold uppercase tracking-widest text-white transition-all duration-300 hover:bg-indigo-600 dark:bg-white dark:text-slate-950 dark:hover:bg-indigo-500 dark:hover:text-white"
              >
                Request New Link
              </Link>
            </div>
          ) : success ? (
            <div className="text-center py-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-500/20">
                <IconSuccess className="h-6 w-6" />
              </div>
              <h2 className="mt-6 text-xl font-bold tracking-tight text-slate-950 dark:text-white">
                Credentials Transformed
              </h2>
              <p className="mt-2 text-[14px] font-medium leading-relaxed text-slate-600 dark:text-slate-400 animate-pulse">
                System routing synchronizing. Redirecting back to gateway interface shortly...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/10">
                  <IconShieldKey className="h-4 w-4" />
                </div>
                <h2 className="text-xl font-bold tracking-tight text-slate-950 dark:text-white">
                  Reset Password
                </h2>
              </div>

              <p className="mt-3 text-[13.5px] font-medium text-slate-600 dark:text-slate-400">
                Commit a strict, secure phrase sequence below to reset your platform privileges.
              </p>

              {/* Form Input Sequences */}
              <div className="mt-8 space-y-5">
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-950 dark:text-slate-300">
                    New Security Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="mt-2 w-full rounded-xl border-2 border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-950 placeholder:text-slate-400 outline-none transition duration-200 focus:border-slate-950 focus:bg-white focus:ring-4 focus:ring-slate-950/5 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-600 dark:focus:border-white dark:focus:bg-slate-900/40 dark:focus:ring-white/5"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-950 dark:text-slate-300">
                    Confirm Target Alignment
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-2 w-full rounded-xl border-2 border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-950 placeholder:text-slate-400 outline-none transition duration-200 focus:border-slate-950 focus:bg-white focus:ring-4 focus:ring-slate-950/5 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-600 dark:focus:border-white dark:focus:bg-slate-900/40 dark:focus:ring-white/5"
                  />
                </div>
              </div>

              {/* Sophisticated Error Alert Container */}
              {error && (
                <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50/50 p-3.5 text-[13px] font-semibold text-rose-700 dark:border-rose-500/10 dark:bg-rose-500/[0.03]/40 dark:text-rose-400 animate-fadeIn">
                  <IconAlert className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Execution Trigger Button */}
              <button
                type="submit"
                disabled={loading}
                className="mt-6 w-full rounded-xl bg-indigo-600 py-4 text-xs font-bold uppercase tracking-widest text-white transition-all duration-300 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/20 active:scale-[0.99] disabled:bg-slate-200 disabled:text-slate-400 dark:disabled:bg-slate-800 dark:disabled:text-slate-600"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-3">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Committing Metrics...
                  </span>
                ) : (
                  "Update Gateway Password"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordPage;