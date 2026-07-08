import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import TeacherReviewsModal from "../components/reviews/TeacherReviewsModal";

function IconSearch(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function IconX(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M18 6 6 18" />
      <path d="M6 6l12 12" />
    </svg>
  );
}

function IconHeart({ filled, ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"}
      stroke="currentColor" strokeWidth="2" strokeLinecap="round"
      strokeLinejoin="round" {...props}>
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 12 5.5 5.5 5.5 0 0 0 4.5 8.5C4.5 13 12 21 12 21s7.5-8 7.5-8" />
    </svg>
  );
}

function IconFlask(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M9 3h6" />
      <path d="M10 3v6.5L4.5 19a1.5 1.5 0 0 0 1.3 2.2h12.4a1.5 1.5 0 0 0 1.3-2.2L14 9.5V3" />
      <path d="M7 14h10" />
    </svg>
  );
}

function EducatorsPage() {
    const navigate = useNavigate();

  const [educators, setEducators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewsFor, setReviewsFor] = useState(null);

  const [subjectQuery, setSubjectQuery] = useState("");
  const [searchActive, setSearchActive] = useState(false);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

  const [favouriteIds, setFavouriteIds] = useState(new Set());
  const [showFavouritesOnly, setShowFavouritesOnly] = useState(false);
  const [favouriteBusyId, setFavouriteBusyId] = useState(null);

  const [showTestEducators, setShowTestEducators] = useState(false);
  const [loadingTestEducators, setLoadingTestEducators] = useState(false);
  const [testEducatorIds, setTestEducatorIds] = useState(new Set());

  const [confirmingDeleteId, setConfirmingDeleteId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const role = localStorage.getItem("role");
  const studentProfileId = localStorage.getItem("profileId");
  const isStudent = role === "STUDENT";
  const isAdmin = role === "ADMIN";

  const mapTeacherProfile = (t) => ({
    id: t.id,
    name: t.user?.username,
    profilePictureUrl: t.profilePictureUrl,
    subjects: t.subjects,
    language: t.language,
    bio: t.bio,
    ratePerThirtyMin: t.ratePerThirtyMin,
    rating: t.rating,
    numberOfRatings: t.numberOfRatings,
  });

  const fetchFavourites = async () => {
    try {
      const res = await api.get(`/student/${studentProfileId}/favourites`);
      return Array.isArray(res.data) ? res.data.map(mapTeacherProfile) : [];
    } catch (err) {
      console.log(err);
      return [];
    }
  };

  const getTestEducatorIds = async () => {
    try {
      const res = await api.get("/test-data/teachers");
      return new Set(
        Array.isArray(res.data) ? res.data.map((t) => t.id) : []
      );
    } catch (err) {
      console.log(err);
      return new Set();
    }
  };

  const handleDeleteEducator = async (id) => {
    setDeletingId(id);
    try {
      await api.delete(`/teacher/${id}`);
      setEducators((prev) => prev.filter((e) => e.id !== id));
      setConfirmingDeleteId(null);
    } catch (err) {
      console.log(err);
      alert("Unable to delete this educator.");
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    loadEducators();
    if (isStudent) {
      fetchFavourites().then((list) =>
        setFavouriteIds(new Set(list.map((t) => t.id)))
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadEducators = async () => {
    try {
const endpoint =
  role === "ADMIN"
    ? "/teacher/getAllInternal"
    : "/teacher/getAll";

const [res, testIds] = await Promise.all([
  api.get(endpoint),
  getTestEducatorIds(),
]);
console.log(res.data);

setTestEducatorIds(testIds);

      if (Array.isArray(res.data)) {
        setEducators(res.data.filter((e) => !testIds.has(e.id)));
      } else {
        setEducators([]);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    const subject = subjectQuery.trim();
    if (!subject) return;

    setShowTestEducators(false);
    setShowFavouritesOnly(false);
    setSearching(true);
    setSearchError("");
    try {
      const res = await api.get("/teacher/search", {
        params: { subject },
      });

      if (Array.isArray(res.data)) {
        setEducators(res.data.filter((e) => !testEducatorIds.has(e.id)));
      } else {
        setEducators([]);
      }
      setSearchActive(true);
    } catch (err) {
      console.log(err);
      setSearchError("Unable to search right now. Please try again.");
    } finally {
      setSearching(false);
    }
  };

  const handleClearSearch = () => {
    setSubjectQuery("");
    setSearchActive(false);
    setSearchError("");
    setLoading(true);
    loadEducators();
  };

  const handleToggleFavouritesOnly = async () => {
    if (showFavouritesOnly) {
      setShowFavouritesOnly(false);
      setSearchActive(false);
      setSubjectQuery("");
      setLoading(true);
      loadEducators();
      return;
    }

    setShowTestEducators(false);
    setShowFavouritesOnly(true);
    setSearchActive(false);
    setSubjectQuery("");
    setLoading(true);
    const list = await fetchFavourites();
    const filtered = list.filter((t) => !testEducatorIds.has(t.id));
    setEducators(filtered);
    setFavouriteIds(new Set(filtered.map((t) => t.id)));
    setLoading(false);
  };

  const handleToggleTestEducators = async () => {
    if (showTestEducators) {
      setShowTestEducators(false);
      setLoading(true);
      loadEducators();
      return;
    }

    setShowFavouritesOnly(false);
    setSearchActive(false);
    setSubjectQuery("");
    setShowTestEducators(true);
    setLoadingTestEducators(true);
    setLoading(true);
    try {
      const res = await api.get("/test-data/teachers");
      setEducators(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.log(err);
      setEducators([]);
    } finally {
      setLoading(false);
      setLoadingTestEducators(false);
    }
  };

  const toggleFavourite = async (teacherId) => {
    if (favouriteBusyId) return;

    const isFav = favouriteIds.has(teacherId);

    setFavouriteBusyId(teacherId);
    setFavouriteIds((prev) => {
      const next = new Set(prev);
      isFav ? next.delete(teacherId) : next.add(teacherId);
      return next;
    });

    try {
      if (isFav) {
        await api.delete("/student/favourite", {
          data: { studentId: studentProfileId, teacherId },
        });
        if (showFavouritesOnly) {
          setEducators((prev) => prev.filter((e) => e.id !== teacherId));
        }
      } else {
        await api.post("/student/favourite", {
          studentId: studentProfileId,
          teacherId,
        });
      }
    } catch (err) {
      console.log(err);
      setFavouriteIds((prev) => {
        const next = new Set(prev);
        isFav ? next.add(teacherId) : next.delete(teacherId);
        return next;
      });
    } finally {
      setFavouriteBusyId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">

      <div className="mx-auto max-w-7xl px-8 py-12">

        <div className="mb-12">

          <h1 className="text-5xl font-bold text-slate-800">
            Find an Educator
          </h1>

          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-500">
            Learn from experienced educators whenever you need help.
            Browse profiles, compare expertise and start learning.
          </p>

          <div className="mt-8 flex max-w-xl gap-3">
            <div className="relative flex-1">
              <IconSearch className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                value={subjectQuery}
                onChange={(e) => setSubjectQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Search by subject, e.g. Physics"
                className="w-full rounded-2xl border border-slate-300 bg-white py-3.5 pl-12 pr-4 outline-none transition focus:border-blue-500"
              />
            </div>

            <button
              onClick={handleSearch}
              disabled={searching || !subjectQuery.trim()}
              className="rounded-2xl bg-blue-600 px-6 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {searching ? "Searching..." : "Search"}
            </button>

            {searchActive && (
              <button
                onClick={handleClearSearch}
                className="flex items-center gap-1.5 rounded-2xl border border-slate-300 px-5 font-medium text-slate-700 transition hover:bg-slate-100"
              >
                <IconX className="h-4 w-4" />
                Clear
              </button>
            )}

            {isStudent && (
              <button
                onClick={handleToggleFavouritesOnly}
                className={`flex shrink-0 items-center gap-1.5 rounded-2xl border px-5 font-medium transition ${
                  showFavouritesOnly
                    ? "border-red-200 bg-red-50 text-red-600"
                    : "border-slate-300 text-slate-700 hover:bg-slate-100"
                }`}
              >
                <IconHeart filled={showFavouritesOnly} className="h-4 w-4" />
                Favourites
              </button>
            )}

            {isStudent && (
              <button
                onClick={handleToggleTestEducators}
                disabled={loadingTestEducators}
                className={`flex shrink-0 items-center gap-1.5 rounded-2xl border px-5 font-medium transition disabled:cursor-not-allowed ${
                  showTestEducators
                    ? "border-purple-200 bg-purple-50 text-purple-600"
                    : "border-slate-300 text-slate-700 hover:bg-slate-100"
                }`}
              >
                <IconFlask className="h-4 w-4" />
                {showTestEducators ? "Exit Test Mode" : "Try Test Educators"}
              </button>
            )}
          </div>

          {showTestEducators && (
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-purple-50 px-4 py-2.5">
              <p className="text-sm text-purple-700">
                You're browsing demo educators. You can request sessions
                and favourite them just like real educators — this is
                just for exploring the app.
              </p>
              <button
                onClick={handleToggleTestEducators}
                className="shrink-0 rounded-lg bg-purple-600 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-purple-500"
              >
                ← Back to Educators
              </button>
            </div>
          )}

          {searchError && (
            <p className="mt-3 text-sm text-red-500">{searchError}</p>
          )}

        </div>


        {loading ? (

          <div className="py-24 text-center text-slate-500 text-lg">
            Loading educators...
          </div>

        ) : educators.length === 0 ? (

          <div className="rounded-3xl bg-white py-24 text-center shadow-sm">
            <p className="text-lg font-semibold text-slate-700">
              {showTestEducators
                ? "No test educators found"
                : showFavouritesOnly
                ? "You haven't favourited any educators yet"
                : searchActive
                ? `No educators found for "${subjectQuery}"`
                : "No educators found"}
            </p>
            {(searchActive || showFavouritesOnly || showTestEducators) && (
              <button
                onClick={
                  showTestEducators
                    ? handleToggleTestEducators
                    : showFavouritesOnly
                    ? handleToggleFavouritesOnly
                    : handleClearSearch
                }
                className="mt-4 font-semibold text-blue-600 hover:underline"
              >
                {showTestEducators || showFavouritesOnly
                  ? "Browse all educators"
                  : "Clear search and browse all educators"}
              </button>
            )}
          </div>

        ) : (

          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

            {educators.map((educator) => (
            

              <div
                key={educator.id}
                className="relative rounded-3xl bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >

                {isStudent && (
                  <button
                    onClick={() => toggleFavourite(educator.id)}
                    disabled={favouriteBusyId === educator.id}
                    className="absolute right-6 top-6 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-red-500 shadow-sm transition hover:bg-red-50 disabled:opacity-50"
                  >
                    <IconHeart
                      filled={favouriteIds.has(educator.id)}
                      className="h-5 w-5"
                    />
                  </button>
                )}

                <div
                  onClick={() => navigate(`/educators/${educator.id}`)}
                  className="flex cursor-pointer items-center gap-5"
                >

                  <img
                    src={
                      educator.profilePictureUrl ||
                      "https://placehold.co/100x100?text=👤"
                    }
                    alt={educator.name}
                    className="h-20 w-20 rounded-full object-cover border"
                  />

                  <div className="flex-1 min-w-0">

                    <h2 className="text-xl font-bold leading-tight text-slate-800 break-words hover:underline">
                      {educator.name}
                    </h2>

                   <p className="mt-1 text-slate-500">
  {educator.language}
</p>

{educator.paymentMethod && (
  <span className="mt-2 inline-block rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">
    💳 Accepts {educator.paymentMethod === "BANK" ? "Bank Transfer" : educator.paymentMethod}
  </span>
)}

                  </div>

                </div>

                <div className="mt-7">

                  <p className="font-semibold text-slate-700">
                    Subjects
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">

                    {educator.subjects?.map((subject) => (
                      <span
                        key={subject}
                        className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700"
                      >
                        {subject}
                      </span>
                    ))}

                  </div>

                </div>

                <p className="mt-7 line-clamp-3 leading-7 text-slate-600">
                  {educator.bio}
                </p>                <div className="mt-8 flex items-center justify-between">

                  <div>

                    <p className="text-lg font-semibold text-slate-800">
                      ⭐ {educator.rating.toFixed(1)}
                    </p>

                    <p className="text-sm text-slate-500">
                      {educator.numberOfRatings} reviews
                    </p>

                  </div>

                  <div className="text-right">

                    <p className="text-2xl font-bold text-blue-600">
                      ₹{educator.ratePerThirtyMin}
                    </p>

                    <p className="text-sm text-slate-500">
                      / 30 min
                    </p>

                  </div>

                </div>

                <div className="mt-8 flex gap-3">

  {!isAdmin && (
    <button
      onClick={() => navigate(`/session-request/${educator.id}`)}
      className="flex-1 rounded-xl bg-blue-600 py-3 font-medium text-white transition hover:bg-blue-500"
    >
      Request Session
    </button>
  )}

  <button
    onClick={() => setReviewsFor(educator)}
    className="rounded-xl border border-slate-300 px-5 py-3 font-medium text-slate-700 transition hover:bg-slate-100"
  >
    Reviews
  </button>

  {isAdmin && (
    <button
      onClick={() => navigate(`/educators/${educator.id}`)}
      className="flex-1 rounded-xl border border-slate-300 py-3 font-medium text-slate-700 transition hover:bg-slate-100"
    >
      View Profile
    </button>
  )}
</div>

                {isAdmin && (
                  <div className="mt-3">
                    {confirmingDeleteId === educator.id ? (
                      <div className="rounded-xl bg-red-50 p-3">
                        <p className="text-sm text-red-700">
                          Delete this educator permanently?
                        </p>
                        <div className="mt-2 flex gap-2">
                          <button
                            onClick={() => handleDeleteEducator(educator.id)}
                            disabled={deletingId === educator.id}
                            className="flex-1 rounded-lg bg-red-600 py-2 text-sm font-semibold text-white hover:bg-red-500 disabled:bg-slate-400"
                          >
                            {deletingId === educator.id ? "Deleting..." : "Confirm Delete"}
                          </button>
                          <button
                            onClick={() => setConfirmingDeleteId(null)}
                            className="flex-1 rounded-lg border border-slate-300 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmingDeleteId(educator.id)}
                        className="w-full rounded-xl border border-red-200 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                      >
                        Delete Educator
                      </button>
                    )}
                  </div>
                )}

</div>

            ))}

          </div>

        )}

      </div>

      {reviewsFor && (
        <TeacherReviewsModal
          teacherId={reviewsFor.id}
          teacherName={reviewsFor.name}
          onClose={() => setReviewsFor(null)}
        />
      )}

    </div>
  );
}

export default EducatorsPage;