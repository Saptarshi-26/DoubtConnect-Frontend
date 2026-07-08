import { useEffect, useState } from "react";
import api from "../api/axios";

function IconX(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M18 6 6 18" />
      <path d="M6 6l12 12" />
    </svg>
  );
}

function IconFlag(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <path d="M4 22V15" />
    </svg>
  );
}

// Best-effort field readers — backend returns the raw Report entity.
const getTeacherId = (r) =>
  r.teacherProfileId ?? r.teacherProfile?.id ?? r.teacherId ?? null;
const getTeacherLabel = (r) =>
  r.teacherProfile?.user?.username ??
  r.teacherName ??
  (getTeacherId(r) ? `Teacher #${getTeacherId(r)}` : "Unknown teacher");
const getReason = (r) => r.reason ?? "—";
const getDescription = (r) => r.description ?? "";

/**
 * Modal that fetches and displays the reports a student has filed,
 * with the ability to remove any of them.
 *
 * Props:
 * - studentId: number
 * - onClose: () => void
 */
function MyReportsModal({ studentId, onClose }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [removingKey, setRemovingKey] = useState(null);

  useEffect(() => {
    loadReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadReports = async () => {
    setLoading(true);
    setLoadError("");
    try {
      const res = await api.get("/report", {
        params: { studentProfileId: studentId },
      });
      setReports(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.log(err);
      setLoadError("Unable to load your reports right now.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (report, idx) => {
    const teacherId = getTeacherId(report);
    if (!teacherId) {
      alert("Couldn't determine which teacher this report is for.");
      return;
    }

    const key = report.id ?? idx;
    setRemovingKey(key);
    try {
      await api.delete("/report", {
        params: { studentProfileId: studentId, teacherProfileId: teacherId },
      });
      setReports((prev) => prev.filter((_, i) => i !== idx));
    } catch (err) {
      console.log(err);
      alert("Unable to remove this report.");
    } finally {
      setRemovingKey(null);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 sm:p-8"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-[32px] bg-white p-8 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-lg font-bold text-slate-800">My Reports</p>
            <p className="text-sm text-slate-400">
              Reports you've filed against educators
            </p>
          </div>

          <button
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <IconX className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6">
          {loading && (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-20 animate-pulse rounded-2xl bg-slate-100" />
              ))}
            </div>
          )}

          {!loading && loadError && (
            <p className="rounded-2xl border border-red-200 bg-red-50 p-5 text-center text-red-600">
              {loadError}
            </p>
          )}

          {!loading && !loadError && reports.length === 0 && (
            <div className="flex flex-col items-center rounded-2xl bg-slate-50 p-10 text-center">
              <IconFlag className="h-10 w-10 text-slate-300" />
              <p className="mt-4 font-semibold text-slate-700">
                No reports filed
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Reports you file against educators will show up here.
              </p>
            </div>
          )}

          {!loading && !loadError && reports.length > 0 && (
            <div className="space-y-4">
              {reports.map((report, idx) => {
                const key = report.id ?? idx;
                const busy = removingKey === key;
                return (
                  <div key={key} className="rounded-2xl bg-slate-50 p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold text-slate-800">
                          {getTeacherLabel(report)}
                        </p>
                        <p className="mt-1 text-sm font-medium text-red-600">
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
    </div>
  );
}

export default MyReportsModal;
