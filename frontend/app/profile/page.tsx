"use client";

import { useEffect } from "react";

export default function ProfileRedirect() {
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) { window.location.href = "/auth/login"; return; }
    const user = JSON.parse(stored);
    window.location.href = `/user/${user.id}`;
  }, []);

  return null; // renders nothing — just redirects
}