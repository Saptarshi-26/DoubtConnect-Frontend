import { Link } from "react-router-dom";

function IconArrowLeft(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M19 12H5" />
      <path d="M12 19l-7-7 7-7" />
    </svg>
  );
}

function IconCheck(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function IconX(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M18 6 6 18" />
      <path d="M6 6l12 12" />
    </svg>
  );
}

function Section({ index, title, children }) {
  return (
    <div className="group mt-12 first:mt-0 scroll-mt-24 border-b border-slate-100 pb-10 last:border-none dark:border-slate-900" id={title.toLowerCase().replace(/\s+/g, "-")}>
      <div className="flex items-center gap-4">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-slate-100 text-xs font-mono font-bold text-slate-500 transition-colors group-hover:bg-indigo-50 group-hover:text-indigo-600 dark:bg-slate-900 dark:text-slate-400 dark:group-hover:bg-indigo-500/10 dark:group-hover:text-indigo-400">
          {index.padStart(2, '0')}
        </span>
        <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          {title}
        </h2>
      </div>
      <div className="mt-4 pl-11 text-[15px] leading-relaxed text-slate-600 dark:text-slate-400 antialiased selection:bg-indigo-50 dark:selection:bg-indigo-500/20">
        {children}
      </div>
    </div>
  );
}

function List({ items }) {
  return (
    <ul className="mt-4 space-y-3">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 text-[14.5px]">
          <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-indigo-500 dark:bg-indigo-400" />
          <span className="text-slate-600 dark:text-slate-400">{item}</span>
        </li>
      ))}
    </ul>
  );
}

