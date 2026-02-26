"use client";

import { Linkedin, Mail, Phone, MapPin, Instagram, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-950 dark:bg-[#080A10] text-gray-400 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 pb-14 border-b border-gray-800/60 dark:border-[#1A1D27]">

          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="text-white dark:text-indigo-400 text-base font-bold mb-4">Sentinel</h3>
            <p className="text-sm leading-relaxed text-gray-500 dark:text-slate-500">
              A safe, moderated social media platform for knowledge sharing and visual posts.
            </p>
            <div className="flex gap-3 mt-5">
              {[Linkedin, Instagram, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="p-2 rounded-xl border border-gray-800 dark:border-[#2A2D3E] text-gray-500 dark:text-slate-500 hover:text-indigo-400 dark:hover:text-indigo-400 hover:border-indigo-800 dark:hover:border-indigo-700 transition-colors duration-200">
                  <Icon size={16} strokeWidth={1.6} />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4">Services</h4>
            <ul className="space-y-2.5 text-sm text-gray-500 dark:text-slate-500">
              {["Q&A Posting", "Image Sharing", "Community Moderation", "Privacy Controls", "Trending Topics"].map((s) => (
                <li key={s} className="hover:text-indigo-400 dark:hover:text-indigo-400 cursor-pointer transition">{s}</li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4">Company</h4>
            <ul className="space-y-2.5 text-sm text-gray-500 dark:text-slate-500">
              {["About", "How It Works", "Careers", "Contact"].map((s) => (
                <li key={s} className="hover:text-indigo-400 dark:hover:text-indigo-400 cursor-pointer transition">{s}</li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4">Get in Touch</h4>
            <ul className="space-y-3 text-sm text-gray-500 dark:text-slate-500">
              <li className="flex items-start gap-2.5"><MapPin size={14} strokeWidth={1.6} className="mt-0.5 shrink-0 text-indigo-400" />Chennai, India</li>
              <li className="flex items-center gap-2.5"><Phone size={14} strokeWidth={1.6} className="shrink-0 text-indigo-400" />+91 76039 99796</li>
              <li className="flex items-center gap-2.5"><Mail size={14} strokeWidth={1.6} className="shrink-0 text-indigo-400" />info@Sentinel.com</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-600 dark:text-slate-600">
          <p>© {new Date().getFullYear()} Sentinel. All rights reserved.</p>
          <div className="flex gap-6 mt-3 md:mt-0">
            <span className="hover:text-indigo-400 cursor-pointer transition">Privacy Policy</span>
            <span className="hover:text-indigo-400 cursor-pointer transition">Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
}