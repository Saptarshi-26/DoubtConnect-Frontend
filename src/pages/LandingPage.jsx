import { Link } from "react-router-dom";
import Hero from "../components/landing/Hero";
import ProblemSection from "../components/landing/ProblemSection";
import SolutionSection from "../components/landing/SolutionSection";
import HowItWorks from "../components/landing/HowItWorks";

function LandingPage() {
  return (
    <>
      <Hero />
      <ProblemSection />
      <SolutionSection />
      <HowItWorks />

      <footer className="relative overflow-hidden border-t border-white/10 bg-slate-950">
        <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[40rem] -translate-x-1/2 rounded-full bg-indigo-600/10 blur-[100px]" />

        <div className="relative mx-auto max-w-7xl px-6 py-14 sm:px-8">
          <div className="flex flex-col gap-10 sm:flex-row sm:justify-between">
            <div className="max-w-xs">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-bold text-white">
                  D
                </div>
                <span className="text-lg font-bold tracking-tight text-white">
                  DoubtConnect
                </span>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-400">
                Connecting students with the right educator, the moment a
                doubt strikes.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-10 sm:gap-16">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Company
                </p>
                <div className="mt-4 flex flex-col gap-3">
                  <Link
                    to="/about"
                    className="text-sm text-slate-400 transition-colors duration-200 hover:text-white"
                  >
                    About
                  </Link>
                  <Link
                    to="/educators"
                    className="text-sm text-slate-400 transition-colors duration-200 hover:text-white"
                  >
                    Find Educators
                  </Link>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Legal
                </p>
                <div className="mt-4 flex flex-col gap-3">
                  <Link
                    to="/payment-policy"
                    className="text-sm text-slate-400 transition-colors duration-200 hover:text-white"
                  >
                    Payment Policy
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} DoubtConnect. All rights reserved.
            </p>
            <p className="text-sm text-slate-500">
              Made for students who don't want to wait.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}

export default LandingPage;