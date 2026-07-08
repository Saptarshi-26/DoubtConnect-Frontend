import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

const DURATIONS = [30, 60, 90, 120];
const MAX_IMAGES = 5;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const SUBJECT_LIMIT = 100;
const DESCRIPTION_LIMIT = 1000;

// --- Clean, High-Fidelity Icons ---
function IconArrowLeft(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}

function IconUpload(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
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

function IconCheck(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function IconStar(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function SessionRequestPage() {
  const { teacherId } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [educator, setEducator] = useState(null);
  const [educatorError, setEducatorError] = useState(false);

  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    sessionDuration: 30,
  });

  const [images, setImages] = useState([]); 
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    loadEducator();
  }, []);

  useEffect(() => {
    return () => {
      images.forEach((img) => URL.revokeObjectURL(img.previewUrl));
    };
  }, [images]);

  const loadEducator = async () => {
    try {
      const res = await api.get(`/teacher/${teacherId}`);
      setEducator(res.data);
    } catch (err) {
      console.log(err);
      setEducatorError(true);
    }
  };

  const estimatedCost = useMemo(() => {
    if (!educator?.ratePerThirtyMin) return null;
    return (formData.sessionDuration / 30) * educator.ratePerThirtyMin;
  }, [educator, formData.sessionDuration]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleDuration = (duration) => {
    setFormData((prev) => ({ ...prev, sessionDuration: duration }));
  };

  const handleFilesSelected = (fileList) => {
    const incoming = Array.from(fileList || []);
    if (incoming.length === 0) return;

    let nextImages = [...images];
    let fileError = "";

    for (const file of incoming) {
      if (nextImages.length >= MAX_IMAGES) {
        fileError = `You can attach up to ${MAX_IMAGES} images.`;
        break;
      }
      if (!ALLOWED_TYPES.includes(file.type)) {
        fileError = "Only JPEG, PNG, or WEBP images are allowed.";
        continue;
      }
      if (file.size > MAX_IMAGE_SIZE) {
        fileError = "Each image must be smaller than 5MB.";
        continue;
      }
      nextImages.push({ file, previewUrl: URL.createObjectURL(file) });
    }

    setImages(nextImages);
    setErrors((prev) => ({ ...prev, images: fileError || undefined }));
  };

  const handleFileInputChange = (e) => {
    handleFilesSelected(e.target.files);
    e.target.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFilesSelected(e.dataTransfer.files);
  };

  const removeImage = (index) => {
    setImages((prev) => {
      const next = [...prev];
      URL.revokeObjectURL(next[index].previewUrl);
      next.splice(index, 1);
      return next;
    });
  };

  const validate = () => {
    const nextErrors = {};
    if (!formData.subject.trim()) nextErrors.subject = "Please enter a subject.";
    if (!formData.description.trim()) nextErrors.description = "Please describe your doubt.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    if (!validate()) return;

    const profileId = Number(localStorage.getItem("profileId"));
    if (!profileId) {
      setSubmitError("You'll need to be logged in to send a request.");
      return;
    }

    const requestPayload = {
      studentProfileId: profileId,
      teacherProfileId: Number(teacherId),
      subject: formData.subject.trim(),
      description: formData.description.trim(),
      sessionDuration: Number(formData.sessionDuration),
    };

    const body = new FormData();
    body.append("request", new Blob([JSON.stringify(requestPayload)], { type: "application/json" }));
    images.forEach((img) => body.append("images", img.file));

    try {
      setLoading(true);
      await api.post("/session/save", body, { headers: { "Content-Type": "multipart/form-data" } });
      setSubmitted(true);
    } catch (err) {
      setSubmitError("Unable to send your session request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // --- Premium Success Screen State ---
  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF9] text-slate-950 dark:bg-slate-950 dark:text-white px-6 antialiased relative overflow-hidden">
        <div className="absolute top-0 w-full h-[500px] bg-gradient-to-b from-emerald-500/10 to-transparent blur-[80px] pointer-events-none" />
        
        <div className="w-full max-w-[440px] rounded-3xl border border-slate-300 bg-white dark:bg-slate-900 dark:border-white/20 p-8 sm:p-10 text-center shadow-xl relative z-10">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
            <IconCheck className="h-6 w-6" />
          </div>
          
          <h2 className="mt-6 text-2xl font-extrabold tracking-tight">Request Transmitted</h2>
          <p className="mt-3 text-[14px] font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
            Your proposal has been successfully generated for {" "}
            <span className="font-bold text-slate-950 dark:text-white">
              {educator?.name || "the educator"}
            </span>
            . They will review and schedule your stream shortly.
          </p>
          
          <div className="mt-8 space-y-3">
            <button 
              onClick={() => navigate("/student-session-requests")} 
              className="w-full rounded-xl bg-indigo-600 py-3.5 text-sm font-semibold text-white hover:bg-indigo-700 active:scale-[0.98] transition-all duration-200 shadow-md shadow-indigo-600/10"
            >
              View My Requests
            </button>
            <Link 
              to="/educators" 
              className="w-full rounded-xl border border-slate-300 dark:border-white/20 bg-transparent py-3.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] text-center block transition-all duration-200"
            >
              Back to Directory
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-slate-950 dark:bg-[#06070B] dark:text-white antialiased relative overflow-hidden">
      
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/10 dark:bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-5%] right-[5%] w-[450px] h-[450px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Reverted Back to True Original Two Column Side-by-Side Grid */}
      <div className="relative mx-auto flex max-w-5xl flex-col lg:flex-row items-stretch gap-12 px-6 py-16 sm:px-8 sm:py-24">
        
        {/* Left Sticky Column Container */}
        <div className="w-full lg:w-[38%] lg:sticky lg:top-20 flex flex-col justify-start py-2">
          
          {/* Educator Profile Card Placed Exactly At The Top Left */}
          <div className="rounded-2xl border-2 border-slate-400 bg-white p-6 dark:border-white/30 dark:bg-[#0D0F16] shadow-md transition-all duration-300">
            <div className="flex items-center gap-4 border-b border-slate-300 dark:border-white/20 pb-5">
              <img
                src={educator?.profilePictureUrl || "https://placehold.co/100x100?text=👤"}
                alt={educator?.name || "Educator"}
                className="h-14 w-14 rounded-xl border border-slate-300 object-cover bg-slate-100 dark:border-white/30"
              />
              <div>
                <h3 className="text-[16px] font-bold tracking-tight text-slate-950 dark:text-white">
                  {educator ? educator.name : "Syncing details..."}
                </h3>
                <p className="mt-1 flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-slate-200">
                  <IconStar className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                  <span>{educator?.rating?.toFixed(1) ?? "0.0"}</span> 
                  <span className="text-slate-500 dark:text-slate-400 font-semibold">({educator?.numberOfRatings ?? 0} reviews)</span>
                </p>
              </div>
            </div>

            {/* Price Configurations Block */}
            <div className="mt-5 grid grid-cols-2 gap-4 pt-1">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Base Unit Rate
                </p>
                <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950 dark:text-white">
                  ₹{educator?.ratePerThirtyMin ?? "--"}
                </h2>
                <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">per 30 mins</p>
              </div>

              <div className="text-right border-l border-slate-300 dark:border-white/20 pl-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Estimated Total
                </p>
                <h2 className="mt-1 text-2xl font-black tracking-tight text-indigo-600 dark:text-indigo-400">
                  {estimatedCost !== null ? `₹${estimatedCost}` : "--"}
                </h2>
                <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">for context</p>
              </div>
            </div>
          </div>

          {/* Heading Content Repositioned Directly Below the Educator Card */}
          <div className="mt-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/80 dark:border-white/20 dark:bg-white/5 backdrop-blur-sm px-3 py-1 text-xs font-semibold tracking-wide text-indigo-600 dark:text-indigo-400 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-pulse" />
              Scheduling Protocol
            </div>

            <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white leading-[1.15]">
              Request a <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-400 dark:from-indigo-400 dark:to-indigo-200">live session.</span>
            </h1>

            <p className="mt-4 text-[14px] font-bold leading-relaxed text-slate-800 dark:text-slate-200">
              {educator
                ? `Conducted in ${educator.language} • ${(educator.subjects || []).join(" • ")}`
                : educatorError
                ? "Unable to extract specific educator variables."
                : "Parsing academic profile..."}
            </p>
          </div>
          
        </div>

        {/* Right Column: Submission Form Subsystem */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="mb-4 self-start">
            <Link
              to="/educators"
              className="group inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-800 hover:text-indigo-600 dark:text-slate-200 dark:hover:text-indigo-400 transition-colors duration-200"
            >
              <IconArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
              Return to Catalog
            </Link>
          </div>

          <div className="rounded-3xl border border-slate-300 bg-white p-6 dark:border-white/30 dark:bg-[#0C0E14] shadow-md sm:p-8">
            <h2 className="text-lg font-bold tracking-tight text-slate-950 dark:text-white">Scope & Subject parameters</h2>
            <p className="mt-1 text-xs font-semibold text-slate-600 dark:text-slate-300 leading-relaxed">
              Define the roadblocks or targeted questions clearly so your educator can plan technical architecture prior to connection.
            </p>

            {submitError && (
              <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-rose-400 bg-rose-500/[0.04] p-4 text-xs font-bold text-rose-700 dark:text-rose-400">
                <span>{submitError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
              
              {/* Subject Input Field */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">Topic of Discussion</label>
                  <span className={`text-[10px] font-bold ${formData.subject.length > SUBJECT_LIMIT ? "text-rose-500" : "text-slate-500"}`}>
                    {formData.subject.length} / {SUBJECT_LIMIT}
                  </span>
                </div>
                <input
                  name="subject"
                  type="text"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="e.g., Red-Black Tree Balancing & Complexities"
                  className={`mt-2 w-full rounded-xl border px-4 py-3 text-sm text-slate-950 placeholder:text-slate-400 outline-none transition-all duration-200 bg-slate-50/50 focus:border-indigo-500 focus:bg-white dark:bg-white/[0.02] dark:text-white dark:placeholder:text-slate-500 dark:focus:border-indigo-400 dark:focus:bg-[#11131C] ${
                    errors.subject ? "border-rose-500 dark:border-rose-400" : "border-slate-400 dark:border-white/30"
                  }`}
                />
                {errors.subject && (
                  <p className="mt-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400">· {errors.subject}</p>
                )}
              </div>

              {/* Description Input Field */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">Detailed Scope Specification</label>
                  <span className={`text-[10px] font-bold ${formData.description.length > DESCRIPTION_LIMIT ? "text-rose-500" : "text-slate-500"}`}>
                    {formData.description.length} / {DESCRIPTION_LIMIT}
                  </span>
                </div>
                <textarea
                  rows="4"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Elaborate on code segments or edge cases you require structured explanations for..."
                  className={`mt-2 w-full resize-none rounded-xl border px-4 py-3 text-sm text-slate-950 placeholder:text-slate-400 outline-none transition-all duration-200 bg-slate-50/50 focus:border-indigo-500 focus:bg-white dark:bg-white/[0.02] dark:text-white dark:placeholder:text-slate-500 dark:focus:border-indigo-400 dark:focus:bg-[#11131C] ${
                    errors.description ? "border-rose-500 dark:border-rose-400" : "border-slate-400 dark:border-white/30"
                  }`}
                />
                {errors.description && (
                  <p className="mt-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400">· {errors.description}</p>
                )}
              </div>

              {/* Duration Grid Blocks */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
                  Target Stream Duration
                </label>
                <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {DURATIONS.map((duration) => {
                    const isSelected = formData.sessionDuration === duration;
                    return (
                      <button
                        key={duration}
                        type="button"
                        onClick={() => handleDuration(duration)}
                        className={`relative rounded-xl border-2 py-3 px-2 text-center transition-all duration-200 ${
                          isSelected
                            ? "border-indigo-600 bg-indigo-50 text-indigo-600 dark:border-indigo-400 dark:bg-indigo-400/20 dark:text-indigo-400 font-bold shadow-sm"
                            : "border-slate-300 bg-slate-50 hover:border-slate-400 dark:border-white/20 dark:bg-white/[0.02] dark:hover:border-white/40 text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        <span className="text-base tracking-tight block">{duration}</span>
                        <span className="text-[9px] font-bold uppercase tracking-wider opacity-60 block mt-0.5">Mins</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Upload Drop Area */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
                    Supporting Material Context <span className="text-slate-500 dark:text-slate-400 font-medium">(Optional)</span>
                  </label>
                  <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">
                    {images.length} / {MAX_IMAGES}
                  </span>
                </div>

                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-400 bg-slate-50/50 dark:border-white/30 dark:bg-white/[0.01] p-5 text-center transition-all duration-200 hover:border-indigo-600 dark:hover:border-indigo-400"
                >
                  <IconUpload className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                  <p className="mt-2 text-xs font-bold text-slate-950 dark:text-white">
                    Drop contextual images here or <span className="text-indigo-600 dark:text-indigo-400 underline decoration-2">browse filesystem node</span>
                  </p>
                  <p className="mt-0.5 text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                    WebP, PNG, JPEG up to 5MB each
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                </div>

                {/* Grid Item Image Render Previews */}
                {images.length > 0 && (
                  <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-5">
                    {images.map((img, index) => (
                      <div key={img.previewUrl} className="group relative aspect-video overflow-hidden rounded-lg border border-slate-400 dark:border-white/30">
                        <img
                          src={img.previewUrl}
                          alt={`Attachment ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-md bg-black/80 text-white hover:bg-rose-600 transition-colors duration-150"
                        >
                          <IconX className="h-2.5 w-2.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Primary Dispatch CTA */}
              <button
                type="submit"
                disabled={loading}
                className="mt-4 w-full rounded-xl bg-slate-950 py-3.5 text-xs font-bold uppercase tracking-wider text-white transition-all duration-200 hover:bg-indigo-600 dark:bg-white dark:text-slate-950 dark:hover:bg-indigo-400 dark:hover:text-white disabled:bg-slate-200 disabled:text-slate-400 dark:disabled:bg-white/5 dark:disabled:text-slate-600"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Dispatching context variables...
                  </span>
                ) : (
                  "Dispatch Session Request"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SessionRequestPage;