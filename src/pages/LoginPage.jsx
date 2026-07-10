import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api/axios";
import { GoogleLogin } from "@react-oauth/google";

function IconUser(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function IconLock(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect width="18" height="11" x="3" y="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function LoginPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const routeByRole = (role) => {
    switch (role) {
      case "ADMIN":
        navigate("/admin");
        break;
      case "STUDENT":
        navigate("/student");
        break;
      case "TEACHER":
        navigate("/teacher");
        break;
      default:
        navigate("/");
    }
  };

  const storeSession = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.role);
    localStorage.setItem("username", data.username);
    localStorage.setItem("profileId", data.profileId);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await api.post("/auth/login", {
        username,
        password,
      });

      storeSession(res.data);
      routeByRole(res.data.role);
    } catch (err) {
      alert("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setGoogleLoading(true);

      const res = await api.post("/auth/google-login", {
        googleIdToken: credentialResponse.credential,
      });

      storeSession(res.data);
      routeByRole(res.data.role);
    } catch (err) {
      // Backend returns 404 (not 401) when the Google account
      // isn't registered yet — send them to sign up in that case.
      if (err.response?.status === 404) {
        navigate("/signup");
      } else {
        alert("Google login failed.");
      }
    } finally {
      setGoogleLoading(false);
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative max-w-md"
        >
          <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-indigo-400">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
            DoubtConnect
          </p>

          <h1 className="mt-6 text-5xl font-bold leading-tight tracking-tight">
            Welcome back.
          </h1>

          <p className="mt-8 text-lg leading-8 text-slate-300">
            Continue your learning or teaching journey.
          </p>
        </motion.div>

      </div>

      {/* Right panel */}
      <div className="flex flex-1 items-center justify-center p-6 sm:p-8">

        <motion.form
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          onSubmit={handleLogin}
          className="w-full max-w-md rounded-3xl border border-slate-200/70 bg-white p-10 shadow-[0_2px_8px_rgba(15,23,42,0.04),0_24px_48px_-16px_rgba(15,23,42,0.12)] dark:border-white/10 dark:bg-white/[0.04] dark:shadow-none"
        >

          <h2 className="text-[2.25rem] font-bold tracking-tight text-slate-900 dark:text-white">
            Login
          </h2>

          <p className="mt-3 leading-6 text-slate-500 dark:text-slate-400">
            Students and educators sign in with Google. Admin and test accounts use username &amp; password.
          </p>

          <div className="relative mt-9">
            <IconUser className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              className="w-full rounded-xl border border-slate-200 bg-white py-4 pl-11 pr-4 text-slate-800 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-indigo-300 focus:shadow-[0_0_0_4px_rgba(99,102,241,0.08)] dark:border-white/10 dark:bg-white/[0.03] dark:text-white dark:placeholder:text-slate-500 dark:focus:border-indigo-400/50"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="relative mt-4">
            <IconLock className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              type="password"
              className="w-full rounded-xl border border-slate-200 bg-white py-4 pl-11 pr-4 text-slate-800 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-indigo-300 focus:shadow-[0_0_0_4px_rgba(99,102,241,0.08)] dark:border-white/10 dark:bg-white/[0.03] dark:text-white dark:placeholder:text-slate-500 dark:focus:border-indigo-400/50"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <p className="mt-3 text-right">
            <Link
              to="/forgot-password"
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              Forgot password?
            </Link>
          </p>

          <button
            type="submit"
            disabled={loading}
            className="mt-8 w-full rounded-xl bg-slate-900 py-4 font-semibold text-white transition-all duration-200 hover:bg-indigo-600 hover:shadow-[0_8px_24px_-6px_rgba(79,70,229,0.45)] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none dark:bg-white dark:text-slate-900 dark:hover:bg-indigo-500 dark:hover:text-white dark:disabled:bg-slate-700 dark:disabled:text-slate-500"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent opacity-60" />
                Logging in…
              </span>
            ) : (
              "Login"
            )}
          </button>

          <div className="my-6 flex items-center">
            <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
            <span className="mx-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
              OR
            </span>
            <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
          </div>

          <div className={googleLoading ? "pointer-events-none opacity-60" : ""}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => alert("Google login failed.")}
            />
          </div>

          <p className="mt-6 text-center text-slate-500 dark:text-slate-400">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              Create one
            </Link>
          </p>

        </motion.form>

      </div>

    </div>
  );
}

export default LoginPage;