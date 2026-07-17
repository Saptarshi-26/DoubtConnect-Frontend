import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#FAFAF9] text-slate-900 dark:bg-slate-950 dark:text-white">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-indigo-200/40 blur-[110px] dark:bg-indigo-600/20" />
        <div className="absolute top-1/3 right-[8%] h-80 w-80 rounded-full bg-blue-100/50 blur-[100px] dark:bg-blue-500/10" />
        <div
          className="absolute inset-0 opacity-[0.4] dark:opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
            backgroundSize: "32px 32px",
            color: "rgb(15 23 42 / 0.06)",
          }}
        />
      </div>

      <div className="relative mx-auto flex max-w-7xl flex-col px-4 sm:px-6 lg:px-8">

        <nav className="flex items-center justify-between gap-2 py-5 sm:py-7">

          <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
            DoubtConnect
          </h1>

          <div className="flex items-center gap-0.5 sm:gap-2">

            <Link
              to="/about"
              className="hidden rounded-xl px-3 py-2 text-sm font-medium text-slate-500 transition-colors duration-200 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white sm:inline-block sm:px-4 sm:py-2.5"
            >
              About
            </Link>

            <Link
              to="/login"
              className="rounded-xl px-2.5 py-2 text-xs font-medium text-slate-500 transition-colors duration-200 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white sm:px-4 sm:py-2.5 sm:text-sm"
            >
              Login
            </Link>

            <Link
              to="/signup"
              className="whitespace-nowrap rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white shadow-[0_4px_16px_-4px_rgba(15,23,42,0.3)] transition-all duration-200 hover:bg-indigo-600 hover:shadow-[0_6px_20px_-4px_rgba(79,70,229,0.4)] dark:bg-white dark:text-slate-900 dark:hover:bg-indigo-500 dark:hover:text-white sm:px-5 sm:py-2.5 sm:text-sm"
            >
              Sign Up
            </Link>

          </div>

        </nav>

        <div className="flex min-h-[82vh] flex-col items-center justify-center px-2 text-center">

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-indigo-200/70 bg-indigo-50/80 px-4 py-1.5 text-xs font-medium text-indigo-700 dark:border-indigo-400/20 dark:bg-indigo-500/10 dark:text-indigo-300 sm:text-sm"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
            Sometimes learning stops...
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-8 text-3xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white sm:text-5xl sm:leading-tight lg:text-6xl"
          >
            ...not because the lesson
            <br />
            <span className="bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent dark:from-indigo-400 dark:to-violet-400">
              was difficult.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-8 max-w-2xl text-base leading-7 text-slate-500 dark:text-slate-400 sm:mt-10 sm:text-xl sm:leading-9"
          >
            Sometimes all it takes is one unanswered doubt.
            By the next class, the context fades,
            confidence drops, and learning slows down.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <Link
              to="/signup"
              className="mt-10 inline-block rounded-xl bg-slate-900 px-7 py-3.5 font-semibold text-white shadow-[0_8px_24px_-6px_rgba(15,23,42,0.35)] transition-all duration-200 hover:bg-indigo-600 hover:shadow-[0_10px_30px_-6px_rgba(79,70,229,0.45)] dark:bg-white dark:text-slate-900 dark:hover:bg-indigo-500 dark:hover:text-white sm:mt-12 sm:px-8 sm:py-4"
            >
              Get Started
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="mt-16 animate-bounce text-sm font-medium text-slate-400 dark:text-slate-500 sm:mt-20"
          >
            ↓ Scroll to discover
          </motion.p>

        </div>

      </div>

    </section>
  );
}

export default Hero;