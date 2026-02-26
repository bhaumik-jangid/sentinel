"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Network, Cloud, ClipboardList } from "lucide-react";

const capabilities = [
  { title: "Q&A Knowledge Sharing", description: "Ask questions, get answers, and share expertise in a moderated, respectful community.", icon: ShieldCheck },
  { title: "Image & Visual Posts", description: "Post images and visual content to engage, inspire, and connect with others.", icon: Network },
  { title: "Strict Moderation", description: "Automated and community-driven moderation keeps the platform safe and free from adult or harmful content.", icon: Cloud },
  { title: "Privacy & Security", description: "Your data and privacy are protected with robust controls and transparent policies.", icon: ClipboardList },
];

export default function CoreExpertise() {
  return (
    <section id="core-expertise" className="bg-gray-50 dark:bg-[#0F1117] py-28">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-2xl mb-16">
          <p className="text-sm font-semibold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest mb-4">Platform Features</p>
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-gray-950 dark:text-[#E2E8F0] leading-tight">
            Social Q&A & Visual Sharing<br />Moderated for Safety
          </h2>
          <p className="mt-6 text-lg text-gray-500 dark:text-slate-400 leading-relaxed">
            Discover, ask, and share in a platform that blends Quora and Instagram, with strict moderation and privacy-first design.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {capabilities.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                // ✅ staggered entrance
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                // ✅ smooth lift on hover
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group flex items-start gap-5 p-6 rounded-2xl bg-white dark:bg-[#1A1D27] border border-gray-100 dark:border-[#2A2D3E] hover:border-indigo-200 dark:hover:border-indigo-800/60 hover:shadow-md dark:hover:shadow-indigo-950/40 transition-all duration-300 cursor-default"
              >
                {/* ✅ icon bg glows on hover */}
                <div className="shrink-0 p-2.5 rounded-xl bg-gray-50 dark:bg-[#1E2130] border border-gray-100 dark:border-[#2A2D3E] group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 group-hover:border-indigo-200 dark:group-hover:border-indigo-700 transition-all duration-300">
                  <Icon size={22} strokeWidth={1.6} className="text-gray-700 dark:text-indigo-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors duration-300" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-950 dark:text-[#E2E8F0] mb-1.5 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors duration-300">{item.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}