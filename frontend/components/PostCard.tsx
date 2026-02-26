"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const API_BASE = "http://localhost:5000/api";

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const intervals: [number, Intl.RelativeTimeFormatUnit][] = [
    [60, "second"],
    [3600, "minute"],
    [86400, "hour"],
    [604800, "day"],
    [2592000, "week"],
    [31536000, "month"],
    [Infinity, "year"],
  ];

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  if (seconds < 60) return "just now";

  for (let i = 0; i < intervals.length - 1; i++) {
    if (seconds < intervals[i][0]) {
      const prev = i === 0 ? 1 : intervals[i - 1][0];
      const value = Math.floor(seconds / prev);
      return rtf.format(-value, intervals[i][1]);
    }
  }

  return rtf.format(-Math.floor(seconds / 31536000), "year");
}

function getInitials(name: string) {
  if (!name) return "?";
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

interface Comment {
  _id: string;
  userId: string;
  name: string;
  text: string;
  createdAt: string;
}

interface Post {
  _id: string;
  title: string;
  content: string;
  image?: string;
  createdAt: string;
  likes: string[];
  comments: Comment[];
  user: {
    id: string;
    name: string;
  };
}

interface PostCardProps {
  post: Post;
  currentUser: any;
  token: string | null;
  onPostUpdate: (updatedPost: Post) => void;  // called when post changes (like/comment/delete)
  onPostDelete: (postId: string) => void;     // called when post is deleted
}

export default function PostCard({
  post,
  currentUser,
  token,
  onPostUpdate,
  onPostDelete,
}: PostCardProps) {
  const [openMenu, setOpenMenu] = useState(false);
  const [openComments, setOpenComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [busy, setBusy] = useState(false);

  const isOwner = currentUser?.id === post.user?.id;

  const isLikedByMe = () => {
    const myId = currentUser?.id || currentUser?._id;
    if (!myId) return false;
    return Array.isArray(post.likes) && post.likes.includes(myId);
  };

  // ── LIKE ──────────────────────────────────────────────
  const handleLike = async () => {
    if (!token) return;
    try {
      setBusy(true);
      const res = await fetch(`${API_BASE}/posts/${post._id}/like`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      onPostUpdate(updated);
    } catch {
      console.error("Like failed");
    } finally {
      setBusy(false);
    }
  };

  // ── DELETE POST ───────────────────────────────────────
  const handleDeletePost = async () => {
    if (!token || !confirm("Delete this post?")) return;
    try {
      const res = await fetch(`${API_BASE}/posts/${post._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      onPostDelete(post._id);
    } catch {
      console.error("Delete post failed");
    }
  };

  // ── ADD COMMENT ───────────────────────────────────────
  const handleAddComment = async () => {
    if (!token || !commentText.trim()) return;
    try {
      setBusy(true);
      const res = await fetch(`${API_BASE}/posts/${post._id}/comment`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: commentText.trim() }),
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      onPostUpdate(updated);
      setCommentText("");
      setOpenComments(true);
    } catch {
      console.error("Add comment failed");
    } finally {
      setBusy(false);
    }
  };

  // ── DELETE COMMENT ────────────────────────────────────
  const handleDeleteComment = async (commentId: string) => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/posts/${post._id}/comment/${commentId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      onPostUpdate(updated);
    } catch {
      console.error("Delete comment failed");
    }
  };

  const canDeleteComment = (comment: Comment) => {
    return currentUser?.id === comment.userId || isOwner;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative rounded-2xl border border-gray-100 bg-white shadow-sm p-6"
    >
      {/* 3 DOT MENU — post owner only */}
      {isOwner && (
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={() => setOpenMenu((v) => !v)}
            className="text-gray-400 hover:text-gray-700 text-xl px-1"
          >
            ⋯
          </button>
          {openMenu && (
            <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-100 rounded-xl shadow-lg py-2 text-sm">
              <button
                onClick={() => (window.location.href = `/post/${post._id}`)}
                className="w-full text-left px-4 py-2 hover:bg-gray-50"
              >
                Update
              </button>
              <button
                onClick={handleDeletePost}
                className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      )}

      {/* Author header */}
      <a href={`/user/${post.user?.id}`}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-600">
            {getInitials(post.user?.name)}
          </div>
          <div>
            <div className="font-semibold text-gray-950">
              {post.user?.name || "Unknown"}
            </div>
            <div className="text-xs text-gray-400">{timeAgo(post.createdAt)}</div>
          </div>
        </div>
      </a>

      {/* Title */}
      <div className="mb-4 text-gray-900 text-lg font-medium">{post.title}</div>

      {/* Image */}
      {post.image && (
        <img
          src={post.image}
          alt={post.title}
          className="rounded-xl w-full max-h-64 object-cover mb-4"
        />
      )}

      {/* Content */}
      <div className="text-gray-500 mb-4">{post.content}</div>

      {/* Like + Comment buttons */}
      <div className="flex items-center gap-4 text-sm">
        <button
          disabled={!token || busy}
          onClick={handleLike}
          className={`px-3 py-1.5 rounded-lg border transition ${
            isLikedByMe()
              ? "border-red-200 text-red-600 bg-red-50"
              : "border-gray-200 text-gray-600 hover:bg-gray-50"
          } ${!token || busy ? "opacity-60 cursor-not-allowed" : ""}`}
        >
          {isLikedByMe() ? "♥" : "♡"} {post.likes?.length || 0}
        </button>

        <button
          onClick={() => setOpenComments((v) => !v)}
          className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
        >
          💬 {post.comments?.length || 0}
        </button>
      </div>

      {/* Comments panel */}
      {openComments && (
        <div className="mt-4 border-t border-gray-100 pt-4 space-y-3">

          {/* Comment list */}
          <div className="space-y-2">
            {post.comments.length === 0 && (
              <p className="text-sm text-gray-400">No comments yet.</p>
            )}
            {post.comments.map((c, idx) => (
              <div
                key={c._id || idx}
                className="flex items-start justify-between gap-2 text-sm"
              >
                <div>
                  <span className="font-medium text-gray-900">{c.name || "User"}</span>
                  <span className="text-gray-400 text-xs ml-2">{timeAgo(c.createdAt)}</span>
                  <p className="text-gray-600 mt-0.5">{c.text}</p>
                </div>

                {/* Delete comment — own comment or post owner */}
                {canDeleteComment(c) && (
                  <button
                    onClick={() => handleDeleteComment(c._id)}
                    className="text-gray-300 hover:text-red-400 text-xs shrink-0 mt-0.5"
                    title="Delete comment"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Add comment input */}
          {token && (
            <div className="flex gap-2 pt-1">
              <input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
                placeholder="Write a comment..."
                disabled={busy}
                className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-gray-400 transition"
              />
              <button
                onClick={handleAddComment}
                disabled={busy || !commentText.trim()}
                className="px-4 py-2 rounded-xl bg-gray-950 text-white text-sm hover:bg-gray-800 transition disabled:opacity-50"
              >
                Post
              </button>
            </div>
          )}

          {!token && (
            <p className="text-sm text-gray-400">
              <a href="/auth/login" className="underline hover:text-gray-600">Login</a> to comment.
            </p>
          )}
        </div>
      )}
    </motion.div>
  );
}