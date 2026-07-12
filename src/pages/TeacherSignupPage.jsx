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

function IconX(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

function TeacherSignupPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [googleVerified, setGoogleVerified] = useState(false);
  const [googleEmail, setGoogleEmail] = useState("");
  const [googleIdToken, setGoogleIdToken] = useState("");

  const [subjectInput, setSubjectInput] = useState("");
  const [subjects, setSubjects] = useState([]);

  const [formData, setFormData] = useState({
    language: "",
    bio: "",
    ratePerThirtyMin: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const addSubject = () => {
    const trimmed = subjectInput.trim();

    if (trimmed.length === 0) return;

    if (subjects.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      setSubjectInput("");
      return;
    }

    setSubjects([...subjects, trimmed]);
    setSubjectInput("");
  };

  const removeSubject = (index) => {
    setSubjects(subjects.filter((_, i) => i !== index));
  };

  const handleSubjectKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSubject();
    } else if (e.key === "Backspace" && subjectInput === "" && subjects.length > 0) {
      removeSubject(subjects.length - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!googleVerified) {
      alert("Please verify your Google email first.");
      return;
    }

    if (subjects.length === 0) {
      alert("Please add at least one subject.");
      return;
    }

    if (!formData.language.trim() || !formData.bio.trim() || !formData.ratePerThirtyMin) {
      alert("Please fill in language, bio, and your rate.");
      return;
    }

    const payload = {
      role: "TEACHER",
      language: formData.language,
      bio: formData.bio,
      subjects: subjects,
      ratePerThirtyMin: Number(formData.ratePerThirtyMin),
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
    <div className="min-h-screen flex bg-[#FAFAF9] dark:bg-[#06050C] text-slate-950 dark:text-white antialiased selection:bg-violet-600 selection:text-white relative overflow-hidden">

      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-violet-200/40 dark:bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-fuchsia-100/40 dark:bg-fuchsia-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white items-center justify-center p-16 border-r border-slate-200 dark:border-white/10 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(139,92,246,0.06),transparent)] pointer-events-none" />
        <div className="max-w-md relative z-10">
          <p className="text-violet-400 font-bold uppercase tracking-wider text-xs">
            DoubtConnect
          </p>
          <h1 className="mt-6 text-5xl font-extrabold tracking-tight leading-tight">
            Teacher
            <br />
            Account
          </h1>
          <p className="mt-8 text-lg font-medium leading-relaxed text-slate-300">
            Help students solve doubts while their curiosity is still alive.
          </p>
          <p className="mt-6 text-sm leading-relaxed text-slate-400 font-medium">
            Verify with Google, build your teaching profile, and start taking sessions.
          </p>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center p-6 sm:p-8 relative z-10 overflow-y-auto">

        <form
          onSubmit={handleSubmit}
          className="w-full max-w-xl rounded-3xl border-2 border-slate-300 bg-white p-8 sm:p-10 dark:bg-[#0F0D1A] dark:border-white/20 shadow-sm"
        >
          <Link
            to="/signup"
            className="group inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 transition-colors"
          >
            <IconArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
            Back
          </Link>

          <h2 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Create Educator Account
          </h2>

          <p className="mt-3 text-[15px] font-medium text-slate-500 dark:text-slate-400">
            Verify with Google, then tell students a little about yourself.
          </p>

          {/* Google verification first — everything below depends on it */}
          <div className="mt-8">
            {googleVerified ? (
              <div className="rounded-xl border-2 border-emerald-500 bg-emerald-500/5 dark:border-emerald-400/60 dark:bg-emerald-500/10 py-4 text-center font-bold text-sm text-emerald-600 dark:text-emerald-400 shadow-sm">
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
              className="w-full rounded-xl border-2 border-slate-300 p-4 outline-none font-medium text-sm transition bg-slate-50/50 placeholder:text-slate-400 focus:border-violet-500 dark:border-white/15 dark:bg-white/[0.06] dark:text-white dark:placeholder:text-slate-500 dark:focus:border-violet-400 disabled:opacity-50"
            />

            <textarea
              rows="4"
              placeholder="Tell students a little about yourself and your teaching style..."
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              disabled={!googleVerified}
              className="w-full resize-none rounded-xl border-2 border-slate-300 p-4 outline-none font-medium text-sm transition bg-slate-50/50 placeholder:text-slate-400 focus:border-violet-500 dark:border-white/15 dark:bg-white/[0.06] dark:text-white dark:placeholder:text-slate-500 dark:focus:border-violet-400 disabled:opacity-50"
            />

            <div className={`w-full rounded-xl border-2 border-slate-300 p-3 transition bg-slate-50/50 focus-within:border-violet-500 dark:border-white/15 dark:bg-white/[0.06] dark:focus-within:border-violet-400 ${!googleVerified ? "opacity-50 pointer-events-none" : ""}`}>
              {subjects.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {subjects.map((subject, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300 px-3 py-1.5 text-xs font-bold"
                    >
                      {subject}
                      <button
                        type="button"
                        onClick={() => removeSubject(index)}
                        className="hover:text-violet-900 dark:hover:text-white transition-colors"
                      >
                        <IconX className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type a subject and press Enter"
                  value={subjectInput}
                  onChange={(e) => setSubjectInput(e.target.value)}
                  onKeyDown={handleSubjectKeyDown}
                  disabled={!googleVerified}
                  className="flex-1 bg-transparent outline-none font-medium text-sm text-slate-950 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 min-w-0"
                />
                <button
                  type="button"
                  onClick={addSubject}
                  disabled={!googleVerified}
                  className="shrink-0 rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-950 px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-violet-600 dark:hover:bg-violet-400 dark:hover:text-white transition-colors"
                >
                  Add
                </button>
              </div>
            </div>

            <input
              type="number"
              placeholder="Rate per 30 minutes (₹)"
              name="ratePerThirtyMin"
              value={formData.ratePerThirtyMin}
              onChange={handleChange}
              disabled={!googleVerified}
              className="w-full rounded-xl border-2 border-slate-300 p-4 outline-none font-medium text-sm transition bg-slate-50/50 placeholder:text-slate-400 focus:border-violet-500 dark:border-white/15 dark:bg-white/[0.06] dark:text-white dark:placeholder:text-slate-500 dark:focus:border-violet-400 disabled:opacity-50"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !googleVerified}
            className="mt-6 w-full rounded-xl bg-slate-950 py-4 font-bold text-xs uppercase tracking-wider text-white transition hover:bg-violet-600 dark:bg-white dark:text-slate-950 dark:hover:bg-violet-400 dark:hover:text-white disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 dark:disabled:bg-white/10 dark:disabled:text-slate-500 shadow-sm"
          >
            {loading ? "Creating Account..." : "Create Teacher Account"}
          </button>

          {!googleVerified && (
            <p className="mt-3 text-center text-xs font-semibold text-slate-500 dark:text-slate-400">
              Verify your Google email before creating your account.
            </p>
          )}

          <p className="mt-6 text-center text-sm font-medium text-slate-500 dark:text-slate-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-bold text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300"
            >
              Login
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
}

export default TeacherSignupPage;
