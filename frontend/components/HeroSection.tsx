"use client";

import { useEffect, useState } from "react";

export default function HeroSection() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsLoggedIn(true);
  }, []);

  return (
    <section className="relative flex flex-col items-center justify-center text-center py-32 px-6 bg-white dark:bg-[#0F1117]">
      <p className="text-sm tracking-widest text-indigo-500 dark:text-indigo-400 uppercase font-semibold mb-6">
        Moderated Social Media Platform
      </p>

      <h1 className="text-5xl md:text-7xl font-semibold text-gray-950 dark:text-[#E2E8F0] leading-tight">
        Share. Ask. Connect.
        <br />
        <span className="text-gray-400 dark:text-[#475569]">
          Safe, Community-Driven Content.
        </span>
      </h1>

      <p className="mt-8 text-lg text-gray-500 dark:text-[#64748B] max-w-2xl">
        Welcome to a platform where you can ask questions, share knowledge,
        post images, and connect with others. Strict moderation keeps the
        community safe and respectful.
      </p>

      <div className="mt-10 flex gap-4">
        <a
          href="/explore"
          className="px-7 py-3 rounded-xl bg-gray-950 dark:bg-indigo-600 text-white text-sm font-medium hover:bg-gray-800 dark:hover:bg-indigo-700 shadow-lg dark:shadow-indigo-900/40 transition"
        >
          Explore Feed →
        </a>

        {isLoggedIn ? (
          <a
            href="/profile"
            className="px-7 py-3 rounded-xl border border-gray-200 dark:border-[#2A2D3E] text-gray-700 dark:text-[#94A3B8] text-sm font-medium hover:bg-gray-50 dark:hover:bg-[#1A1D27] transition"
          >
            Your Profile
          </a>
        ) : (
          <a
            href="/auth/register"
            className="px-7 py-3 rounded-xl border border-gray-200 dark:border-[#2A2D3E] text-gray-700 dark:text-[#94A3B8] text-sm font-medium hover:bg-gray-50 dark:hover:bg-[#1A1D27] transition"
          >
            Join Now
          </a>
        )}
      </div>
    </section>
  );
}