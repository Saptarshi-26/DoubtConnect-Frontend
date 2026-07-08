import { motion } from "framer-motion";

const lines = [
  "You understand a concept.",
  "Then a question comes to mind.",
  "\"I'll ask in the next class.\"",
  "A few days pass.",
  "The question isn't as clear anymore.",
  "Sometimes exams are just around the corner.",
  "Sometimes one teacher has hundreds of students.",
  "Not every doubt gets answered in time.",
  "It happens more often than it should.",
];

function ProblemSection() {
  return (
    <section className="relative overflow-hidden bg-white py-32 text-slate-900 dark:bg-slate-950 dark:text-white sm:py-40">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-100/70 blur-[120px] dark:bg-white/[0.02]" />

      <div className="relative mx-auto max-w-4xl px-6 text-center sm:px-8">
        {lines.map((line, index) => (
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 0.6 }}
            className="mt-14 text-2xl leading-relaxed text-slate-500 dark:text-slate-300 sm:mt-16 sm:text-3xl"
          >
            {line}
          </motion.p>
        ))}

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-28 text-4xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white sm:mt-32 sm:text-5xl"
        >
          Learning shouldn't have to wait.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mt-8 text-xl text-slate-500 dark:text-slate-400"
        >
          That's where{" "}
          <span className="bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text font-semibold text-transparent dark:from-indigo-400 dark:to-violet-400">
            DoubtConnect
          </span>{" "}
          comes in.
        </motion.p>
      </div>
    </section>
  );
}

export default ProblemSection;