function DoDontList({ items, variant }) {
  const isDo = variant === "do";
  return (
    <ul className="mt-4 space-y-3">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 text-[14.5px]">
          <span
            className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
              isDo
                ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                : "bg-rose-50 text-rose-500 dark:bg-rose-500/10 dark:text-rose-400"
            }`}
          >
            {isDo ? (
              <IconCheck className="h-2.5 w-2.5" />
            ) : (
              <IconX className="h-2.5 w-2.5" />
            )}
          </span>
          <span className="text-slate-600 dark:text-slate-400">{item}</span>
        </li>
      ))}
    </ul>
  );
}

function PaymentPolicyPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-[#030712] dark:text-slate-50 selection:bg-indigo-50 dark:selection:bg-indigo-500/20">
      
      {/* Structural Minimalist Header Backdrop */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(244,244,245,0.4),transparent_400px)] dark:bg-[linear-gradient(to_bottom,rgba(17,24,39,0.2),transparent_600px)] pointer-events-none" />
      
      <div className="relative mx-auto max-w-2xl px-6 py-16 sm:px-8 sm:py-24">
        
        {/* Navigation Action */}
        <Link
          to="/"
          className="group inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-slate-400 transition-colors duration-200 hover:text-indigo-600 dark:text-slate-500 dark:hover:text-indigo-400"
        >
          <IconArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
          Back to Overview
        </Link>

        {/* Hero Meta Section */}
        <div className="mt-10 border-b border-slate-100 pb-10 dark:border-slate-900">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/60 bg-slate-50/50 px-2.5 py-0.5 text-[11px] font-medium tracking-medium text-slate-500 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-400">
            <span>Platform Guidelines</span>
          </div>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl font-sans">
            Payment Policy
          </h1>

          <p className="mt-4 text-[15px] leading-relaxed text-slate-500 dark:text-slate-400 antialiased">
            DoubtConnect behaves strictly as a discovery and session scheduling infrastructure. 
            We do not process, middleman, or store transactions between users.
          </p>
          
          <div className="mt-6 rounded-xl border border-indigo-100/80 bg-indigo-50/20 p-4 dark:border-indigo-500/10 dark:bg-indigo-500/[0.02]">
            <p className="text-[14px] leading-relaxed text-indigo-950 dark:text-indigo-300">
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">Direct Transaction Policy:</span> Payments happen completely peer-to-peer. Please evaluate credentials and payment details cleanly before dispatching funds.
            </p>
          </div>
        </div>

        {/* Core Policy Content Blocks */}
        <div className="mt-10">
          <Section index="1" title="How Payments Work">
            <p>
              DoubtConnect is a scheduling and tutoring platform, not a
              payment processor. After a tutoring session reaches the
              appropriate stage, the platform securely shares the teacher's
              payment details (UPI ID or bank account information) with the
              student, so the payment can be made directly from the student
              to the teacher.
            </p>
            <p className="mt-4 text-xs font-mono tracking-wide uppercase text-slate-400 dark:text-slate-500">
              Notice: No transactional funds flow through platform servers.
            </p>
          </Section>

          <Section index="2" title="Why We Use Direct Payments">
            <p>
              Our goal is to simplify tutor discovery, scheduling, session
              management, and communication. At this stage, DoubtConnect
              does not operate as a payment gateway or escrow service.
              Direct payments allow students and teachers to complete
              transactions without the platform handling funds.
            </p>
            <p className="mt-3">
              Future versions of the platform may include integrated
              payment processing and additional buyer/seller protection workflows.
            </p>
          </Section>

          <Section index="3" title="Payment Responsibility Matrix">
            <p>
              The payment transaction environment exists strictly binding the specific student and teacher involved.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-100 bg-slate-50/30 p-5 dark:border-slate-900 dark:bg-slate-950/20">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  Platform Scope
                </p>
                <DoDontList
                  variant="do"
                  items={[
                    "Session orchestration",
                    "Automated booking architecture",
                    "Google Meet channel synthesis",
                    "E2E secure details transfer",
                  ]}
                />
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50/30 p-5 dark:border-slate-900 dark:bg-slate-950/20">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  Exclusions
                </p>
                <DoDontList
                  variant="dont"
                  items={[
                    "Payment collection gateways",
                    "Escrow custody holding",
                    "Transaction mediation",
                    "Financial dispute settlement",
                  ]}
                />
              </div>
            </div>
          </Section>

          <Section index="4" title="User Protocol">
            <p className="font-semibold text-slate-800 dark:text-slate-300">
              Student Obligations:
            </p>
            <List
              items={[
                "Verify provider identity indicators prior to payment.",
                "Cross-check target UPI/Bank details directly with expectations.",
                "Process transactions exclusively following validation parameters.",
              ]}
            />
            <p className="mt-6 font-semibold text-slate-800 dark:text-slate-300">
              Educator Obligations:
            </p>
            <List
              items={[
                "Supply accurate, active billing indicators.",
                "Fulfill course sessions following premium criteria.",
                "Keep account payment routes structurally up to date.",
              ]}
            />
          </Section>

          <Section index="5" title="Disputes & Resolutions">
            <p>Because payment occurs immediately across peer routes, the platform handles no variables regarding:</p>
            <List
              items={[
                "Refund mechanics",
                "Bank gateway dropouts or timing faults",
                "Erroneous asset distributions",
                "UPI validation discrepancies",
              ]}
            />
            <p className="mt-4 text-slate-500 dark:text-slate-400">
              All listed transactional discrepancies must navigate settlement mechanisms explicitly operated directly between the respective student and educator.
            </p>
          </Section>

          <Section index="6" title="Data Security Guardrails">
            <p>To help ensure operational integrity and protect identity metrics:</p>
            <List
              items={[
                "Payment routes remain isolated inside encrypted records.",
                "Billing coordinates are only visible strictly within active matchmaking windows.",
                "No private system identifiers are exposed to public indexing vectors.",
              ]}
            />
          </Section>

          <Section index="7" title="Upcoming Architectural Scope">
            <p>
              DoubtConnect plans to deploy unified ledger additions in subsequent version updates, consisting of:
            </p>
            <List
              items={[
                "In-app processing modules",
                "Automated protocol escrow parameters",
                "Integrated refund routing layers",
              ]}
            />
            <p className="mt-4 text-xs text-slate-400 dark:text-slate-500">
              * Note: Mentioned modules represent active development roadmaps and do not establish features within current operational iterations.
            </p>
          </Section>
        </div>

      </div>
    </div>
  );
}

export default PaymentPolicyPage;