"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onLogout() {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={onLogout}
      disabled={loading}
      className="rounded-xl p-2 text-ink-muted transition-all duration-150 hover:text-ios-red active:scale-95 disabled:opacity-60"
      aria-label="خروج"
    >
      <LogOut size={20} strokeWidth={2} />
    </button>
  );
}
