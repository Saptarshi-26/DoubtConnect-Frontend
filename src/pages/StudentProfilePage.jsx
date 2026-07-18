import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import MyReviewsModal from "../components/reviews/MyReviewsModal";

function IconArrowLeft(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M19 12H5" />
      <path d="M12 19l-7-7 7-7" />
    </svg>
  );
}

function IconStar(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2.5l2.9 6.2 6.8.7-5.1 4.6 1.5 6.7L12 17.6l-6.1 3.1 1.5-6.7L2.3 9.4l6.8-.7L12 2.5z" />
    </svg>
  );
}

function IconPencil(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
    </svg>
  );
}

function IconCamera(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

function IconAlertTriangle(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 9v4M12 17h.01" />
      <path d="M10.3 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L14.7 3.86a2 2 0 0 0-3.4 0z" />
    </svg>
  );
}

function StudentProfilePage() {
  const navigate = useNavigate();
  const studentProfileId = localStorage.getItem("profileId");

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [showMyReviews, setShowMyReviews] = useState(false);

  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ grade: "", board: "", language: "" });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [toast, setToast] = useState("");

  const [uploadingPicture, setUploadingPicture] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const loadProfile = async () => {
    setLoading(true);
    setLoadError("");
    try {
      const res = await api.get(`/student/${studentProfileId}`);
      setProfile(res.data);
    } catch (err) {
      console.log(err);
      setLoadError("Unable to load your profile right now.");
    } finally {
      setLoading(false);
    }
  };

  const handlePictureUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("studentProfileId", studentProfileId);
    formData.append("file", file);

    setUploadingPicture(true);
    try {
      const res = await api.post("/student/profile-picture", formData);
      setProfile((prev) => ({
        ...prev,
        profilePictureUrl: res.data.profilePictureUrl,
      }));
      setToast("Profile picture updated.");
    } catch (err) {
      console.log(err);
      setSaveError("Unable to upload profile picture. Please try again.");
    } finally {
      setUploadingPicture(false);
      e.target.value = "";
    }
  };

  const startEditing = () => {
    setFormData({
      grade: profile.grade || "",
      board: profile.board || "",
      language: profile.language || "",
    });
    setSaveError("");
    setEditing(true);
  };

  const cancelEditing = () => {
    setEditing(false);
    setSaveError("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!formData.grade.trim() || !formData.board.trim() || !formData.language.trim()) {
      setSaveError("All fields are required.");
      return;
    }

    setSaving(true);
    setSaveError("");
    try {
      await api.put(`/student/${studentProfileId}`, formData);
      setProfile((prev) => ({ ...prev, ...formData }));
      setEditing(false);
      setToast("Profile updated.");
    } catch (err) {
      setSaveError(
        err.response?.data || "Unable to update profile. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const details = profile
    ? [profile.grade, profile.board, profile.language].filter(Boolean)
    : [];

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-slate-950 dark:bg-slate-950 dark:text-white selection:bg-indigo-600 selection:text-white antialiased relative overflow-hidden">

      {/* Ambient background */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-200/40 dark:bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-amber-100/30 dark:bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative mx-auto max-w-3xl px-6 py-14 sm:px-8 sm:py-20">

        <button
          onClick={() => navigate("/student")}
          className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors duration-200"
        >
          <IconArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
          Dashboard
        </button>

        <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-5xl">
          My profile
        </h1>

        {loading && (
          <div className="mt-8 h-80 animate-pulse rounded-3xl border border-slate-200 bg-white/60 dark:border-white/10 dark:bg-white/[0.02]" />
        )}

        {!loading && loadError && (
          <div className="mt-8 rounded-3xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-500/20 dark:bg-red-500/5">
            <p className="font-medium text-red-600 dark:text-red-400">{loadError}</p>
            <button
              onClick={loadProfile}
              className="mt-4 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-red-500"
            >
              Try again
            </button>
          </div>
        )}

        {!loading && !loadError && profile && (
          <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_24px_48px_-16px_rgba(15,23,42,0.1)] dark:border-white/10 dark:bg-white/[0.03] dark:shadow-none sm:p-10">

            {/* Identity */}
            <div className="flex items-center gap-5 min-w-0">
              <div className="group relative h-20 w-20 shrink-0">
                <img
                  src={profile.profilePictureUrl || "https://placehold.co/100x100"}
                  alt={profile.name}
                  className="h-20 w-20 rounded-full border-2 border-slate-100 object-cover dark:border-white/10"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingPicture}
                  className="absolute inset-0 flex items-center justify-center rounded-full bg-black/0 text-white opacity-0 transition duration-200 group-hover:bg-black/50 group-hover:opacity-100 disabled:opacity-100 disabled:bg-black/50"
                >
                  {uploadingPicture ? (
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <IconCamera className="h-6 w-6" />
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handlePictureUpload}
                  className="hidden"
                />
              </div>
              <div className="min-w-0">
                <h2 className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white truncate">
                  {profile.name}
                </h2>
                <p className="mt-0.5 text-sm font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
                  Student
                </p>
              </div>
            </div>

            {/* Details */}
            <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t-2 border-slate-100 pt-6 dark:border-white/5">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                Details
              </p>

              {!editing && (
                <button
                  onClick={startEditing}
                  className="inline-flex shrink-0 items-center gap-1.5 self-start text-sm font-bold text-indigo-600 transition hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  <IconPencil className="h-3.5 w-3.5" />
                  Edit
                </button>
              )}
            </div>

            {!editing && (
              <>
                {details.length > 0 ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {profile.grade && (
                      <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400">
                        Grade {profile.grade}
                      </span>
                    )}
                    {profile.board && (
                      <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400">
                        {profile.board}
                      </span>
                    )}
                    {profile.language && (
                      <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400">
                        {profile.language}
                      </span>
                    )}
                  </div>
                ) : (
                  <p className="mt-3 text-sm font-medium text-slate-400 dark:text-slate-500">
                    No details added yet.
                  </p>
                )}
              </>
            )}

            {editing && (
              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-white/5 dark:bg-white/[0.02]">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                      Grade
                    </label>
                    <input
                      name="grade"
                      value={formData.grade}
                      onChange={handleChange}
                      placeholder="Example: 10th"
                      className="mt-2 w-full rounded-xl border-2 border-slate-200 bg-white p-3 text-sm font-semibold text-slate-950 placeholder:text-slate-400 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                      Board
                    </label>
                    <input
                      name="board"
                      value={formData.board}
                      onChange={handleChange}
                      placeholder="Example: CBSE"
                      className="mt-2 w-full rounded-xl border-2 border-slate-200 bg-white p-3 text-sm font-semibold text-slate-950 placeholder:text-slate-400 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                      Language
                    </label>
                    <input
                      name="language"
                      value={formData.language}
                      onChange={handleChange}
                      placeholder="Example: English"
                      className="mt-2 w-full rounded-xl border-2 border-slate-200 bg-white p-3 text-sm font-semibold text-slate-950 placeholder:text-slate-400 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500"
                    />
                  </div>
                </div>

                {saveError && (
                  <p className="mt-3 text-sm font-medium text-red-500 dark:text-red-400">{saveError}</p>
                )}

                <div className="mt-5 flex gap-3">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300 dark:disabled:bg-slate-700"
                  >
                    {saving ? "Saving…" : "Save changes"}
                  </button>
                  <button
                    onClick={cancelEditing}
                    disabled={saving}
                    className="rounded-xl border-2 border-slate-200 px-6 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-100 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/5"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Reviews */}
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-amber-100 bg-amber-50/50 p-5 dark:border-amber-500/10 dark:bg-amber-500/5">
              <div>
                <p className="font-bold text-slate-900 dark:text-white">Your reviews</p>
                <p className="mt-0.5 text-sm font-medium text-slate-500 dark:text-slate-400">
                  See what you've written for educators you've worked with.
                </p>
              </div>
              <button
                onClick={() => setShowMyReviews(true)}
                className="flex shrink-0 items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-amber-600"
              >
                <IconStar className="h-4 w-4" />
                See my reviews
              </button>
            </div>

            {/* Danger zone */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-red-100 bg-red-50/50 p-5 dark:border-red-500/10 dark:bg-red-500/5">
              <div className="flex items-start gap-3">
                <IconAlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Danger zone</p>
                  <p className="mt-0.5 text-sm font-medium text-slate-500 dark:text-slate-400">
                    Permanently delete your account and all associated data.
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate("/delete-student")}
                className="shrink-0 rounded-xl border-2 border-red-200 px-4 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-100 dark:border-red-500/20 dark:text-red-400 dark:hover:bg-red-500/10"
              >
                Delete account
              </button>
            </div>
          </div>
        )}
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-2xl bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white shadow-xl dark:bg-white dark:text-slate-950">
          {toast}
        </div>
      )}

      {showMyReviews && (
        <MyReviewsModal
          studentId={studentProfileId}
          onClose={() => setShowMyReviews(false)}
        />
      )}
    </div>
  );
}

export default StudentProfilePage;