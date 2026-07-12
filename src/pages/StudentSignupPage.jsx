import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import api from "../api/axios";

function IconArrowLeft(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}

function StudentSignupPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [googleVerified, setGoogleVerified] = useState(false);
  const [googleEmail, setGoogleEmail] = useState("");
  const [googleIdToken, setGoogleIdToken] = useState("");

  const [formData, setFormData] = useState({
    language: "",
    grade: "",
    board: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!googleVerified) {
      alert("Please verify your Google email first.");
      return;
    }

    if (!formData.language.trim() || !formData.grade.trim() || !formData.board.trim()) {
      alert("Please fill in language, grade, and board.");
      return;
    }

    const payload = {
      role: "STUDENT",
      language: formData.language,
      grade: formData.grade,
      board: formData.board,
      googleIdToken: googleIdToken,
    };

    try {
      setLoading(true);
      const res = await api.post("/auth/signup", payload);
      alert(res.data.message ?? "Successfully registered.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message ?? "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#FDFBF7] dark:bg-[#070610] text-slate-950 dark:text-white antialiased selection:bg-amber-500 selection:text-slate-950 relative overflow-hidden">

      {/* Dynamic sunset-hued vibrant background lighting waves */}
      <div className="absolute top-[-10%] left-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-amber-200 to-orange-300 opacity-40 dark:from-amber-500/10 dark:to-orange-500/5 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-indigo-200 to-purple-300 opacity-40 dark:from-indigo-500/10 dark:to-purple-500/5 rounded-full blur-[110px] pointer-events-none" />

      {/* Left Block Side Panel */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-[#0F1026] via-[#15173C] to-[#0A0B1A] text-white items-center justify-center p-16 border-r-2 border-amber-500/10 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_40%,rgba(245,158,11,0.12),transparent_60%)] pointer-events-none" />
        <div className="max-w-md relative z-10">
          <p className="text-amber-400 font-extrabold uppercase tracking-widest text-xs">
            DoubtConnect
          </p>
          <h1 className="mt-6 text-5xl font-black tracking-tight leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-100 to-orange-200">
            Student
            <br />
            Account
          </h1>
          <p className="mt-8 text-lg font-semibold leading-relaxed text-slate-200">
            Learning shouldn't stop because of one unanswered doubt.
          </p>
          <p className="mt-6 text-sm leading-relaxed text-slate-400 font-medium">
            Verify with Google, tell us a bit about your studies, and you're in.
          </p>
        </div>
      </div>

      {/* Right Input Panel */}
      <div className="flex flex-1 items-center justify-center p-6 sm:p-8 relative z-10">

        <form
          onSubmit={handleSubmit}
          className="w-full max-w-lg rounded-3xl border-2 border-slate-300 bg-white p-8 sm:p-10 dark:bg-[#0D0E22] dark:border-white/20 shadow-[0_4px_24px_rgba(245,158,11,0.03)]"
        >
          <Link
            to="/signup"
            className="group inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 transition-colors"
          >
            <IconArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
            Back
          </Link>

          <h2 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Create Student Account
          </h2>

          <p className="mt-3 text-[15px] font-medium text-slate-500 dark:text-slate-400">
            Verify your Google email, then just a few details to get started.
          </p>

          {/* Google verification moved above the fields — it's the identity source */}
          <div className="mt-8">
            {googleVerified ? (
              <div className="rounded-xl border-2 border-emerald-500 bg-emerald-500/5 dark:border-emerald-400/60 dark:bg-emerald-500/10 py-4 text-center font-extrabold text-sm text-emerald-600 dark:text-emerald-400 shadow-sm">
                ✓ Verified: {googleEmail}
              </div>
            ) : (
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  try {
                    const res = await api.post("/google/verify", {
                      googleIdToken: credentialResponse.credential,
                    });

                    setGoogleVerified(true);
                    setGoogleEmail(res.data.email);
                    setGoogleIdToken(credentialResponse.credential);
                  } catch (err) {
                    alert(err.response?.data?.message ?? "Google verification failed.");
                  }
                }}
                onError={() => {
                  alert("Google verification failed.");
                }}
              />
            )}
          </div>

          <div className="mt-4 space-y-4">
            <input
              type="text"
              placeholder="Preferred Language"
              name="language"
              value={formData.language}
              onChange={handleChange}
              disabled={!googleVerified}
              className="w-full rounded-xl border-2 border-slate-300 p-4 outline-none font-bold text-sm transition bg-slate-50/50 placeholder:text-slate-400 focus:border-amber-500 dark:border-white/15 dark:bg-white/[0.06] dark:text-white dark:placeholder:text-slate-500 dark:focus:border-amber-400 disabled:opacity-50"
            />

            <input
              type="text"
              placeholder="Grade (Example: Class 10)"
              name="grade"
              value={formData.grade}
              onChange={handleChange}
              disabled={!googleVerified}
              className="w-full rounded-xl border-2 border-slate-300 p-4 outline-none font-bold text-sm transition bg-slate-50/50 placeholder:text-slate-400 focus:border-amber-500 dark:border-white/15 dark:bg-white/[0.06] dark:text-white dark:placeholder:text-slate-500 dark:focus:border-amber-400 disabled:opacity-50"
            />

            <input
              type="text"
              placeholder="Board (CBSE / ICSE / State Board)"
              name="board"
              value={formData.board}
              onChange={handleChange}
              disabled={!googleVerified}
              className="w-full rounded-xl border-2 border-slate-300 p-4 outline-none font-bold text-sm transition bg-slate-50/50 placeholder:text-slate-400 focus:border-amber-500 dark:border-white/15 dark:bg-white/[0.06] dark:text-white dark:placeholder:text-slate-500 dark:focus:border-amber-400 disabled:opacity-50"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !googleVerified}
            className="mt-6 w-full rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 py-4 font-bold text-xs uppercase tracking-wider text-slate-950 transition-all duration-300 hover:opacity-95 hover:shadow-lg hover:shadow-orange-500/10 dark:from-amber-400 dark:to-orange-400 disabled:cursor-not-allowed disabled:from-slate-200 disabled:to-slate-200 disabled:text-slate-400 dark:disabled:from-white/10 dark:disabled:to-white/10 dark:disabled:text-slate-500 shadow-sm"
          >
            {loading ? "Creating Account..." : "Create Student Account"}
          </button>

          {!googleVerified && (
            <p className="mt-3 text-center text-xs font-bold text-orange-500/90 dark:text-orange-400 tracking-wide">
              Verify your Google email before creating your account.
            </p>
          )}

          <p className="mt-6 text-center text-sm font-semibold text-slate-500 dark:text-slate-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-bold text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300"
            >
              Login
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
}

export default StudentSignupPage;
