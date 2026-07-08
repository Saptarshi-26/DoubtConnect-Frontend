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

function StudentSignupPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [googleVerified, setGoogleVerified] = useState(false);
  const [googleEmail, setGoogleEmail] = useState("");
  const [googleIdToken, setGoogleIdToken] = useState("");

  const [formData, setFormData] = useState({
    username: "",
    password: "",
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

    const payload = {
      username: formData.username,
      password: formData.password,
      role: "STUDENT",
      language: formData.language,
      grade: formData.grade,
      board: formData.board,
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
    <div className="min-h-screen flex bg-[#FDFBF7] dark:bg-[#070610] text-slate-950 dark:text-white antialiased selection:bg-amber-500 selection:text-slate-950 relative overflow-hidden">
      
      {/* Dynamic sunset-hued vibrant background lighting waves */}
      <div className="absolute top-[-10%] left-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-amber-200 to-orange-300 opacity-40 dark:from-amber-500/10 dark:to-orange-500/5 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-indigo-200 to-purple-300 opacity-40 dark:from-indigo-500/10 dark:to-purple-500/5 rounded-full blur-[110px] pointer-events-none" />

      {/* Left Block Side Panel - Rich Twilight Blue with Warm Radial Sunburst */}
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
            Create your account and connect with teachers whenever you need help.
          </p>
        </div>
      </div>

      {/* Right Input Panel */}
      <div className="flex flex-1 items-center justify-center p-6 sm:p-8 relative z-10">
        
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-lg rounded-3xl border-2 border-slate-300 bg-white p-8 sm:p-10 dark:bg-[#0D0E22] dark:border-white/20 shadow-[0_4px_24px_rgba(245,158,11,0.03)]"
        >
          {/* High-contrast colorful back action */}
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
            Just a few details to get started.
          </p>

          {/* Form Inputs with Vivid Border Focus Physics */}
          <div className="mt-8 space-y-4">
            <input
              type="text"
              placeholder="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full rounded-xl border-2 border-slate-300 p-4 outline-none font-bold text-sm transition bg-slate-50/50 focus:border-amber-500 focus:bg-white dark:border-white/10 dark:bg-white/[0.02] dark:text-white dark:focus:border-amber-400"
            />

            <input
              type="password"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full rounded-xl border-2 border-slate-300 p-4 outline-none font-bold text-sm transition bg-slate-50/50 focus:border-amber-500 focus:bg-white dark:border-white/10 dark:bg-white/[0.02] dark:text-white dark:focus:border-amber-400"
            />

            <input
              type="text"
              placeholder="Preferred Language"
              name="language"
              value={formData.language}
              onChange={handleChange}
              className="w-full rounded-xl border-2 border-slate-300 p-4 outline-none font-bold text-sm transition bg-slate-50/50 focus:border-amber-500 focus:bg-white dark:border-white/10 dark:bg-white/[0.02] dark:text-white dark:focus:border-amber-400"
            />

            <input
              type="text"
              placeholder="Grade (Example: Class 10)"
              name="grade"
              value={formData.grade}
              onChange={handleChange}
              className="w-full rounded-xl border-2 border-slate-300 p-4 outline-none font-bold text-sm transition bg-slate-50/50 focus:border-amber-500 focus:bg-white dark:border-white/10 dark:bg-white/[0.02] dark:text-white dark:focus:border-amber-400"
            />

            <input
              type="text"
              placeholder="Board (CBSE / ICSE / State Board)"
              name="board"
              value={formData.board}
              onChange={handleChange}
              className="w-full rounded-xl border-2 border-slate-300 p-4 outline-none font-bold text-sm transition bg-slate-50/50 focus:border-amber-500 focus:bg-white dark:border-white/10 dark:bg-white/[0.02] dark:text-white dark:focus:border-amber-400"
            />
          </div>

          {/* Premium Google Masking Button Subsystem */}
          <div className="mt-5">
            {googleVerified ? (
              <div className="rounded-xl border-2 border-emerald-500 bg-emerald-500/[0.02] py-4 text-center font-extrabold text-sm text-emerald-600 dark:text-emerald-400 shadow-sm">
                ✓ Verified: {googleEmail}
              </div>
            ) : (
              <div className="relative w-full h-[52px] rounded-xl overflow-hidden group shadow-sm">
                <button
                  type="button"
                  className="absolute inset-0 w-full h-full flex items-center justify-center gap-2.5 rounded-xl border-2 border-amber-500 bg-amber-50 text-amber-700 font-extrabold text-xs uppercase tracking-wider transition-colors group-hover:bg-amber-100 dark:bg-amber-500/10 dark:border-amber-500/30 dark:text-amber-400 dark:group-hover:bg-amber-500/20 pointer-events-none z-0"
                >
                  <IconGoogle className="h-4 w-4 shrink-0" />
                  Verify your email with Google
                </button>
                
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

          {/* Golden Sunset Account Activation Button */}
          <button
            type="submit"
            disabled={loading || !googleVerified}
            className="mt-6 w-full rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 py-4 font-bold text-xs uppercase tracking-wider text-slate-950 transition-all duration-300 hover:opacity-95 hover:shadow-lg hover:shadow-orange-500/10 dark:from-amber-400 dark:to-orange-400 disabled:cursor-not-allowed disabled:from-slate-200 disabled:to-slate-200 disabled:text-slate-400 dark:disabled:from-white/5 dark:disabled:to-white/5 dark:disabled:text-slate-600 shadow-sm"
          >
            {loading ? "Creating Account..." : "Create Student Account"}
          </button>

          {!googleVerified && (
            <p className="mt-3 text-center text-xs font-bold text-orange-500/90 tracking-wide">
              Verify your Google email before creating your account.
            </p>
          )}

          <p className="mt-6 text-center text-sm font-semibold text-slate-500">
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