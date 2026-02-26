"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Workflow, Scale, Users } from "lucide-react";

const differentiators = [
  { title: "Safe & Moderated Community", description: "Our platform is strictly moderated to prevent adult and harmful content, ensuring a safe environment for all ages.", icon: ShieldCheck },
  { title: "Quora + Instagram Experience", description: "Enjoy a blend of Q&A and visual sharing. Ask questions, share knowledge, and post images in a vibrant, interactive feed.", icon: Workflow },
  { title: "Community-Driven Moderation", description: "Empowered users and trusted moderators keep the platform clean, respectful, and informative.", icon: Scale },
  { title: "Privacy & Security First", description: "User privacy and data security are core to our platform, with robust controls and transparent policies.", icon: Users },
];

export default function WhyChooseUs() {
  return (
    <section id="why-us" className="bg-white dark:bg-[#0B0D14] py-28">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-2xl mb-16">
          <p className="text-sm font-semibold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest mb-4">Why Choose Us</p>
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-gray-950 dark:text-[#E2E8F0] leading-tight">
            Moderated Social Media<br />for Knowledge & Sharing
          </h2>
          <p className="mt-6 text-lg text-gray-500 dark:text-slate-400 leading-relaxed">
            Our platform combines the best of Quora and Instagram, with strict moderation to keep content safe and community-driven.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          {differentiators.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group p-7 rounded-2xl border border-gray-100 dark:border-[#2A2D3E] bg-gray-50 dark:bg-[#1A1D27] hover:bg-white dark:hover:bg-[#1E2130] hover:border-indigo-200 dark:hover:border-indigo-800/60 hover:shadow-md dark:hover:shadow-indigo-950/40 transition-all duration-300 cursor-default"
              >
                <div className="flex items-start gap-5">
                  <div className="shrink-0 p-2.5 rounded-xl bg-white dark:bg-[#13151F] border border-gray-100 dark:border-[#2A2D3E] group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 group-hover:border-indigo-200 dark:group-hover:border-indigo-700 transition-all duration-300">
                    <Icon size={22} strokeWidth={1.6} className="text-gray-700 dark:text-indigo-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors duration-300" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-950 dark:text-[#E2E8F0] mb-2 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors duration-300">{item.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}