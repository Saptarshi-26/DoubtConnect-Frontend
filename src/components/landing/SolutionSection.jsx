import { motion } from "framer-motion";
import { Search, CalendarDays, Video } from "lucide-react";

function SolutionSection() {
  const cards = [
    {
      icon: <Search size={26} />,
      title: "Find the right teacher",
      text: "Search for teachers based on the subject you need help with.",
      tint: "from-indigo-500 to-blue-600",
    },
    {
      icon: <CalendarDays size={26} />,
      title: "Request & book a session",
      text: "Choose an available time that works for both you and your teacher.",
      tint: "from-violet-500 to-purple-600",
    },
    {
      icon: <Video size={26} />,
      title: "Learn without waiting",
      text: "Join your session through Google Meet and continue learning while the idea is still fresh.",
      tint: "from-teal-500 to-emerald-600",
    },
  ];

  return (
    <section className="bg-[#FAFAF9] py-32 text-slate-900 dark:bg-slate-950 dark:text-white sm:py-40">

      <div className="mx-auto max-w-6xl px-6 sm:px-8">

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center text-4xl font-bold tracking-tight sm:text-5xl"
        >
          So, what is DoubtConnect?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="mx-auto mt-6 max-w-3xl text-center text-lg leading-8 text-slate-500 dark:text-slate-400 sm:text-xl"
        >
          A platform that helps students connect with teachers when learning
          can't wait.
        </motion.p>

        <div className="mt-16 grid gap-6 md:grid-cols-3 sm:mt-20">

          {cards.map((card, idx) => (

            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -6 }}
              className="rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition-shadow duration-300 hover:shadow-[0_16px_40px_-12px_rgba(15,23,42,0.12)] dark:border-white/10 dark:bg-white/[0.04] dark:hover:shadow-[0_16px_40px_-12px_rgba(0,0,0,0.4)]"
            >

              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${card.tint} text-white shadow-lg`}
              >
                {card.icon}
              </div>

              <h3 className="mt-6 text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                {card.title}
              </h3>

              <p className="mt-3 leading-7 text-slate-500 dark:text-slate-400">
                {card.text}
              </p>

            </motion.div>

          ))}

        </div>

      </div>

    </section>
  );
}

export default SolutionSection;