import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function IconArrowLeft(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M19 12H5" />
      <path d="M12 19l-7-7 7-7" />
    </svg>
  );
}

function IconUsers(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function IconTrash(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 6h18" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    </svg>
  );
}

function IconAlertTriangle(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function AdminStudentsPage() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [confirmingId, setConfirmingId] = useState(null);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    setLoading(true);
    setLoadError("");
    try {
      const res = await api.get("/student/all");
      setStudents(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.log(err);
      setLoadError("Unable to load students right now.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await api.delete(`/student/${id}`);
      setStudents((prev) => prev.filter((s) => s.id !== id));
      setConfirmingId(null);
    } catch (err) {
      console.log(err);
      alert("Unable to delete this student.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-32 left-[10%] h-[34rem] w-[34rem] rounded-full bg-blue-600/20 blur-[120px]" />
        <div className="absolute top-1/3 right-[8%] h-[26rem] w-[26rem] rounded-full bg-emerald-500/15 blur-[120px]" />
        <div className="absolute bottom-0 left-1/2 h-[24rem] w-[24rem] rounded-full bg-indigo-600/15 blur-[130px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 py-10 sm:px-8 sm:py-14">
        <button
          onClick={() => navigate("/admin")}
          className="group inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition-colors duration-200 hover:text-blue-300"
        >
          <IconArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
          Back to Admin Dashboard
        </button>

        <div className="mt-6 flex items-center gap-3.5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-[0_4px_20px_-2px_rgba(59,130,246,0.55)]">
            <IconUsers className="h-5.5 w-5.5" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Students
            </h1>
            <p className="mt-0.5 text-slate-400">
              {students.length} student{students.length !== 1 ? "s" : ""}{" "}
              registered
            </p>
          </div>
        </div>

        {loading && (
          <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-6"
              >
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 shrink-0 animate-pulse rounded-full bg-white/10" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3.5 w-2/3 animate-pulse rounded-full bg-white/10" />
                    <div className="h-3 w-1/2 animate-pulse rounded-full bg-white/5" />
                  </div>
                </div>
                <div className="mt-5 h-9 animate-pulse rounded-xl bg-white/5" />
              </div>
            ))}
          </div>
        )}

        {!loading && loadError && (
          <div className="mt-9 flex flex-col items-center rounded-2xl border border-rose-400/20 bg-rose-500/10 p-10 text-center">
            <IconAlertTriangle className="h-8 w-8 text-rose-400" />
            <p className="mt-3 text-rose-300">{loadError}</p>
            <button
              onClick={loadStudents}
              className="mt-5 rounded-xl bg-gradient-to-r from-rose-500 to-orange-500 px-5 py-2.5 font-semibold text-white shadow-[0_4px_16px_-4px_rgba(244,63,94,0.5)] transition-all duration-200 hover:shadow-[0_6px_22px_-4px_rgba(244,63,94,0.65)]"
            >
              Try again
            </button>
          </div>
        )}

        {!loading && !loadError && (
          <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {students.map((student, idx) => (
              <div
                key={student.id}
                style={{
                  animation: `fadeSlideUp 0.4s ease-out ${idx * 0.04}s both`,
                }}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-400/30 hover:bg-white/[0.07] hover:shadow-[0_12px_32px_-8px_rgba(59,130,246,0.25)]"
              >
                <div className="flex items-center gap-4">
                  <div className="relative h-14 w-14 shrink-0">
                    <img
                      src={
                        student.profilePictureUrl ||
                        "https://placehold.co/80x80?text=👤"
                      }
                      alt={student.name}
                      className="h-14 w-14 rounded-full object-cover ring-2 ring-white/10"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-2 border-slate-950 bg-emerald-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-white">
                      {student.name}
                    </p>
                    <p className="text-sm text-slate-400">
                      {[student.grade && `Grade ${student.grade}`, student.board]
                        .filter(Boolean)
                        .join(" · ") || "—"}
                    </p>
                  </div>
                </div>

                {confirmingId === student.id ? (
                  <div className="mt-4 rounded-xl border border-rose-400/20 bg-rose-500/10 p-3.5">
                    <p className="flex items-center gap-1.5 text-sm text-rose-300">
                      <IconAlertTriangle className="h-4 w-4" />
                      Delete this student permanently?
                    </p>
                    <div className="mt-2.5 flex gap-2">
                      <button
                        onClick={() => handleDelete(student.id)}
                        disabled={deletingId === student.id}
                        className="flex-1 rounded-lg bg-gradient-to-r from-rose-500 to-orange-500 py-2 text-sm font-semibold text-white transition-all duration-200 hover:shadow-[0_4px_14px_-2px_rgba(244,63,94,0.5)] disabled:opacity-60"
                      >
                        {deletingId === student.id ? (
                          <span className="flex items-center justify-center gap-1.5">
                            <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                            Deleting
                          </span>
                        ) : (
                          "Confirm"
                        )}
                      </button>
                      <button
                        onClick={() => setConfirmingId(null)}
                        className="flex-1 rounded-lg border border-white/10 py-2 text-sm font-semibold text-slate-300 transition-colors duration-200 hover:bg-white/5"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmingId(student.id)}
                    className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl border border-white/10 py-2 text-sm font-semibold text-slate-400 opacity-0 transition-all duration-200 group-hover:opacity-100 hover:border-rose-400/30 hover:bg-rose-500/10 hover:text-rose-300"
                  >
                    <IconTrash className="h-3.5 w-3.5" />
                    Delete Student
                  </button>
                )}
              </div>
            ))}

            {students.length === 0 && (
              <div className="col-span-full flex flex-col items-center py-20 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/5 text-slate-500">
                  <IconUsers className="h-7 w-7" />
                </div>
                <p className="mt-4 font-medium text-slate-300">
                  No students found
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeSlideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default AdminStudentsPage;