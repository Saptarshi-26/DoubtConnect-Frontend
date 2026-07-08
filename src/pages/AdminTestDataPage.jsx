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

function AdminTestDataPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("teachers");

  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setLoadError("");
    try {
      const [teachersRes, studentsRes] = await Promise.all([
        api.get("/test-data/teachers"),
        api.get("/test-data/students"),
      ]);
      setTeachers(Array.isArray(teachersRes.data) ? teachersRes.data : []);
      setStudents(Array.isArray(studentsRes.data) ? studentsRes.data : []);
    } catch (err) {
      console.log(err);
      setLoadError("Unable to load test data right now.");
    } finally {
      setLoading(false);
    }
  };

  const list = tab === "teachers" ? teachers : students;

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-6xl px-6 py-10 sm:px-8 sm:py-12">
        <button
          onClick={() => navigate("/admin")}
          className="inline-flex items-center gap-2 font-medium text-blue-600 hover:underline"
        >
          <IconArrowLeft className="h-4 w-4" />
          Back to Admin Dashboard
        </button>

        <h1 className="mt-6 text-4xl font-bold text-slate-900">Test Data</h1>
        <p className="mt-2 text-slate-500">
          Preview seeded demo teachers and students used for testing.
        </p>

        <div className="mt-8 flex gap-2 rounded-2xl bg-white p-1.5 shadow-sm w-fit">
          <button
            onClick={() => setTab("teachers")}
            className={`rounded-xl px-5 py-2.5 font-medium transition ${
              tab === "teachers"
                ? "bg-blue-600 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Teachers ({teachers.length})
          </button>
          <button
            onClick={() => setTab("students")}
            className={`rounded-xl px-5 py-2.5 font-medium transition ${
              tab === "students"
                ? "bg-blue-600 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Students ({students.length})
          </button>
        </div>

        {loading && (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 animate-pulse rounded-3xl bg-white/70" />
            ))}
          </div>
        )}

        {!loading && loadError && (
          <div className="mt-8 rounded-3xl border border-red-200 bg-red-50 p-8 text-center">
            <p className="text-red-600">{loadError}</p>
            <button
              onClick={loadData}
              className="mt-4 rounded-xl bg-red-600 px-5 py-2.5 font-semibold text-white hover:bg-red-500"
            >
              Try again
            </button>
          </div>
        )}

        {!loading && !loadError && (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((person) => (
              <div key={person.id} className="rounded-3xl bg-white p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <img
                    src={
                      person.profilePictureUrl ||
                      "https://placehold.co/80x80?text=👤"
                    }
                    alt={person.name}
                    className="h-14 w-14 rounded-full border object-cover"
                  />
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-800">
                      {person.name}
                    </p>
                    <p className="text-sm text-slate-500">
                      {tab === "teachers"
                        ? person.subjects?.join(", ") || person.language
                        : [person.grade && `Grade ${person.grade}`, person.board]
                            .filter(Boolean)
                            .join(" · ")}
                    </p>
                  </div>
                </div>

                {tab === "teachers" && person.bio && (
                  <p className="mt-3 line-clamp-2 text-sm text-slate-500">
                    {person.bio}
                  </p>
                )}

                {tab === "teachers" && person.ratePerThirtyMin != null && (
                  <p className="mt-3 text-sm font-semibold text-blue-600">
                    ₹{person.ratePerThirtyMin} / 30 min
                  </p>
                )}
              </div>
            ))}

            {list.length === 0 && (
              <p className="col-span-full py-16 text-center text-slate-500">
                No test {tab} found.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminTestDataPage;
