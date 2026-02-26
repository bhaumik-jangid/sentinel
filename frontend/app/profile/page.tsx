"use client";

import { useEffect, useMemo, useState } from "react";
import ProfileCard from "@/components/ProfileCard";
import PostCard from "@/components/PostCard";

const API_BASE = "http://localhost:5000/api";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const token = useMemo(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      window.location.href = "/auth/login";
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);

    fetch(`${API_BASE}/users/${parsedUser.id}/posts`)
      .then((res) => res.json())
      .then((data) => {
        setPosts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setPosts([]);
        setLoading(false);
      });
  }, []);

  // ✅ Shared PostCard handlers
  const handlePostUpdate = (updatedPost: any) => {
    setPosts((prev) =>
      prev.map((p) => (p._id === updatedPost._id ? updatedPost : p))
    );
  };

  const handlePostDelete = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p._id !== postId));
  };

  if (!user) return null;

  return (
    <section className="min-h-screen bg-gray-50 px-6 py-20">
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

        {/* Own Posts */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-8">
            Your Posts
          </h3>

          {loading && (
            <p className="text-gray-400">Loading posts...</p>
          )}

          {!loading && posts.length === 0 && (
            <p className="text-gray-500">You haven't posted anything yet.</p>
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

      </div>
    </section>
  );
}