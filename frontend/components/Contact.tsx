"use client";

import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";

const API_BASE = "http://localhost:5000/api";
type Status = "idle" | "loading" | "success" | "error";

export default function Contact() {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [responseMsg, setResponseMsg] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setCurrentUser(JSON.parse(stored));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setStatus("loading");
    setResponseMsg("");

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE}/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ send token so backend uses real email
        },
        body: JSON.stringify({ message }), // ✅ only send message — name/email from token
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong");

      setStatus("success");
      setResponseMsg(data.message);
      setMessage("");
    } catch (err: any) {
      setStatus("error");
      setResponseMsg(err.message || "Failed to send. Try again.");
    }
  };

  return (
    <section id="contact" className="bg-gray-50 dark:bg-gray-950 py-28">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center">

          <p className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-4">
            Contact & Support
          </p>

          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-gray-950 dark:text-white leading-tight">
            Join Sentinel
            <br />
            Ask, Share, Connect!
          </h2>

          <p className="mt-6 text-lg text-gray-500 dark:text-gray-400 leading-relaxed max-w-xl mx-auto">
            Have questions, feedback, or need help? Reach out to our team.
          </p>

          <form onSubmit={handleSubmit} className="mt-10 space-y-4 text-left">

            {/* ✅ Pre-filled read-only name */}
            <input
              type="text"
              value={currentUser?.name || ""}
              readOnly
              className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
              placeholder="Your name"
            />

            {/* ✅ Pre-filled read-only email */}
            <input
              type="email"
              value={currentUser?.email || ""}
              readOnly
              className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
              placeholder="Your email"
            />

            {/* ✅ Only message is editable */}
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Your Message"
              required
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-400"
            />

            {!currentUser && (
              <p className="text-sm text-red-500">
                Please <a href="/auth/login" className="underline">login</a> to send a message.
              </p>
            )}

            <button
              type="submit"
              disabled={status === "loading" || !currentUser}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-gray-950 dark:bg-white text-white dark:text-gray-950 text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition disabled:opacity-60"
            >
              {status === "loading" ? "Sending..." : "Send Message"}
              <ArrowRight size={16} strokeWidth={2} />
            </button>
          </form>

          {status === "success" && (
            <p className="mt-4 text-green-600 dark:text-green-400 font-medium">{responseMsg}</p>
          )}
          {status === "error" && (
            <p className="mt-4 text-red-500 dark:text-red-400 font-medium">{responseMsg}</p>
          )}

        </div>
      </div>
    </section>
  );
}