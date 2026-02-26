"use client";

import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <>
      <nav className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-full max-w-3xl px-4">
        <div
          className={`flex items-center justify-between rounded-full border transition-all duration-300 ${
            scrolled
              ? "bg-white/70 dark:bg-[#13151F]/90 backdrop-blur-2xl shadow-sm border-gray-200/80 dark:border-[#2A2D3E]/80 py-2.5 px-6"
              : "bg-white/50 dark:bg-[#13151F]/70 backdrop-blur-xl border-gray-200/60 dark:border-[#2A2D3E]/60 py-3 px-7"
          }`}
        >
          {/* Brand */}
          <a href="/" className="text-sm font-bold tracking-tight text-gray-900 dark:text-indigo-400 whitespace-nowrap">
            Sentinel
          </a>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-6">
            <a href="/" className="text-[13px] font-medium text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-indigo-400 transition">
              Home
            </a>
            <a href="/explore" className="text-[13px] font-medium text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-indigo-400 transition">
              Explore
            </a>

            {user ? (
              <>
                <a href="/profile" className="text-[13px] font-medium text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-indigo-400 transition">
                  Hey, {user.name}
                </a>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-xl bg-rose-500 dark:bg-rose-600 text-white text-sm font-medium hover:bg-rose-600 dark:hover:bg-rose-700 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <a
                  href="/auth/login"
                  className="ml-4 px-5 py-2 rounded-xl bg-gray-950 dark:bg-indigo-600 text-white text-sm font-medium hover:bg-gray-800 dark:hover:bg-indigo-700 transition"
                >
                  Login
                </a>
                <a
                  href="/auth/register"
                  className="px-5 py-2 rounded-xl border border-gray-200 dark:border-[#2A2D3E] text-gray-700 dark:text-slate-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-[#1A1D27] transition"
                >
                  Register
                </a>
              </>
            )}
            <ThemeToggle />
          </div>

          {/* Mobile Button */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-1.5 text-gray-600 dark:text-slate-400">
            ☰
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-white/95 dark:bg-[#0F1117]/95 backdrop-blur-xl pt-24 px-8 md:hidden">
          <div className="flex flex-col gap-6 text-gray-800 dark:text-slate-300">
            <a href="/" className="hover:text-indigo-500 dark:hover:text-indigo-400 transition">Home</a>
            <a href="/explore" className="hover:text-indigo-500 dark:hover:text-indigo-400 transition">Explore</a>

            {user ? (
              <>
                <span className="font-medium text-gray-700 dark:text-slate-300">Hey, {user.name}</span>
                <button
                  onClick={handleLogout}
                  className="mt-4 px-5 py-2 rounded-xl bg-rose-500 text-white text-sm font-medium hover:bg-rose-600 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <a href="/auth/login" className="mt-6 px-5 py-2 rounded-xl bg-gray-950 dark:bg-indigo-600 text-white text-sm font-medium hover:bg-gray-800 dark:hover:bg-indigo-700 transition">
                  Login
                </a>
                <a href="/auth/register" className="px-5 py-2 rounded-xl border border-gray-200 dark:border-[#2A2D3E] text-gray-700 dark:text-slate-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-[#1A1D27] transition">
                  Register
                </a>
              </>
            )}
            <ThemeToggle />
          </div>
        </div>
      )}
    </>
  );
}