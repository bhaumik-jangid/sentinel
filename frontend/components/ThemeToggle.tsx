"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="w-9 h-9 rounded-xl border border-gray-200 dark:border-[#2A2D3E]" />;

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="p-2 rounded-xl border border-gray-200 dark:border-[#2A2D3E] text-gray-600 dark:text-indigo-400 hover:bg-gray-100 dark:hover:bg-[#1A1D27] transition"
      title={resolvedTheme === "dark" ? "Switch to light" : "Switch to dark"}
    >
      {resolvedTheme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}