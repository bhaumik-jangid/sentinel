"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
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

export default function UserProfilePage() {
  const { id } = useParams();

  const [profileUser, setProfileUser]         = useState<any>(null);
  const [posts, setPosts]                     = useState<any[]>([]);
  const [contactMessages, setContactMessages] = useState<any[]>([]);
  const [loadingPosts, setLoadingPosts]       = useState(true);
  const [showMessages, setShowMessages]       = useState(false);
  const [notFound, setNotFound]               = useState(false);

  // ✅ logged-in user from localStorage
  const currentUser = useMemo(() => {
    if (typeof window === "undefined") return null;
    const s = localStorage.getItem("user");
    return s ? JSON.parse(s) : null;
  }, []);

  const token = useMemo(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  }, []);

  // ✅ is this page the logged-in user's own profile?
  const isOwnProfile = !!currentUser && currentUser.id === id;

  useEffect(() => {
    if (!id) return;

    // fetch profile user data + posts in parallel
    Promise.all([
      axios.get(`${API_BASE}/users/${id}`),
      axios.get(`${API_BASE}/users/${id}/posts`),
    ])
      .then(([userRes, postsRes]) => {
        setProfileUser(userRes.data);
        setPosts(Array.isArray(postsRes.data) ? postsRes.data : []);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoadingPosts(false));

    // only fetch contact messages for own profile
    if (isOwnProfile && token) {
      axios
        .get(`${API_BASE}/contact/mine`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setContactMessages(Array.isArray(res.data) ? res.data : []))
        .catch(() => setContactMessages([]));
    }
  }, [id, isOwnProfile, token]);

  const handlePostUpdate = (updated: any) =>
    setPosts((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));

  const handlePostDelete = (deletedId: string) =>
    setPosts((prev) => prev.filter((p) => p._id !== deletedId));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const totalLikes = posts.reduce((sum, p) => sum + (p.likes?.length || 0), 0);

  // ── Loading state ──────────────────────────────────
  if (loadingPosts && !profileUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0F1117]">
        <p className="text-gray-400 dark:text-slate-500 animate-pulse">Loading profile...</p>
      </div>
    );
  }

  // ── Not found ──────────────────────────────────────
  if (notFound || !profileUser) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-[#0F1117] gap-4">
        <p className="text-gray-500 dark:text-slate-400 text-lg">User not found.</p>
        <a href="/" className="text-sm text-indigo-500 hover:underline">← Back to home</a>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 dark:bg-[#0F1117] px-6 py-20">
      <div className="max-w-4xl mx-auto space-y-10">

        {/* ── Profile Card ── */}
        <div className="flex justify-center">
          <ProfileCard
            user={profileUser}
            isOwnProfile={isOwnProfile}
            onLogout={isOwnProfile ? handleLogout : undefined}
          />
        </div>

        {/* ── Stats row — own profile only ── */}
        {isOwnProfile && (
          <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto">
            {[
              { label: "Posts",    value: posts.length },
              { label: "Likes",    value: totalLikes },
              { label: "Messages", value: contactMessages.length },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center justify-center py-4 rounded-2xl bg-white dark:bg-[#1A1D27] border border-gray-100 dark:border-[#2A2D3E] shadow-sm"
              >
                <span className="text-2xl font-bold text-gray-900 dark:text-[#E2E8F0]">{stat.value}</span>
                <span className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">{stat.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* ── Posts section ── */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-[#E2E8F0]">
              {isOwnProfile ? "Your Posts" : `Posts by ${profileUser.name}`}
            </h3>

            {/* Create Post button — own profile only */}
            {isOwnProfile && (
              <Link
                href="/create"
                className="px-4 py-2 rounded-xl bg-gray-950 dark:bg-indigo-600 text-white text-sm font-medium hover:bg-gray-800 dark:hover:bg-indigo-700 active:scale-95 transition-all"
              >
                + Create Post
              </Link>
            )}
          </div>

          {loadingPosts && (
            <p className="text-gray-400 dark:text-slate-500">Loading posts...</p>
          )}
          {!loadingPosts && posts.length === 0 && (
            <p className="text-gray-500 dark:text-slate-400">
              {isOwnProfile ? "You haven't posted anything yet." : "No posts yet."}
            </p>
          )}

          <div className="space-y-8">
            {posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                currentUser={currentUser}
                token={token}
                onPostUpdate={handlePostUpdate}
                onPostDelete={handlePostDelete}
              />
            ))}
          </div>
        </div>

        {/* ── Contact messages — own profile only ── */}
        {isOwnProfile && (
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
        )}

      </div>
    </section>
  );
}