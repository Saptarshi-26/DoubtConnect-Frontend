import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import PaymentPolicyModal from "../components/PaymentPolicyModal";

function IconArrowLeft(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M19 12H5" />
      <path d="M12 19l-7-7 7-7" />
    </svg>
  );
}

function IconCheck(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function IconLightning(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function IconBank(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="10" width="20" height="11" rx="2" />
      <path d="M6 6v4M10 6v4M14 6v4M18 6v4M2 6h20M12 2L2 6h20z" />
    </svg>
  );
}

function PayoutPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [hasPayout, setHasPayout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [currentPayout, setCurrentPayout] = useState(null);
  const [showPolicyModal, setShowPolicyModal] = useState(
    !localStorage.getItem("paymentPolicyAckTeacher")
  );

  const [formData, setFormData] = useState({
    upiId: "",
    accountHolderName: "",
    accountNumber: "",
    ifscCode: "",
  });

  useEffect(() => {
    fetchPayoutDetails();
  }, []);

  const fetchPayoutDetails = async () => {
    setFetching(true);
    try {
      const res = await api.get("/payout");
      if (res.data && typeof res.data === "object") {
        setCurrentPayout(res.data);
        setHasPayout(true);
        
        // Auto-detect saved mode preference and prepopulate drafts
        if (res.data.upiId) {
          setPaymentMethod("UPI");
          setFormData((prev) => ({ ...prev, upiId: res.data.upiId }));
        } else {
          setPaymentMethod("BANK");
          setFormData((prev) => ({
            ...prev,
            accountHolderName: res.data.accountHolderName || "",
            accountNumber: res.data.accountNumber || "",
            ifscCode: res.data.ifscCode || "",
          }));
        }
      }
    } catch (err) {
      setHasPayout(false);
      setCurrentPayout(null);
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload =
        paymentMethod === "UPI"
          ? { upiId: formData.upiId }
          : {
              accountHolderName: formData.accountHolderName,
              accountNumber: formData.accountNumber,
              ifscCode: formData.ifscCode,
            };

      if (hasPayout) {
        await api.put("/payout", payload);
      } else {
        await api.post("/payout", payload);
      }

      alert(
        hasPayout
          ? "Payment details updated successfully."
          : "Payment details saved successfully."
      );
      fetchPayoutDetails(); // Refresh current display states
    } catch (err) {
      alert("Unable to save payment details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-slate-950 dark:bg-slate-950 dark:text-white selection:bg-indigo-600 selection:text-white antialiased relative overflow-hidden">
      
      {/* Ambient background */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-200/40 dark:bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-emerald-100/40 dark:bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative mx-auto flex max-w-5xl flex-col lg:flex-row items-stretch gap-12 px-6 py-16 sm:px-8 sm:py-24">
        
        {/* Left side panel */}
        <div className="flex flex-col justify-between lg:w-[40%] py-2">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 dark:border-white/10 dark:bg-white/5 backdrop-blur-sm px-3 py-1 text-xs font-semibold tracking-wide text-indigo-600 dark:text-indigo-400">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-pulse" />
              Payout Details
            </div>

            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white leading-[1.15]">
              {hasPayout
                ? "Review or change payout targets."
                : "Set up where payments reach you."}
            </h1>

            <p className="mt-4 text-[15px] font-medium leading-relaxed text-slate-600 dark:text-slate-300">
              Payments happen directly between you and your students. Add
              accurate details so they can send payments to the right
              place, every time.
            </p>
          </div>

          {/* Feature list */}
          <div className="mt-12 border-t-2 border-slate-200 pt-8 dark:border-white/5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
              How this works
            </h3>
            <ul className="mt-5 space-y-4">
              <li className="flex items-start gap-3 text-sm font-medium text-slate-700 dark:text-slate-200">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-emerald-500 text-white dark:bg-emerald-500/20 dark:text-emerald-400 mt-0.5">
                  <IconCheck className="h-3 w-3" />
                </span>
                <span>Payments go directly from student to you — no platform hold.</span>
              </li>
              <li className="flex items-start gap-3 text-sm font-medium text-slate-700 dark:text-slate-200">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-emerald-500 text-white dark:bg-emerald-500/20 dark:text-emerald-400 mt-0.5">
                  <IconCheck className="h-3 w-3" />
                </span>
                <span>Works with UPI or a regular bank account, whichever you prefer.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right side: Active details and form update modules */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="mb-4 self-start">
            <Link
              to="/teacher"
              className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors duration-200"
            >
              <IconArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
              Dashboard
            </Link>
          </div>

          {/* DISPLAY LIVE CURRENT ASSIGNED ACTIVE PAYOUT VARIABLE NODE IF FOUND */}
          {hasPayout && currentPayout && !fetching && (
            <div className="mb-6 rounded-2xl border-2 border-emerald-500/30 bg-emerald-500/[0.02] p-5 backdrop-blur-sm">
              <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                Active Destination Node Linked
              </p>
              <div className="mt-3 text-sm space-y-1.5 text-slate-700 dark:text-slate-300">
                {currentPayout.upiId ? (
                  <p className="font-semibold">
                    UPI: <span className="font-mono text-slate-950 dark:text-white bg-slate-100 dark:bg-white/10 px-1.5 py-0.5 rounded text-xs">{currentPayout.upiId}</span>
                  </p>
                ) : (
                  <div className="grid gap-1 grid-cols-1 sm:grid-cols-2 text-xs">
                    <p><span className="text-slate-400 font-bold uppercase">Holder:</span> {currentPayout.accountHolderName}</p>
                    <p><span className="text-slate-400 font-bold uppercase">Account:</span> {currentPayout.accountNumber}</p>
                    <p className="sm:col-span-2"><span className="text-slate-400 font-bold uppercase">IFSC Code:</span> <span className="font-mono bg-slate-100 dark:bg-white/10 px-1.5 py-0.5 rounded">{currentPayout.ifscCode}</span></p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_24px_48px_-16px_rgba(15,23,42,0.12)] dark:border-white/10 dark:bg-white/[0.04] dark:shadow-none sm:p-10 transition-all">
            <h2 className="text-xl font-bold tracking-tight text-slate-950 dark:text-white">
              {hasPayout ? "Modify configurations" : "Add your payment details"}
            </h2>
            <p className="mt-1 text-[13.5px] font-medium text-slate-500 dark:text-slate-400">
              Double check these before saving — students will pay directly to whatever you enter here.
            </p>

            <form onSubmit={handleSubmit} className="mt-8">
              
              {/* Segment selector */}
              <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1.5 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("UPI")}
                  className={`flex items-center justify-center gap-2.5 rounded-lg py-3 text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                    paymentMethod === "UPI"
                      ? "bg-slate-950 text-white shadow-md dark:bg-white dark:text-slate-950 scale-[1.01]"
                      : "text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
                  }`}
                >
                  <IconLightning className="h-4 w-4" />
                  UPI
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("BANK")}
                  className={`flex items-center justify-center gap-2.5 rounded-lg py-3 text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                    paymentMethod === "BANK"
                      ? "bg-slate-950 text-white shadow-md dark:bg-white dark:text-slate-950 scale-[1.01]"
                      : "text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
                  }`}
                >
                  <IconBank className="h-4 w-4" />
                  Bank Account
                </button>
              </div>

              {/* Form fields */}
              {paymentMethod === "UPI" ? (
                <div className="mt-6">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-300">
                    UPI ID
                  </label>
                  <input
                    name="upiId"
                    type="text"
                    required
                    value={formData.upiId}
                    onChange={handleChange}
                    placeholder="username@bankhandle"
                    className="mt-2 w-full rounded-xl border-2 border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-950 placeholder:text-slate-400 outline-none transition duration-200 focus:border-slate-950 focus:bg-white focus:ring-4 focus:ring-slate-950/5 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-white dark:focus:bg-slate-900/40 dark:focus:ring-white/5"
                  />
                </div>
              ) : (
                <div className="mt-6 space-y-5">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-300">
                      Account Holder Name
                    </label>
                    <input
                      name="accountHolderName"
                      type="text"
                      required
                      value={formData.accountHolderName}
                      onChange={handleChange}
                      placeholder="Enter name exactly as on your bank account"
                      className="mt-2 w-full rounded-xl border-2 border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-950 placeholder:text-slate-400 outline-none transition duration-200 focus:border-slate-950 focus:bg-white focus:ring-4 focus:ring-slate-950/5 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-white dark:focus:bg-slate-900/40 dark:focus:ring-white/5"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-300">
                        Account Number
                      </label>
                      <input
                        name="accountNumber"
                        type="text"
                        required
                        value={formData.accountNumber}
                        onChange={handleChange}
                        placeholder="0000 0000 0000"
                        className="mt-2 w-full rounded-xl border-2 border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-950 placeholder:text-slate-400 outline-none transition duration-200 focus:border-slate-950 focus:bg-white focus:ring-4 focus:ring-slate-950/5 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-white dark:focus:bg-slate-900/40 dark:focus:ring-white/5"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-300">
                        IFSC Code
                      </label>
                      <input
                        name="ifscCode"
                        type="text"
                        required
                        value={formData.ifscCode}
                        onChange={handleChange}
                        placeholder="SBIN0001234"
                        className="mt-2 w-full rounded-xl border-2 border-slate-200 bg-slate-50 p-4 text-sm font-bold tracking-wider uppercase text-slate-950 placeholder:text-slate-400 outline-none transition duration-200 focus:border-slate-950 focus:bg-white focus:ring-4 focus:ring-slate-950/5 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-white dark:focus:bg-slate-900/40 dark:focus:ring-white/5"
                      />
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || fetching}
                className="mt-8 w-full rounded-xl bg-indigo-600 py-4 text-xs font-bold uppercase tracking-widest text-white transition-all duration-300 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/20 active:scale-[0.99] disabled:bg-slate-200 disabled:text-slate-400 dark:disabled:bg-slate-800 dark:disabled:text-slate-600"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-3">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Saving…
                  </span>
                ) : hasPayout ? (
                  "Update Payment Details"
                ) : (
                  "Save Payment Details"
                )}
              </button>

            </form>
          </div>
        </div>

      </div>

      {showPolicyModal && (
        <PaymentPolicyModal
          onAcknowledge={() => {
            localStorage.setItem("paymentPolicyAckTeacher", "true");
            setShowPolicyModal(false);
          }}
        />
      )}
    </div>
  );
}

export default PayoutPage;