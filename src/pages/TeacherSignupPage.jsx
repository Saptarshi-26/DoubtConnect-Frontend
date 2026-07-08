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

function IconGoogle(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.18 1-.78 1.85-1.63 2.42v2.84h2.64c1.55-1.42 2.43-3.52 2.43-6.07z" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-2.64-2.84c-.73.49-1.66.78-2.64.78-2.03 0-4.71-1.37-5.33-3.22H3.04v2.95C4.89 21.68 8.23 23 12 23z" />
      <path d="M6.67 15.06a7.17 7.17 0 0 1 0-2.12V10H3.04a11.94 11.94 0 0 0 0 4l3.63-2.94z" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 8.23 1 4.89 2.32 3.04 5.05L6.67 8c.62-1.85 3.3-3.22 5.33-3.22z" />
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
    username: "",
    password: "",
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

    const payload = {
      username: formData.username,
      password: formData.password,
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
      alert(res.data.message);
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message ?? "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#FAFAF9] dark:bg-[#06050C] text-slate-950 dark:text-white antialiased selection:bg-violet-600 selection:text-white relative overflow-hidden">
      
      {/* Background soft lighting effects */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-violet-200/40 dark:bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-fuchsia-100/40 dark:bg-fuchsia-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Left Block Side Panel */}
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
            Build your teaching profile, manage sessions and connect with students who need your guidance.
          </p>
        </div>
      </div>

      {/* Right Input Panel */}
      <div className="flex flex-1 items-center justify-center p-6 sm:p-8 relative z-10 overflow-y-auto">
        
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-xl rounded-3xl border-2 border-slate-300 bg-white p-8 sm:p-10 dark:bg-[#0F0D1A] dark:border-white/20 shadow-sm"
        >
          {/* Back button link */}
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
            Tell students a little about yourself.
          </p>

          {/* Form Inputs */}
          <div className="mt-8 space-y-4">
            <input
              type="text"
              placeholder="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full rounded-xl border-2 border-slate-300 p-4 outline-none font-medium text-sm transition bg-slate-50/50 focus:border-violet-500 focus:bg-white dark:border-white/10 dark:bg-white/[0.02] dark:text-white dark:focus:border-violet-400"
            />

            <input
              type="password"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full rounded-xl border-2 border-slate-300 p-4 outline-none font-medium text-sm transition bg-slate-50/50 focus:border-violet-500 focus:bg-white dark:border-white/10 dark:bg-white/[0.02] dark:text-white dark:focus:border-violet-400"
            />

            <input
              type="text"
              placeholder="Preferred Language"
              name="language"
              value={formData.language}
              onChange={handleChange}
              className="w-full rounded-xl border-2 border-slate-300 p-4 outline-none font-medium text-sm transition bg-slate-50/50 focus:border-violet-500 focus:bg-white dark:border-white/10 dark:bg-white/[0.02] dark:text-white dark:focus:border-violet-400"
            />

            <textarea
              rows="4"
              placeholder="Tell students a little about yourself and your teaching style..."
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="w-full resize-none rounded-xl border-2 border-slate-300 p-4 outline-none font-medium text-sm transition bg-slate-50/50 focus:border-violet-500 focus:bg-white dark:border-white/10 dark:bg-white/[0.02] dark:text-white dark:focus:border-violet-400"
            />

            {/* Subject tag input */}
            <div className="w-full rounded-xl border-2 border-slate-300 p-3 transition bg-slate-50/50 focus-within:border-violet-500 focus-within:bg-white dark:border-white/10 dark:bg-white/[0.02] dark:focus-within:border-violet-400">
              {subjects.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {subjects.map((subject, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300 px-3 py-1.5 text-xs font-bold"
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
                  className="flex-1 bg-transparent outline-none font-medium text-sm dark:text-white min-w-0"
                />
                <button
                  type="button"
                  onClick={addSubject}
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
              className="w-full rounded-xl border-2 border-slate-300 p-4 outline-none font-medium text-sm transition bg-slate-50/50 focus:border-violet-500 focus:bg-white dark:border-white/10 dark:bg-white/[0.02] dark:text-white dark:focus:border-violet-400"
            />
          </div>

          {/* Custom Google verification layout section positioned below fields */}
          <div className="mt-5">
            {googleVerified ? (
              <div className="rounded-xl border-2 border-emerald-500 bg-emerald-500/[0.02] py-4 text-center font-bold text-sm text-emerald-600 dark:text-emerald-400 shadow-sm">
                ✓ Verified: {googleEmail}
              </div>
            ) : (
              /* Premium covered button element matching layout requests */
              <div className="relative w-full h-[52px] rounded-xl overflow-hidden group">
                <button
                  type="button"
                  className="absolute inset-0 w-full h-full flex items-center justify-center gap-2.5 rounded-xl border-2 border-slate-400 bg-slate-50 text-slate-800 font-bold text-xs uppercase tracking-wider transition-colors group-hover:bg-slate-100 group-hover:border-slate-500 dark:bg-white/[0.02] dark:border-white/30 dark:text-slate-200 dark:group-hover:bg-white/5 pointer-events-none z-0"
                >
                  <IconGoogle className="h-4 w-4 shrink-0" />
                  Verify your email with Google
                </button>
                
                {/* Overlay component catches clicks flawlessly */}
                <div className="absolute inset-0 opacity-0 cursor-pointer scale-150 origin-center z-10">
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
                        alert(err.response?.data ?? "Google verification failed.");
                      }
                    }}
                    onError={() => {
                      alert("Google verification failed.");
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Final creation button trigger code */}
          <button
            type="submit"
            disabled={loading || !googleVerified}
            className="mt-6 w-full rounded-xl bg-slate-950 py-4 font-bold text-xs uppercase tracking-wider text-white transition hover:bg-violet-600 dark:bg-white dark:text-slate-950 dark:hover:bg-violet-400 dark:hover:text-white disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 dark:disabled:bg-white/5 dark:disabled:text-slate-600 shadow-sm"
          >
            {loading ? "Creating Account..." : "Create Teacher Account"}
          </button>

          {!googleVerified && (
            <p className="mt-3 text-center text-xs font-semibold text-slate-500">
              Verify your Google email before creating your account.
            </p>
          )}

          <p className="mt-6 text-center text-sm font-medium text-slate-500">
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