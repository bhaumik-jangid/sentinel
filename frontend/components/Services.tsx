"use client";

import { motion } from "framer-motion";
import { Code, Server, Network, GraduationCap, ShieldCheck, RefreshCcw } from "lucide-react";

const services = [
  { title: "Post & Share", description: "Create posts, ask questions, and share images in a vibrant feed.", icon: Code },
  { title: "Moderation Tools", description: "Automated and community-driven moderation keeps content safe and respectful.", icon: ShieldCheck },
  { title: "Privacy Controls", description: "Manage your privacy, control who sees your posts, and protect your data.", icon: GraduationCap },
  { title: "Community Discovery", description: "Find trending topics, follow users, and join interest-based groups.", icon: Network },
  { title: "Answer & Engage", description: "Answer questions, comment, and engage with the community in a positive way.", icon: Server },
  { title: "Safe Environment", description: "Strict moderation ensures no adult or harmful content is allowed.", icon: RefreshCcw },
];

export default function Services() {
  return (
    <section id="services" className="bg-gray-50 dark:bg-[#0B0D14] py-28">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-2xl mb-16">
          <p className="text-sm font-semibold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest mb-4">Platform Features</p>
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-gray-950 dark:text-[#E2E8F0] leading-tight">
            Social Media Tools<br />for Safe Sharing & Q&A
          </h2>
          <p className="mt-6 text-lg text-gray-500 dark:text-slate-400 leading-relaxed">
            Our platform offers posting, moderation, privacy controls, and community discovery.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group p-6 rounded-2xl border border-gray-100 dark:border-[#2A2D3E] bg-white dark:bg-[#1A1D27] hover:border-indigo-200 dark:hover:border-indigo-800/60 hover:shadow-md dark:hover:shadow-indigo-950/40 transition-all duration-300 cursor-default"
              >
                <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-[#1E2130] border border-gray-100 dark:border-[#2A2D3E] w-fit mb-5 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 group-hover:border-indigo-200 dark:group-hover:border-indigo-700 transition-all duration-300">
                  <Icon size={20} strokeWidth={1.6} className="text-gray-500 dark:text-indigo-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors duration-300" />
                </div>
                <h3 className="text-base font-semibold text-gray-950 dark:text-[#E2E8F0] mb-2 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors duration-300">{service.title}</h3>
                <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed">{service.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}