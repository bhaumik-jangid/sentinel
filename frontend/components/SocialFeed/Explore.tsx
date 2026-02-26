"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import PostCard from "@/components/PostCard";

const API_BASE = "http://localhost:5000/api";

export default function Explore() {
  const [posts, setPosts]           = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const token = useMemo(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setCurrentUser(JSON.parse(storedUser));
  }, []);

  useEffect(() => {
    fetch(`${API_BASE}/posts`)
      .then((res) => res.json())
      .then((data) => { if (Array.isArray(data)) setPosts(data); })
      .catch((err) => console.error("Error fetching posts:", err));
  }, []);

  const handlePostUpdate = (updatedPost: any) =>
    setPosts((prev) => prev.map((p) => (p._id === updatedPost._id ? updatedPost : p)));

  const handlePostDelete = (postId: string) =>
    setPosts((prev) => prev.filter((p) => p._id !== postId));

  return (
    <section className="min-h-screen bg-gray-50 dark:bg-[#0F1117]">
      <div className="w-full max-w-4xl mx-auto px-6 py-24 space-y-8">

        <div className="flex justify-end">
          <Link
            href="/create"
            className="px-5 py-2 rounded-xl bg-gray-950 dark:bg-indigo-600 text-white text-sm font-medium hover:bg-gray-800 dark:hover:bg-indigo-700 transition"
          >
            + Create Post
          </Link>
        </div>

        {posts.length === 0 && (
          <p className="text-center text-gray-400 dark:text-slate-500 pt-20">
            No posts yet. Be the first to post!
          </p>
        )}

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
    </section>
  );
}