"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "خطا در ورود");
        setLoading(false);
        return;
      }

      router.push("/today");
      router.refresh();
    } catch {
      setError("خطای شبکه. لطفاً دوباره تلاش کنید");
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-3xl bg-surface p-6 shadow-raised"
      >
        <h1 className="mb-1 text-center text-2xl font-bold text-ink">
          TicketPilot
        </h1>
        <p className="mb-6 text-center text-sm text-ink-muted">ورود به پنل</p>

        <label className="mb-3 block">
          <span className="mb-2 block text-sm text-ink-soft">
            نام کاربری
          </span>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            className="neo-input"
            required
          />
        </label>

        <label className="mb-4 block">
          <span className="mb-2 block text-sm text-ink-soft">رمز عبور</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            className="neo-input"
            required
          />
        </label>

        {error && (
          <div className="mb-4 rounded-2xl bg-pastel-pink px-3 py-2 text-sm text-ios-red">
            {error}
          </div>
        )}

        <button type="submit" disabled={loading} className="btn-ios-blue w-full">
          {loading ? "در حال ورود..." : "ورود"}
        </button>
      </form>
    </main>
  );
}
