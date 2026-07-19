import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import StarRating from "../components/reviews/StarRating";
import TeacherReviewsModal from "../components/reviews/TeacherReviewsModal";

function IconArrowLeft(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}

function IconPencil(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
    </svg>
  );
}

function IconX(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

function IconCamera(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

function TeacherProfilePage() {
  const navigate = useNavigate();
  const teacherProfileId = localStorage.getItem("profileId");

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [showReviews, setShowReviews] = useState(false);

  const [editing, setEditing] = useState(false);
  const [bioDraft, setBioDraft] = useState("");
  const [rateDraft, setRateDraft] = useState("");
  const [newSubject, setNewSubject] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [subjectBusy, setSubjectBusy] = useState(false);
  const [toast, setToast] = useState("");

  const [uploadingPicture, setUploadingPicture] = useState(false);
  const fileInputRef = useRef(null);

  const [showImageLightbox, setShowImageLightbox] = useState(false);

  useEffect(() => {
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    if (!showImageLightbox) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [showImageLightbox]);

  useEffect(() => {
    if (!showImageLightbox) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setShowImageLightbox(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showImageLightbox]);

  const loadProfile = async () => {
    setLoading(true);
    setLoadError("");
    try {
      const res = await api.get(`/teacher/${teacherProfileId}`);
      setProfile(res.data);
    } catch (err) {
      console.log(err);
      setLoadError("Unable to load your profile right now.");
    } finally {
      setLoading(false);
    }
  };

  const startEditing = () => {
    setBioDraft(profile.bio || "");
    setRateDraft(profile.ratePerThirtyMin ?? "");
    setSaveError("");
    setEditing(true);
  };

  const cancelEditing = () => {
    setEditing(false);
    setSaveError("");
  };

  const handlePictureUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("teacherProfileId", teacherProfileId);
    formData.append("file", file);

    setUploadingPicture(true);
    try {
      const res = await api.post("/teacher/profile-picture", formData);
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

  const handleSave = async () => {
    if (!bioDraft.trim()) {
      setSaveError("Bio cannot be empty.");
      return;
    }
    const rateValue = Number(rateDraft);
    if (!rateValue || rateValue <= 0) {
      setSaveError("Enter a valid rate per 30 minutes.");
      return;
    }

    setSaving(true);
    setSaveError("");
    try {
      await api.put(`/teacher/${teacherProfileId}/bio`, { bio: bioDraft.trim() });
      await api.put(`/teacher/${teacherProfileId}/rate`, {
        ratePerThirtyMin: rateValue,
      });

      setProfile((prev) => ({
        ...prev,
        bio: bioDraft.trim(),
        ratePerThirtyMin: rateValue,
      }));
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

  const handleAddSubject = async () => {
    const subject = newSubject.trim();
    if (!subject || subjectBusy) return;

    if (profile.subjects?.some((s) => s.toUpperCase() === subject.toUpperCase())) {
      setNewSubject("");
      return;
    }

    setSubjectBusy(true);
    try {
      await api.post(`/teacher/${teacherProfileId}/subject`, { subject });
      setProfile((prev) => ({
        ...prev,
        subjects: [...(prev.subjects || []), subject],
      }));
      setNewSubject("");
    } catch (err) {
      console.log(err);
      setSaveError("Unable to add subject.");
    } finally {
      setSubjectBusy(false);
    }
  };

  const handleRemoveSubject = async (subject) => {
    if (subjectBusy) return;

    setSubjectBusy(true);
    try {
      await api.delete(`/teacher/${teacherProfileId}/subject`, {
        data: { subject },
      });
      setProfile((prev) => ({
        ...prev,
        subjects: prev.subjects.filter((s) => s !== subject),
      }));
    } catch (err) {
      console.log(err);
      setSaveError("Unable to remove subject.");
    } finally {
      setSubjectBusy(false);
    }
  };

  const hasProfilePicture = Boolean(profile?.profilePictureUrl);

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-slate-950 dark:bg-[#06050C] dark:text-white antialiased relative overflow-hidden">
      
      {/* Premium Deep Violet & Indigo Wavy ambient light layers */}
      <div className="absolute top-[-10%] left-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-violet-200 to-indigo-300 opacity-40 dark:from-violet-500/10 dark:to-indigo-500/5 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-purple-200 to-fuchsia-300 opacity-35 dark:from-purple-500/5 dark:to-fuchsia-500/5 rounded-full blur-[110px] pointer-events-none" />

      <div className="relative mx-auto max-w-3xl px-6 py-12 sm:px-8 sm:py-16 z-10">
        
        {/* Navigation Layer */}
        <button
          onClick={() => navigate("/teacher")}
          className="group inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 transition-colors"
        >
          <IconArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
          Back to Dashboard
        </button>

        <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
          My Profile
        </h1>

        {loading && (
          <div className="mt-8 h-96 animate-pulse rounded-3xl bg-white/70 shadow-sm dark:bg-white/[0.02]" />
        )}

        {!loading && loadError && (
          <div className="mt-8 rounded-2xl border-2 border-rose-300 bg-rose-500/[0.02] p-8 text-center shadow-sm">
            <p className="text-sm font-bold text-rose-600 dark:text-rose-400">{loadError}</p>
            <button
              onClick={loadProfile}
              className="mt-4 rounded-xl bg-rose-600 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-rose-700 transition"
            >
              Try again
            </button>
          </div>
        )}

        {!loading && !loadError && profile && (
          <div className="mt-8 rounded-3xl border-2 border-slate-300 bg-white p-6 sm:p-10 dark:bg-[#0F0D1A] dark:border-white/20 shadow-sm space-y-6">
            
            {/* Header Profiler Row */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-6">
              <div className="flex items-center gap-5 min-w-0">
                <div className="relative h-20 w-20 shrink-0">
                  <button
                    type="button"
                    onClick={() => hasProfilePicture && setShowImageLightbox(true)}
                    className={`block h-20 w-20 rounded-full shadow-sm ${hasProfilePicture ? "cursor-zoom-in" : "cursor-default"}`}
                    aria-label="View profile picture"
                  >
                    <img
                      src={profile.profilePictureUrl || "https://placehold.co/100x100?text=👤"}
                      alt={profile.name}
                      className="h-20 w-20 rounded-full border-2 border-slate-300 object-cover bg-slate-50 dark:border-white/30"
                    />
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingPicture}
                    className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-violet-600 text-white shadow-md transition hover:bg-violet-700 disabled:opacity-70 dark:border-[#0F0D1A]"
                    aria-label="Change profile picture"
                  >
                    {uploadingPicture ? (
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      <IconCamera className="h-3.5 w-3.5" />
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
                  <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white truncate">
                    {profile.name}
                  </h2>
                  <p className="mt-1 text-sm font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider truncate">{profile.language}</p>
                </div>
              </div>

              {!editing && (
                <button
                  onClick={startEditing}
                  className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-xl border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 transition hover:bg-slate-100 dark:border-white/20 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 shadow-sm"
                >
                  <IconPencil className="h-3.5 w-3.5" />
                  Edit Panel
                </button>
              )}
            </div>

            {/* Subjects Selection Node */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Instructed Subjects</p>

              <div className="mt-3 flex flex-wrap gap-2">
                {profile.subjects?.map((subject) => (
                  <span
                    key={subject}
                    className="flex items-center gap-1.5 rounded-full bg-violet-50 border border-violet-200 px-3 py-1 text-xs font-bold text-violet-700 dark:bg-violet-500/10 dark:text-violet-300 dark:border-violet-500/20"
                  >
                    {subject}
                    {editing && (
                      <button
                        onClick={() => handleRemoveSubject(subject)}
                        disabled={subjectBusy}
                        className="rounded-full text-violet-400 transition hover:text-violet-700 disabled:opacity-50"
                      >
                        <IconX className="h-3 w-3" />
                      </button>
                    )}
                  </span>
                ))}

                {(!profile.subjects || profile.subjects.length === 0) && !editing && (
                  <p className="text-sm font-medium text-slate-400">No subjects added yet.</p>
                )}
              </div>

              {editing && (
                <div className="mt-3 flex gap-2">
                  <input
                    type="text"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddSubject();
                      }
                    }}
                    placeholder="Add a subject, e.g. Physics"
                    className="flex-1 rounded-xl border-2 border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-950 placeholder:text-slate-400 outline-none transition bg-slate-50/50 focus:border-violet-500 focus:bg-white dark:border-white/10 dark:bg-white/[0.02] dark:text-white dark:focus:border-violet-400"
                  />
                  <button
                    onClick={handleAddSubject}
                    disabled={subjectBusy || !newSubject.trim()}
                    className="rounded-xl bg-violet-600 px-5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-slate-400"
                  >
                    Add Node
                  </button>
                </div>
              )}
            </div>

            {/* Biography Textarea Node */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Instructor Biography</p>

              {!editing ? (
                profile.bio ? (
                  <p className="mt-2 text-sm font-medium leading-relaxed text-slate-700 dark:text-slate-300">{profile.bio}</p>
                ) : (
                  <p className="mt-2 text-sm font-medium text-slate-400">No biography vectors provided yet.</p>
                )
              ) : (
                <textarea
                  rows="4"
                  value={bioDraft}
                  onChange={(e) => setBioDraft(e.target.value)}
                  placeholder="Tell students a bit about yourself and your teaching style..."
                  className="mt-2 w-full resize-none rounded-xl border-2 border-slate-300 p-4 outline-none font-bold text-sm transition bg-slate-50/50 focus:border-violet-500 focus:bg-white dark:border-white/10 dark:bg-white/[0.02] dark:text-white dark:focus:border-violet-400"
                />
              )}
            </div>

            {saveError && (
              <p className="text-xs font-semibold text-rose-600 dark:text-rose-400 leading-normal mt-2">· {saveError}</p>
            )}

            {/* Action Trigger Panels */}
            {editing && (
              <div className="mt-4 flex gap-3 pt-2">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="rounded-xl bg-slate-950 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-violet-600 dark:bg-white dark:text-slate-950 dark:hover:bg-violet-400 dark:hover:text-white disabled:cursor-not-allowed"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  onClick={cancelEditing}
                  disabled={saving}
                  className="rounded-xl border-2 border-slate-300 px-5 py-2 text-xs font-bold uppercase tracking-wider text-slate-700 transition hover:bg-slate-50 dark:border-white/20 dark:text-slate-300 dark:hover:bg-white/10"
                >
                  Cancel
                </button>
              </div>
            )}

            {/* Rating Metric Dashboard Section */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border-2 border-slate-300 bg-slate-50/60 p-5 dark:border-white/20 dark:bg-white/[0.01]">
              <button
                onClick={() => setShowReviews(true)}
                className="flex items-center gap-3 border border-slate-300 bg-white rounded-xl px-3 py-2 text-slate-800 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 hover:border-slate-400 transition"
              >
                <StarRating value={profile.rating || 0} readOnly size="h-4 w-4" />
                <span className="text-sm font-bold">
                  {(profile.rating || 0).toFixed(1)}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  ({profile.numberOfRatings || 0} reviews)
                </span>
              </button>

              {!editing ? (
                profile.ratePerThirtyMin != null && (
                  <div className="text-right">
                    <p className="text-2xl font-black tracking-tight text-violet-600 dark:text-violet-400">
                      ₹{profile.ratePerThirtyMin}
                    </p>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">/ 30 min</p>
                  </div>
                )
              ) : (
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-slate-400">₹</span>
                  <input
                    type="number"
                    min="1"
                    value={rateDraft}
                    onChange={(e) => setRateDraft(e.target.value)}
                    className="w-24 rounded-xl border-2 border-slate-300 p-2 text-right font-bold text-sm outline-none transition bg-slate-50/50 focus:border-violet-500 focus:bg-white dark:border-white/10 dark:bg-white/[0.02] dark:text-white dark:focus:border-violet-400"
                  />
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">/ 30 min</span>
                </div>
              )}
            </div>

            <button
              onClick={() => navigate("/teacher-meeting-setup")}
              className="inline-block text-xs font-bold uppercase tracking-wider text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 hover:underline pt-2"
            >
              Manage streaming synchronization room link →
            </button>
          </div>
        )}
      </div>

      {/* Danger Zone Base Panel Area */}
      {profile && !loading && !loadError && (
        <div className="mx-auto max-w-3xl px-6 pb-16 sm:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 rounded-2xl border-2 border-rose-400 bg-rose-500/[0.02] p-5 shadow-sm">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">Danger Zone Base</p>
              <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400 leading-normal max-w-md">
                Permanently terminate your database profile variables, clear reviews, and drop all associated dashboard configurations.
              </p>
            </div>
            <button
              onClick={() => navigate("/delete-teacher")}
              className="shrink-0 rounded-xl border-2 border-rose-400 bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-rose-600 transition hover:bg-rose-500 hover:text-white dark:bg-transparent dark:hover:bg-rose-500/10 shadow-sm"
            >
              Delete Account
            </button>
          </div>
        </div>
      )}

      {/* Global state notification toast system component */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl border border-slate-700 bg-slate-950 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-2xl backdrop-blur-md">
          {toast}
        </div>
      )}

      {/* Reviews overlay modal portal rendering context */}
      {showReviews && (
        <TeacherReviewsModal
          teacherId={teacherProfileId}
          teacherName={profile?.name}
          onClose={() => setShowReviews(false)}
        />
      )}

      {/* Profile picture full-screen viewer */}
      {showImageLightbox && hasProfilePicture && createPortal(
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90"
          onClick={() => setShowImageLightbox(false)}
        >
          <button
            onClick={() => setShowImageLightbox(false)}
            className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            aria-label="Close"
          >
            <IconX className="h-5 w-5" />
          </button>
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ width: "min(75vw, 75vh)", height: "min(75vw, 75vh)" }}
            className="overflow-hidden rounded-full shadow-2xl ring-1 ring-white/10"
          >
            <img
              src={profile.profilePictureUrl}
              alt={profile.name}
              className="h-full w-full object-cover"
            />
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

export default TeacherProfilePage;
