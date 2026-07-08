import { motion } from "framer-motion";

const steps = [
  "Find a teacher",
  "Send a session request",
  "Teacher accepts your request",
  "Choose an available slot",
  "Join instantly through Google Meet",
];

function HowItWorks() {
  return (
    <section className="bg-white py-32 text-slate-900 dark:bg-slate-950 dark:text-white sm:py-40">

      <div className="mx-auto max-w-4xl px-6 sm:px-8">

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center text-4xl font-bold tracking-tight sm:text-5xl"
        >
          How DoubtConnect works
        </motion.h2>

        <div className="mt-20 sm:mt-24">

          {steps.map((step, index) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="flex items-start gap-6 sm:gap-8"
            >

              <div className="flex flex-col items-center">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 font-semibold text-white shadow-[0_4px_14px_-2px_rgba(79,70,229,0.4)] sm:h-14 sm:w-14">
                  {index + 1}
                </div>

                {index !== steps.length - 1 && (
                  <div className="mt-3 h-16 w-px bg-gradient-to-b from-slate-200 to-transparent dark:from-white/15 sm:h-20"></div>
                )}

              </div>

              <div className="pt-2 sm:pt-3">

                <h3 className="text-xl font-semibold tracking-tight text-slate-800 dark:text-slate-100 sm:text-2xl">
                  {step}
                </h3>

              </div>

            </motion.div>
          ))}

        </div>

      </div>

    </section>
  );
}

export default HowItWorks;