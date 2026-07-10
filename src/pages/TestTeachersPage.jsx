import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function IconSearch(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function IconFlask(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"
      strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M9 3h6M10 3v6l-5.5 9.5A2 2 0 0 0 6.2 21h11.6a2 2 0 0 0 1.7-2.5L14 9V3" />
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

function IconRupee(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M6 4h12M6 8h12M6 8c5 0 8 1.5 8 4.5S11 17 6 17M6 17l8 7" />
    </svg>
  );
}

function TestTeachersPage() {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/test-data/getAll");
      setTeachers(res.data || []);
    } catch (err) {
      setError("Unable to load test teachers.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return loadAll();
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/test-data/search", { params: { subject: query.trim() } });
      setTeachers(res.data || []);
    } catch (err) {
  console.log(err);
  console.log(err.response);
  console.log(err.response?.data);
  console.log(err.response?.status);

  setError("Unable to search test teachers.");
}finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-slate-950 dark:bg-slate-950 dark:text-white antialiased">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:px-8 sm:py-24">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-semibold tracking-wide text-amber-600 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400">
          <IconFlask className="h-3.5 w-3.5" />
          Test educators
        </div>
        <h1 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl">
          Try Test Teachers
        </h1>
        <p className="mt-3 max-w-xl text-[15px] font-medium leading-relaxed text-slate-600 dark:text-slate-300">
          Book a session with a demo educator to try the full flow end-to-end.
        </p>

        <form onSubmit={handleSearch} className="mt-8 flex gap-3">
          <div className="relative flex-1">
            <IconSearch className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by subject..."
              className="w-full rounded-xl border-2 border-slate-300 bg-white py-3 pl-11 pr-4 text-sm font-medium outline-none focus:border-indigo-500 dark:border-white/20 dark:bg-white/5"
            />
          </div>
          <button
            type="submit"
            className="rounded-xl bg-indigo-600 px-6 py-3 text-xs font-bold uppercase tracking-widest text-white hover:bg-indigo-700"
          >
            Search
          </button>
        </form>

        <div className="mt-10">
          {loading && (
            <div className="grid gap-6 md:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-40 animate-pulse rounded-3xl border-2 border-slate-300 bg-white/70 dark:border-white/20 dark:bg-white/[0.03]" />
              ))}
            </div>
          )}

          {!loading && error && (
            <div className="rounded-3xl border-2 border-red-300 bg-red-50/50 p-8 text-center dark:border-red-500/30 dark:bg-red-500/5">
              <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
              <button onClick={loadAll} className="mt-4 rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white">
                Try again
              </button>
            </div>
          )}

          {!loading && !error && teachers.length === 0 && (
            <div className="rounded-3xl border-2 border-slate-300 bg-white p-16 text-center dark:border-white/20 dark:bg-white/[0.03]">
              <p className="font-semibold text-slate-500 dark:text-slate-400">No test teachers found.</p>
            </div>
          )}

          {!loading && !error && teachers.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2">
              {teachers.map((t) => (
                <div
                  key={t.id}
                  onClick={() => navigate(`/educators/${t.id}`)}
                  className="cursor-pointer rounded-3xl border-2 border-slate-300 bg-white p-8 transition hover:-translate-y-1 hover:shadow-xl dark:border-white/20 dark:bg-white/[0.03]"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={t.profilePictureUrl || "https://placehold.co/80x80?text=👤"}
                      alt={t.name}
                      className="h-12 w-12 rounded-full object-cover border border-slate-300 dark:border-white/30"
                    />
                    <div>
                      <p className="font-extrabold">{t.name}</p>
                      <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                        {(t.subjects || []).slice(0, 2).join(", ")}
                      </p>
                    </div>
                  </div>

                  <p className="mt-4 text-sm font-medium leading-relaxed text-slate-600 dark:text-slate-300 line-clamp-2">
                    {t.bio}
                  </p>

                  <div className="mt-5 flex items-center gap-5 text-xs font-bold uppercase tracking-widest text-slate-400">
                    <span className="flex items-center gap-1 text-amber-500">
                      <IconStar className="h-4 w-4" />
                      {t.rating?.toFixed(1) ?? "New"} ({t.numberOfRatings || 0})
                    </span>
                    <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400">
                      <IconRupee className="h-4 w-4" />
                      {t.ratePerThirtyMin}/30min
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TestTeachersPage;