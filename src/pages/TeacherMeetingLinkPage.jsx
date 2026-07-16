import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const PLATFORMS = ["Google Meet", "Zoom", "Microsoft Teams", "Other"];

function IconArrowLeft(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}

// Prepends https:// if the user pasted a bare domain (e.g. what Google
// Meet gives you: "meet.google.com/xxx-xxxx-xxx" with no scheme).
function normalizeUrl(input) {
  const trimmed = input.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function isValidUrl(input) {
  try {
    // eslint-disable-next-line no-new
    new URL(normalizeUrl(input));
    return true;
  } catch {
    return false;
  }
}

function TeacherMeetingLinkPage() {
  const navigate = useNavigate();
  const teacherProfileId = localStorage.getItem("profileId");

  const [meetingPlatform, setMeetingPlatform] = useState("Google Meet");
  const [meetingLink, setMeetingLink] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadExisting();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadExisting = async () => {
    try {
      const res = await api.get(`/teacher-meeting/${teacherProfileId}`);
      if (res.data?.meetingLink) {
        setMeetingPlatform(res.data.meetingPlatform || "Google Meet");
        setMeetingLink(res.data.meetingLink);
      }
    } catch (err) {
      // Not set up yet — that's fine, form just stays blank.
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const raw = meetingLink.trim();

    if (!raw) {
      setError("Please enter your meeting link.");
      return;
    }

    if (!isValidUrl(raw)) {
      setError("That doesn't look like a valid link. Please check and try again.");
      return;
    }

    const normalized = normalizeUrl(raw);

    setSaving(true);
    try {
      await api.post(`/teacher-meeting/${teacherProfileId}`, {
        meetingPlatform,
        meetingLink: normalized,
      });
      // Reflect the normalized value back in the field in case save fails downstream
      setMeetingLink(normalized);
      navigate("/teacher-availability");
    } catch (err) {
      setError(
        err.response?.data || "Unable to save your meeting link. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#070610] text-slate-950 dark:text-white antialiased selection:bg-amber-500 selection:text-slate-950 relative overflow-hidden">
      
      {/* Warm, energetic sunset ambient background glows */}
      <div className="absolute top-[-10%] left-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-amber-200 to-orange-300 opacity-45 dark:from-amber-500/10 dark:to-orange-500/5 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-indigo-200 to-purple-300 opacity-45 dark:from-indigo-500/10 dark:to-purple-500/5 rounded-full blur-[110px] pointer-events-none" />

      <div className="relative mx-auto max-w-xl px-6 py-12 sm:px-8 sm:py-16 z-10">
        
        {/* Navigation Action */}
        <button
          onClick={() => navigate("/teacher")}
          className="group inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 transition-colors"
        >
          <IconArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
          Back to Dashboard
        </button>

        {/* Master Configuration Card Panel */}
        <div className="mt-8 rounded-3xl border-2 border-slate-300 bg-white p-8 dark:bg-[#0D0E22] dark:border-white/20 shadow-[0_4px_24px_rgba(245,158,11,0.02)] group relative overflow-hidden">
          <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full blur-3xl transition-colors duration-300 group-hover:bg-amber-50 dark:group-hover:bg-amber-500/5 pointer-events-none" />

          <div className="relative">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Your Meeting Link
            </h1>
            <p className="mt-3 text-sm font-semibold leading-relaxed text-slate-500 dark:text-slate-400">
              Add the persistent room link you will deploy for live stream instruction coordinates 
              (Google Meet, Zoom, Microsoft Teams, or custom hubs). This anchor point syncs 
              seamlessly with students upon session confirmation.
            </p>

            {loading ? (
              <div className="mt-8 h-44 animate-pulse rounded-2xl border-2 border-slate-200 bg-slate-50/50 dark:border-white/10 dark:bg-white/[0.02]" />
            ) : (
              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                
                {/* Platform Dropdown Drop Module */}
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Platform Vector
                  </label>
                  <select
                    value={meetingPlatform}
                    onChange={(e) => setMeetingPlatform(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border-2 border-slate-300 p-3.5 outline-none font-bold text-sm transition bg-slate-50/50 focus:border-amber-500 focus:bg-white dark:border-white/10 dark:bg-[#121124] dark:text-white dark:focus:border-amber-400 cursor-pointer appearance-none"
                  >
                    {PLATFORMS.map((p) => (
                      <option key={p} value={p} className="dark:bg-[#0D0E22]">
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Direct Link Entry Node */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Meeting Destination Link
                  </label>
                  <input
                    type="text"
                    inputMode="url"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck="false"
                    value={meetingLink}
                    onChange={(e) => setMeetingLink(e.target.value)}
                    onBlur={(e) => {
                      const v = e.target.value.trim();
                      if (v && isValidUrl(v)) {
                        setMeetingLink(normalizeUrl(v));
                      }
                    }}
                    placeholder="meet.google.com/xxx-xxxx-xxx"
                    className="mt-1.5 w-full rounded-xl border-2 border-slate-300 p-3.5 outline-none font-bold text-sm transition bg-slate-50/50 focus:border-amber-500 focus:bg-white dark:border-white/10 dark:bg-white/[0.02] dark:text-white dark:placeholder:text-slate-600 dark:focus:border-amber-400"
                    required
                  />
                  <p className="mt-1.5 text-[11px] font-medium text-slate-400 dark:text-slate-500">
                    You can paste the link exactly as Google/Zoom/Teams gives it — no need to add "https://" yourself.
                  </p>
                </div>

                {error && (
                  <p className="text-xs font-semibold text-rose-600 dark:text-rose-400 leading-normal mt-2">· {error}</p>
                )}

                {/* Continuous Execution CTA Button */}
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-950 transition-all duration-300 hover:opacity-95 hover:shadow-md hover:shadow-orange-500/10 dark:from-amber-400 dark:to-orange-400 disabled:cursor-not-allowed disabled:from-slate-200 disabled:to-slate-200 disabled:text-slate-400 dark:disabled:from-white/5 dark:disabled:to-white/5 dark:disabled:text-slate-600 pt-3.5"
                >
                  {saving ? "Synchronizing vectors..." : "Save & Continue to Availability"}
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default TeacherMeetingLinkPage;
