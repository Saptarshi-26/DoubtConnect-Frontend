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

// Best-effort field readers — the backend returns the raw Report entity,
// so field names are read defensively in case the shape differs slightly.
const getTeacherLabel = (r) =>
  r.teacherProfile?.user?.username ??
  r.teacherName ??
  (r.teacherProfileId ?? r.teacherProfile?.id ?? r.teacherId
    ? `Teacher #${r.teacherProfileId ?? r.teacherProfile?.id ?? r.teacherId}`
    : "Unknown teacher");

const getStudentLabel = (r) =>
  r.studentProfile?.user?.username ??
  r.studentName ??
  (r.studentProfileId ?? r.studentProfile?.id ?? r.studentId
    ? `Student #${r.studentProfileId ?? r.studentProfile?.id ?? r.studentId}`
    : "Unknown student");

const getReason = (r) => r.reason ?? "—";
const getDescription = (r) => r.description ?? "";

function AdminReportsPage() {
  const navigate = useNavigate();

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setLoading(true);
    setLoadError("");
    try {
      const res = await api.get("/report/all");
      setReports(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.log(err);
      setLoadError("Unable to load reports right now.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (report, idx) => {
    if (!report.id) {
      alert("This report has no ID — can't remove it.");
      return;
    }

    setRemovingId(report.id);
    try {
      await api.delete(`/report/admin/${report.id}`);
      setReports((prev) => prev.filter((_, i) => i !== idx));
    } catch (err) {
      console.log(err);
      alert("Unable to remove this report.");
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-3xl px-6 py-10 sm:px-8 sm:py-12">
        <button
          onClick={() => navigate("/admin")}
          className="inline-flex items-center gap-2 font-medium text-blue-600 hover:underline"
        >
          <IconArrowLeft className="h-4 w-4" />
          Back to Admin Dashboard
        </button>

        <h1 className="mt-6 text-4xl font-bold text-slate-900">Reports</h1>
        <p className="mt-2 text-slate-500">
          {reports.length} report{reports.length !== 1 ? "s" : ""} filed across the platform.
        </p>

        {loading && (
          <div className="mt-8 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 animate-pulse rounded-2xl bg-white/70" />
            ))}
          </div>
        )}

        {!loading && loadError && (
          <div className="mt-8 rounded-3xl border border-red-200 bg-red-50 p-8 text-center">
            <p className="text-red-600">{loadError}</p>
            <button
              onClick={loadReports}
              className="mt-4 rounded-xl bg-red-600 px-5 py-2.5 font-semibold text-white hover:bg-red-500"
            >
              Try again
            </button>
          </div>
        )}

        {!loading && !loadError && reports.length === 0 && (
          <div className="mt-8 rounded-3xl bg-white py-16 text-center shadow-sm">
            <p className="text-slate-500">No reports filed yet.</p>
          </div>
        )}

        {!loading && !loadError && reports.length > 0 && (
          <div className="mt-8 space-y-4">
            {reports.map((report, idx) => {
              const key = report.id ?? idx;
              const busy = removingId === report.id;
              return (
                <div key={key} className="rounded-2xl bg-white p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-800">
                        {getTeacherLabel(report)}
                      </p>
                      <p className="text-sm text-slate-400">
                        Reported by {getStudentLabel(report)}
                      </p>
                      <p className="mt-2 text-sm font-medium text-red-600">
                        {getReason(report)}
                      </p>
                      {getDescription(report) && (
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {getDescription(report)}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleRemove(report, idx)}
                      disabled={busy}
                      className="shrink-0 rounded-lg border border-red-200 px-3 py-1.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                    >
                      {busy ? "Removing..." : "Remove"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminReportsPage;
