"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import axios from "axios";

const API_BASE = "http://localhost:5000/api";

type Status = "idle" | "loading" | "error";

export default function Login() {
  const [form, setForm]           = useState({ email: "", password: "" });
  const [status, setStatus]       = useState<Status>("idle");
  const [message, setMessage]     = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const { data } = await axios.post(`${API_BASE}/auth/login`, form);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.location.href = "/";
    } catch (err: any) {
      setStatus("error");
      setMessage(err.response?.data?.message || "Login failed. Try again.");
    }
  };

  return (
    <section className="relative min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center px-4">
      <div className="relative w-full max-w-md mx-auto px-6 py-12 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <h2 className="text-3xl font-semibold text-gray-950 dark:text-white text-center mb-2">
            Welcome Back
          </h2>
          <p className="text-sm text-gray-400 text-center mb-8">
            Login to continue your journey with QuoraGram.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-400 transition"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-2.5 pr-11 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-400 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Error message */}
            {status === "error" && (
              <p className="text-sm text-red-500 dark:text-red-400">{message}</p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-gray-950 dark:bg-white text-white dark:text-gray-950 text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition disabled:opacity-60"
            >
              {status === "loading" ? "Logging in..." : "Login"}
              <ArrowRight size={16} strokeWidth={2} />
            </button>
          </form>

          {/* Footer */}
          <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Don't have an account?{" "}
            <a href="/auth/register" className="text-gray-950 dark:text-white font-medium hover:underline">
              Register
            </a>
          </p>

        </motion.div>
      </div>
    </section>
  );
}