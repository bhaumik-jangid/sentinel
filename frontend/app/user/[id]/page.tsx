"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import ProfileCard from "@/components/ProfileCard";
import PostCard from "@/components/PostCard";

const API_BASE = "http://localhost:5000/api";

export default function UserProfilePage() {
  const { id } = useParams();
  const [user, setUser]   = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ read token once for passing to PostCard (view-only, no auth needed for fetch)
  const token = useMemo(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  }, []);

  const currentUser = useMemo(() => {
    if (typeof window === "undefined") return null;
    const s = localStorage.getItem("user");
    return s ? JSON.parse(s) : null;
  }, []);

  useEffect(() => {
    if (!id) return;

    Promise.all([
      fetch(`${API_BASE}/users/${id}`).then((r) => r.json()),
      fetch(`${API_BASE}/users/${id}/posts`).then((r) => r.json()),
    ])
      .then(([userData, postsData]) => {
        setUser(userData);
        setPosts(Array.isArray(postsData) ? postsData : []);
      })
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0F1117]">
      <p className="text-gray-400 dark:text-slate-500">Loading profile...</p>
    </div>
  );

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0F1117]">
      <p className="text-gray-500 dark:text-slate-400">User not found</p>
    </div>
  );

  return (
    <section className="min-h-screen bg-gray-50 dark:bg-[#0F1117] px-6 py-20">
      <div className="max-w-4xl mx-auto space-y-16">

        {/* Profile Card */}
        <div className="flex justify-center">
          <ProfileCard user={user} />
        </div>

        {/* Posts */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-[#E2E8F0] mb-8">
            Posts by {user.name}
          </h3>

          {posts.length === 0 && (
            <p className="text-gray-500 dark:text-slate-400">No posts yet.</p>
          )}

          {/* ✅ Reuse PostCard — like/comment work if logged in, owner actions hidden */}
          <div className="space-y-8">
            {posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                currentUser={currentUser}
                token={token}
                onPostUpdate={(updated) =>
                  setPosts((prev) => prev.map((p) => (p._id === updated._id ? updated : p)))
                }
                onPostDelete={(deletedId) =>
                  setPosts((prev) => prev.filter((p) => p._id !== deletedId))
                }
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}