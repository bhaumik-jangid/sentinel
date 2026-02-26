"use client";

import { motion } from "framer-motion";

const steps = [
  { number: "01", title: "Create & Share", description: "Post questions, share images, and start conversations in a safe, moderated feed." },
  { number: "02", title: "Moderation", description: "Automated and community-driven moderation ensures content stays respectful and safe." },
  { number: "03", title: "Discover & Engage", description: "Find trending topics, follow users, and engage with answers and comments." },
  { number: "04", title: "Grow Community", description: "Build your network, join groups, and contribute to a positive, knowledge-driven platform." },
];

export default function HowWeWork() {
  return (
    <section id="how-we-work" className="bg-white dark:bg-[#0F1117] py-28">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-2xl mb-16">
          <p className="text-sm font-semibold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest mb-4">How It Works</p>
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-gray-950 dark:text-[#E2E8F0] leading-tight">
            Social Media Workflow<br />for Safe Knowledge Sharing
          </h2>
          <p className="mt-6 text-lg text-gray-500 dark:text-slate-400 leading-relaxed">
            Our workflow ensures safe posting, effective moderation, and community engagement.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              // ✅ step cards lift + number accent glows
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="group relative p-6 rounded-2xl border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900/50 hover:bg-gray-50 dark:hover:bg-[#1A1D27] hover:shadow-sm transition-all duration-300 cursor-default"
            >
              <span className="text-[80px] font-semibold leading-none select-none text-gray-100 dark:text-[#1A1D27] group-hover:text-indigo-100 dark:group-hover:text-indigo-950 transition-colors duration-300">
                {step.number}
              </span>
              <h3 className="mt-2 text-base font-semibold text-gray-950 dark:text-[#E2E8F0] group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors duration-300">
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-slate-400 leading-relaxed">{step.description}</p>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 right-0 w-px h-16 bg-gray-100 dark:bg-[#2A2D3E]" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}