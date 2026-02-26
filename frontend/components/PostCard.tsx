"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const API_BASE = "http://localhost:5000/api";

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  const intervals: [number, Intl.RelativeTimeFormatUnit][] = [
    [60, "second"], [3600, "minute"], [86400, "hour"],
    [604800, "day"], [2592000, "week"], [31536000, "month"], [Infinity, "year"],
  ];
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  if (seconds < 60) return "just now";
  for (let i = 0; i < intervals.length - 1; i++) {
    if (seconds < intervals[i][0]) {
      const prev = i === 0 ? 1 : intervals[i - 1][0];
      return rtf.format(-Math.floor(seconds / prev), intervals[i][1]);
    }
  }
  return rtf.format(-Math.floor(seconds / 31536000), "year");
}

function getInitials(name: string) {
  if (!name) return "?";
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

interface Comment { _id: string; userId: string; name: string; text: string; createdAt: string; }
interface Post {
  _id: string; title: string; content: string; image?: string;
  createdAt: string; likes: string[]; comments: Comment[];
  user?: { id: string; name: string; };
}
interface PostCardProps {
  post: Post; currentUser: any; token: string | null;
  onPostUpdate: (updatedPost: Post) => void;
  onPostDelete: (postId: string) => void;
}

export default function PostCard({ post, currentUser, token, onPostUpdate, onPostDelete }: PostCardProps) {
  const [openMenu, setOpenMenu]         = useState(false);
  const [openComments, setOpenComments] = useState(false);
  const [commentText, setCommentText]   = useState("");
  const [busy, setBusy]                 = useState(false);

  const postUserId   = post.user?.id;
  const postUserName = post.user?.name || "Unknown";
  const isOwner      = !!postUserId && currentUser?.id === postUserId;

  const isLikedByMe = () => {
    const myId = currentUser?.id || currentUser?._id;
    return Array.isArray(post.likes) && !!myId && post.likes.includes(myId);
  };

  const handleLike = async () => {
    if (!token) return;
    try {
      setBusy(true);
      const res = await fetch(`${API_BASE}/posts/${post._id}/like`, { method: "PUT", headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error();
      onPostUpdate(await res.json());
    } catch { console.error("Like failed"); } finally { setBusy(false); }
  };

  const handleDeletePost = async () => {
    if (!token || !confirm("Delete this post?")) return;
    try {
      const res = await fetch(`${API_BASE}/posts/${post._id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error();
      onPostDelete(post._id);
    } catch { console.error("Delete post failed"); }
  };

  const handleAddComment = async () => {
    if (!token || !commentText.trim()) return;
    try {
      setBusy(true);
      const res = await fetch(`${API_BASE}/posts/${post._id}/comment`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ text: commentText.trim() }),
      });
      if (!res.ok) throw new Error();
      onPostUpdate(await res.json());
      setCommentText("");
      setOpenComments(true);
    } catch { console.error("Add comment failed"); } finally { setBusy(false); }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/posts/${post._id}/comment/${commentId}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error();
      onPostUpdate(await res.json());
    } catch { console.error("Delete comment failed"); }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      // ✅ smooth lift + border glow on hover
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="relative rounded-2xl border border-gray-100 dark:border-[#2A2D3E] bg-white dark:bg-[#1A1D27] shadow-sm hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-800/60 transition-all duration-300 p-6"
    >
      {/* 3 DOT MENU */}
      {isOwner && (
        <div className="absolute top-4 right-4 z-10">
          <button onClick={() => setOpenMenu((v) => !v)} className="text-gray-400 dark:text-slate-500 hover:text-gray-700 dark:hover:text-slate-300 text-xl px-1 transition">⋯</button>
          {openMenu && (
            <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-[#1E2130] border border-gray-100 dark:border-[#2A2D3E] rounded-xl shadow-lg py-2 text-sm">
              <button onClick={() => (window.location.href = `/post/${post._id}`)} className="w-full text-left px-4 py-2 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-[#252838] transition">Update</button>
              <button onClick={handleDeletePost} className="w-full text-left px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition">Delete</button>
            </div>
          )}
        </div>
      )}

      {/* Author */}
      <a href={postUserId ? `/user/${postUserId}` : "#"}>
        <div className="flex items-center gap-3 mb-3 group">
          {/* ✅ avatar scales on hover */}
          <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-sm font-semibold text-indigo-700 dark:text-indigo-400 group-hover:scale-110 transition-transform duration-200">
            {getInitials(postUserName)}
          </div>
          <div>
            <div className="font-semibold text-gray-950 dark:text-[#E2E8F0] group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">{postUserName}</div>
            <div className="text-xs text-gray-400 dark:text-slate-500">{timeAgo(post.createdAt)}</div>
          </div>
        </div>
      </a>

      <div className="mb-4 text-gray-900 dark:text-[#CBD5E1] text-lg font-medium">{post.title}</div>

      {post.image && (
        // ✅ image scales slightly on hover
        <div className="overflow-hidden rounded-xl mb-4">
          <img
            src={post.image} alt={post.title}
            className="w-full max-h-64 object-cover hover:scale-[1.02] transition-transform duration-500"
          />
        </div>
      )}

      <div className="text-gray-500 dark:text-slate-400 mb-4">{post.content}</div>

      {/* Like + Comment */}
      <div className="flex items-center gap-4 text-sm">
        <button
          disabled={!token || busy} onClick={handleLike}
          className={`px-3 py-1.5 rounded-lg border transition-all duration-200 active:scale-95 ${
            isLikedByMe()
              ? "border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 hover:bg-rose-100 dark:hover:bg-rose-900/40"
              : "border-gray-200 dark:border-[#2A2D3E] text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-[#252838] hover:border-rose-200 dark:hover:border-rose-800 hover:text-rose-500"
          } ${!token || busy ? "opacity-60 cursor-not-allowed" : ""}`}
        >
          {isLikedByMe() ? "♥" : "♡"} {post.likes?.length || 0}
        </button>

        <button
          onClick={() => setOpenComments((v) => !v)}
          className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-[#2A2D3E] text-gray-600 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:border-indigo-200 dark:hover:border-indigo-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200 active:scale-95"
        >
          💬 {post.comments?.length || 0}
        </button>
      </div>

      {/* Comments panel */}
      {openComments && (
        <div className="mt-4 border-t border-gray-100 dark:border-[#2A2D3E] pt-4 space-y-3">
          <div className="space-y-2">
            {post.comments.length === 0 && <p className="text-sm text-gray-400 dark:text-slate-500">No comments yet.</p>}
            {post.comments.map((c, idx) => (
              <div key={c._id || idx} className="flex items-start justify-between gap-2 text-sm group/comment">
                <div>
                  <span className="font-medium text-gray-900 dark:text-slate-200">{c.name || "User"}</span>
                  <span className="text-gray-400 dark:text-slate-500 text-xs ml-2">{timeAgo(c.createdAt)}</span>
                  <p className="text-gray-600 dark:text-slate-400 mt-0.5">{c.text}</p>
                </div>
                {(currentUser?.id === c.userId || isOwner) && (
                  <button
                    onClick={() => handleDeleteComment(c._id)}
                    className="text-gray-300 dark:text-slate-600 hover:text-red-400 dark:hover:text-red-400 text-xs shrink-0 mt-0.5 opacity-0 group-hover/comment:opacity-100 transition-all duration-200"
                    title="Delete comment"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>

          {token && (
            <div className="flex gap-2 pt-1">
              <input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
                placeholder="Write a comment..."
                disabled={busy}
                className="flex-1 px-3 py-2 rounded-xl border border-gray-200 dark:border-[#2A2D3E] bg-white dark:bg-[#13151F] text-gray-900 dark:text-slate-200 text-sm outline-none focus:border-indigo-400 dark:focus:border-indigo-500 transition-colors duration-200"
              />
              <button
                onClick={handleAddComment}
                disabled={busy || !commentText.trim()}
                className="px-4 py-2 rounded-xl bg-gray-950 dark:bg-indigo-600 text-white text-sm hover:bg-gray-800 dark:hover:bg-indigo-700 active:scale-95 transition-all duration-200 disabled:opacity-50"
              >
                Post
              </button>
            </div>
          )}

          {!token && (
            <p className="text-sm text-gray-400 dark:text-slate-500">
              <a href="/auth/login" className="underline hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">Login</a> to comment.
            </p>
          )}
        </div>
      )}
    </motion.div>
  );
}