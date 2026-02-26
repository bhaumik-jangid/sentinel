"use client";

import { Mail, Calendar, ShieldCheck, Copy, Check } from "lucide-react";
import { useState } from "react";

interface ProfileCardProps {
  user: {
    id: string;
    name: string;
    email?: string;
    createdAt?: string;
  };
  isOwnProfile?: boolean;
  onLogout?: () => void;
}

export default function ProfileCard({ user, isOwnProfile = false, onLogout }: ProfileCardProps) {
  const [copied, setCopied] = useState(false);

  const initial  = user.name?.charAt(0).toUpperCase();
  const initials = user.name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(user.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-xl overflow-hidden rounded-3xl border border-gray-100 dark:border-[#2A2D3E] bg-white dark:bg-[#1A1D27] shadow-xl">

      {/* ✅ Cover banner */}
      <div className="relative h-32 bg-linear-to-br from-indigo-500 via-indigo-600 to-violet-600 dark:from-indigo-700 dark:via-indigo-800 dark:to-violet-900">
        {/* subtle pattern overlay */}
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }}
        />
      </div>

      <div className="px-8 pb-8">

        {/* ✅ Avatar — overlaps the banner */}
        <div className="relative -mt-12 mb-4 flex items-end justify-between">
          <div className="w-24 h-24 rounded-2xl bg-indigo-600 dark:bg-indigo-700 text-white flex items-center justify-center text-3xl font-bold shadow-lg ring-4 ring-white dark:ring-[#1A1D27]">
            {initials || initial}
          </div>

          {/* ✅ Active badge */}
          <span className="mb-1 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Active
          </span>
        </div>

        {/* ✅ Name + email */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-950 dark:text-[#E2E8F0] leading-tight">
            {user.name}
          </h2>
          {user.email && (
            <div className="flex items-center gap-1.5 mt-1">
              <Mail size={13} className="text-gray-400 dark:text-slate-500" />
              <p className="text-sm text-gray-500 dark:text-slate-400">{user.email}</p>
            </div>
          )}
        </div>

        {/* ✅ Info rows */}
        <div className="space-y-3 mb-8">

          {/* Member since */}
          {user.createdAt && (
            <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#13151F] border border-gray-100 dark:border-[#2A2D3E]">
              <div className="flex items-center gap-2.5 text-sm text-gray-500 dark:text-slate-400">
                <Calendar size={15} className="text-indigo-400" />
                <span>Member Since</span>
              </div>
              <span className="text-sm font-medium text-gray-800 dark:text-slate-200">
                {new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
              </span>
            </div>
          )}

          {/* Account status */}
          <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#13151F] border border-gray-100 dark:border-[#2A2D3E]">
            <div className="flex items-center gap-2.5 text-sm text-gray-500 dark:text-slate-400">
              <ShieldCheck size={15} className="text-indigo-400" />
              <span>Account Status</span>
            </div>
            <span className="text-sm font-medium text-green-600 dark:text-green-400">Verified</span>
          </div>

          {/* User ID with copy */}
          <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#13151F] border border-gray-100 dark:border-[#2A2D3E]">
            <div className="flex items-center gap-2.5 text-sm text-gray-500 dark:text-slate-400">
              <span className="text-indigo-400 font-mono text-xs">#</span>
              <span>User ID</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-gray-500 dark:text-slate-400 truncate max-w-32">
                {user.id.slice(0, 16)}…
              </span>
              <button
                onClick={handleCopy}
                className="text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
                title="Copy full ID"
              >
                {copied ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
              </button>
            </div>
          </div>
        </div>

        {/* ✅ Logout button */}
        {isOwnProfile && (
          <button
            onClick={onLogout}
            className="w-full py-3 rounded-xl bg-gray-950 dark:bg-rose-600/90 text-white text-sm font-semibold hover:bg-gray-800 dark:hover:bg-rose-600 active:scale-[0.98] transition-all duration-200 shadow-sm"
          >
            Sign Out
          </button>
        )}
      </div>
    </div>
  );
}