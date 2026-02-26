"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // ← App Router
// If using Pages Router: import { useRouter } from "next/router";

interface PostFormProps {
  mode: "create" | "edit";
  postId?: string;
}

export default function PostForm({ mode, postId }: PostFormProps) {
  const router = useRouter();
  const [form, setForm] = useState({ title: "", content: "", image: "" });
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [containsVulgarity, setContainsVulgarity] = useState(false);
  const [cleanedData, setCleanedData] = useState<any>(null);
  const [mounted, setMounted] = useState(false); // ← ADD THIS

  // Step 1: wait for client mount before reading localStorage
  useEffect(() => {
    setMounted(true);
  }, []);

  // Step 2: only run auth check AFTER mount
  useEffect(() => {
    if (!mounted) return; // ← GUARD: skip during SSR/hydration

    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/auth/login"); // ← use router, not window.location.href
      return;
    }
    setUser(JSON.parse(storedUser));
  }, [mounted]); // ← depend on mounted, not []

  // Fetch post in edit mode
  useEffect(() => {
    if (mode === "edit" && postId) {
      fetch(`http://localhost:5000/api/posts`)
        .then((res) => res.json())
        .then((data) => {
          const post = data.find((p: any) => p._id === postId);
          if (!post) return;
          setForm({ title: post.title, content: post.content, image: post.image || "" });
        });
    }
  }, [mode, postId]);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const endpoint =
      mode === "create"
        ? "http://localhost:5000/api/posts"
        : `http://localhost:5000/api/posts/${postId}`;

    const method = mode === "create" ? "POST" : "PUT";

    const response = await fetch(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(form),
    });

    const data = await response.json();
    setLoading(false);

    if (data.cleaned) {
      setContainsVulgarity(true);
      setCleanedData(data.post);
      return;
    }

    router.push("/explore"); // ← use router here too
  };

  const applyCleanVersion = () => {
    setForm({
      title: cleanedData.title,
      content: cleanedData.content,
      image: cleanedData.image || "",
    });
    setContainsVulgarity(false);
  };

  // Show nothing until mounted + user is confirmed
  if (!mounted || !user) return null;

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-lg space-y-5"
      >
        <h2 className="text-2xl font-semibold text-gray-900">
          {mode === "create" ? "Create Post" : "Update Post"}
        </h2>

        <input
          name="title"
          placeholder="Post title"
          value={form.title}
          onChange={handleChange}
          required
          className="w-full border p-3 rounded-xl"
        />

        <textarea
          name="content"
          placeholder="Write something..."
          value={form.content}
          onChange={handleChange}
          required
          className="w-full border p-3 rounded-xl"
        />

        <input
          name="image"
          placeholder="Image URL (optional)"
          value={form.image}
          onChange={handleChange}
          className="w-full border p-3 rounded-xl"
        />

        {containsVulgarity && (
          <div className="flex items-center justify-between text-sm bg-gray-100 px-4 py-3 rounded-xl border border-gray-200">
            <span className="text-gray-700">
              Some words violate community guidelines.
            </span>
            <button
              type="button"
              onClick={applyCleanVersion}
              className="text-gray-900 font-medium hover:underline"
            >
              Use cleaner version
            </button>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gray-950 text-white py-3 rounded-xl hover:bg-gray-800 transition disabled:opacity-50"
        >
          {loading
            ? mode === "create" ? "Posting..." : "Updating..."
            : mode === "create" ? "Post" : "Update"}
        </button>
      </form>
    </section>
  );
}