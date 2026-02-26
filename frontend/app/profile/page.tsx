"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Link from "next/link";
import ProfileCard from "@/components/ProfileCard";
import PostCard from "@/components/PostCard";

const API_BASE = "http://localhost:5000/api";

function timeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  if (seconds < 60) return "just now";
  if (seconds < 3600)  return rtf.format(-Math.floor(seconds / 60),   "minute");
  if (seconds < 86400) return rtf.format(-Math.floor(seconds / 3600),  "hour");
  if (seconds < 604800) return rtf.format(-Math.floor(seconds / 86400), "day");
  return rtf.format(-Math.floor(seconds / 604800), "week");
}

export default function ProfilePage() {
  const [user, setUser]                       = useState<any>(null);
  const [posts, setPosts]                     = useState<any[]>([]);
  const [contactMessages, setContactMessages] = useState<any[]>([]);
  const [loadingPosts, setLoadingPosts]       = useState(true);
  const [showMessages, setShowMessages]       = useState(false);

  const token = useMemo(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) { window.location.href = "/auth/login"; return; }

    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);

    const authHeader = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };

    axios.get(`${API_BASE}/users/${parsedUser.id}/posts`)
      .then((res) => setPosts(Array.isArray(res.data) ? res.data : []))
      .catch(() => setPosts([]))
      .finally(() => setLoadingPosts(false));

    axios.get(`${API_BASE}/contact/mine`, authHeader)
      .then((res) => setContactMessages(Array.isArray(res.data) ? res.data : []))
      .catch(() => setContactMessages([]));
  }, []);

  const handlePostUpdate = (updated: any) =>
    setPosts((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));

  const handlePostDelete = (id: string) =>
    setPosts((prev) => prev.filter((p) => p._id !== id));

  if (!user) return null;

  return (
    <section className="min-h-screen bg-gray-50 dark:bg-[#0F1117] px-6 py-20">
      <div className="max-w-4xl mx-auto space-y-16">

        {/* Profile Card */}
        <div className="flex justify-center">
          <ProfileCard
            user={user}
            isOwnProfile
            onLogout={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              window.location.href = "/";
            }}
          />
        </div>

        {/* Posts */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-[#E2E8F0]">
              Your Posts
            </h3>
            <Link
              href="/create"
              className="px-4 py-2 rounded-xl bg-gray-950 dark:bg-indigo-600 text-white text-sm font-medium hover:bg-gray-800 dark:hover:bg-indigo-700 transition"
            >
              + Create Post
            </Link>
          </div>

          {loadingPosts && <p className="text-gray-400 dark:text-slate-500">Loading posts...</p>}
          {!loadingPosts && posts.length === 0 && (
            <p className="text-gray-500 dark:text-slate-400">You haven't posted anything yet.</p>
          )}

          <div className="space-y-8">
            {posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                currentUser={user}
                token={token}
                onPostUpdate={handlePostUpdate}
                onPostDelete={handlePostDelete}
              />
            ))}
          </div>
        </div>

        {/* Contact Messages */}
        <div className="border-t border-gray-100 dark:border-[#2A2D3E] pt-8">
          <button
            onClick={() => setShowMessages((v) => !v)}
            className="text-sm text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-[#E2E8F0] flex items-center gap-2 transition"
          >
            📨 Your support messages ({contactMessages.length})
            <span>{showMessages ? "▲" : "▼"}</span>
          </button>

          {showMessages && (
            <div className="mt-4 space-y-3">
              {contactMessages.length === 0 && (
                <p className="text-sm text-gray-400 dark:text-slate-500">No messages sent yet.</p>
              )}
              {contactMessages.map((msg: any) => (
                <div
                  key={msg._id}
                  className="rounded-xl border border-gray-100 dark:border-[#2A2D3E] bg-white dark:bg-[#1A1D27] p-4 text-sm"
                >
                  <p className="text-gray-900 dark:text-[#E2E8F0] font-medium">{msg.message}</p>
                  <p className="text-gray-400 dark:text-slate-500 text-xs mt-1">{timeAgo(msg.createdAt)}</p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </section>
  );
}