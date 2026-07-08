import { Link } from "react-router-dom";

function AboutPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50">
      {/* Ambient background accents */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-gradient-to-br from-indigo-200/40 via-violet-100/30 to-transparent blur-3xl" />
        <div className="absolute top-1/3 -right-40 h-96 w-96 rounded-full bg-gradient-to-bl from-blue-100/40 to-transparent blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-3xl px-6 py-12 sm:px-8 sm:py-16">
        <Link
          to="/"
          className="group inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors duration-200 hover:text-indigo-600"
        >
          <svg
            className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>

        {/* Hero */}
        <div
          className="mt-10 opacity-0"
          style={{ animation: "fadeSlideUp 0.7s ease-out forwards" }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/70 bg-indigo-50/80 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-700">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
            About DoubtConnect
          </div>

          <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Why this platform{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent">
              exists
            </span>
          </h1>

          <p className="mt-6 border-l-2 border-indigo-300 pl-5 text-lg leading-8 text-slate-600">
            DoubtConnect is a platform designed to reduce the waiting time
            students face when trying to clear academic doubts. Instead of
            waiting for the next coaching class or a dedicated
            doubt-clearing session, students can connect with any suitable
            tutor or senior student who is available at that moment. The
            platform also simplifies tutor discovery, scheduling, Google
            Meet integration, and communication, making one-on-one doubt
            solving more accessible and efficient.
          </p>
        </div>

        {/* Sections */}
        <div className="mt-14 space-y-10">
          <Section
            index="01"
            title="Individual doubt solving"
            delay={0.1}
          >
            This is DoubtConnect's strongest value proposition. In coaching
            institutes, one teacher may have 50–200 students. During class,
            common doubts get answered, but students with unique doubts
            often don't get enough time. By the time a doubt-clearing
            session comes around, the student may have forgotten the exact
            confusion, or already moved on. DoubtConnect lets a student get
            help much sooner instead of waiting days.
          </Section>

          <Section
            index="02"
            title={`The "best teacher" isn't always necessary`}
            delay={0.2}
          >
            A student doesn't always need an expert with 20 years of
            experience. Sometimes they just need someone to explain why a
            piece of recursive code isn't working, or walk through one
            integration step. A capable senior student or college student
            can often solve that perfectly. That opens opportunities for
            college students, university seniors, part-time tutors, and
            subject enthusiasts — while giving school students faster
            access to help.
          </Section>

          <Section
            index="03"
            title="Discovery and scheduling"
            delay={0.3}
          >
            Finding tutors today is often fragmented — people search
            through WhatsApp, Telegram, Facebook, Google, or personal
            recommendations, then have to ask "are you free tomorrow?" one
            message at a time. DoubtConnect centralizes teacher profiles,
            reviews, ratings, availability, scheduling, Google Meet, and
            notifications, making the whole process smoother for everyone
            involved.
          </Section>
        </div>

        {/* Closing note */}
        <div
          className="relative mt-14 overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 opacity-0 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_12px_24px_-8px_rgba(15,23,42,0.06)] sm:p-9"
          style={{ animation: "fadeSlideUp 0.7s ease-out 0.4s forwards" }}
        >
          <svg
            className="absolute -top-2 -left-1 h-16 w-16 text-indigo-50"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M9.5 3C6 3 3 6.5 3 10.5S6 18 9.5 18c.4 0 .7-.3.7-.7 0-.3-.2-.6-.5-.7-2.3-.7-3.7-2.9-3.7-6.1 0-2.3 1.3-4.2 3.1-4.9.3-.1.5-.4.5-.7 0-.5-.4-.9-.9-.9zm10 0c-3.5 0-6.5 3.5-6.5 7.5S16 18 19.5 18c.4 0 .7-.3.7-.7 0-.3-.2-.6-.5-.7-2.3-.7-3.7-2.9-3.7-6.1 0-2.3 1.3-4.2 3.1-4.9.3-.1.5-.4.5-.7 0-.5-.4-.9-.9-.9z" />
          </svg>
          <p className="relative text-lg leading-8 text-slate-700">
            The technology behind DoubtConnect — secure authentication,
            scheduling, Google Meet integration, notifications — exists to
            support this idea. But the problem being solved is what makes
            the platform worth building: getting students the help they
            need, when they actually need it.
          </p>
          <div className="relative mt-5 h-px w-full bg-gradient-to-r from-indigo-200 via-slate-200 to-transparent" />
          <p className="relative mt-4 text-sm font-medium text-slate-400">
            — The DoubtConnect team
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeSlideUp {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

function Section({ index, title, delay, children }) {
  return (
    <div
      className="group relative flex gap-5 opacity-0"
      style={{ animation: `fadeSlideUp 0.7s ease-out ${delay}s forwards` }}
    >
      <div className="flex flex-col items-center">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-sm font-bold text-indigo-600 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_16px_-6px_rgba(79,70,229,0.15)] ring-1 ring-slate-200 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-[0_4px_12px_-2px_rgba(79,70,229,0.3)] group-hover:ring-indigo-200">
          {index}
        </span>
        <span className="mt-2 w-px flex-1 bg-gradient-to-b from-slate-200 to-transparent" />
      </div>

      <div className="pb-2">
        <h2 className="text-xl font-bold tracking-tight text-slate-900">
          {title}
        </h2>
        <p className="mt-3 leading-7 text-slate-600">{children}</p>
      </div>
    </div>
  );
}

export default AboutPage;