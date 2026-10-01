"use client";

import { useState } from "react";
import Link from "next/link";

export default function SettingsPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setMessage(null);

    try {
      const res = await fetch("/api/user/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "خطا در تغییر رمز");
        setSaving(false);
        return;
      }
      setMessage("رمز عبور با موفقیت تغییر کرد");
      setCurrentPassword("");
      setNewPassword("");
      setSaving(false);
    } catch {
      setError("خطای شبکه");
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-slate-900">تنظیمات</h1>

      <section className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="mb-3 font-semibold text-slate-800">تغییر رمز عبور</h2>

        <form onSubmit={onChangePassword} className="space-y-3">
          <label className="block">
            <span className="mb-1 block text-sm text-slate-600">
              رمز فعلی
            </span>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none focus:border-brand-500"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm text-slate-600">
              رمز جدید
            </span>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={4}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none focus:border-brand-500"
            />
          </label>

          {error && (
            <div className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}
          {message && (
            <div className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-xl bg-brand-600 py-2.5 font-medium text-white disabled:opacity-60"
          >
            {saving ? "..." : "تغییر رمز"}
          </button>
        </form>
      </section>

      <section className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="mb-3 font-semibold text-slate-800">پشتیبان‌گیری</h2>
        <p className="mb-3 text-sm text-slate-600">
          فایل JSON شامل تمام مشتریان، سفرها، رزروها، پیگیری‌ها، فعالیت‌ها و
          گزارش‌ها دانلود می‌شود.
        </p>
        <a
          href="/api/backup"
          className="block rounded-xl bg-slate-900 py-2.5 text-center text-sm font-medium text-white"
        >
          ⬇️ دانلود فایل پشتیبان
        </a>
      </section>

      <Link
        href="/today"
        className="block rounded-xl bg-slate-100 py-3 text-center text-sm text-slate-700"
      >
        بازگشت
      </Link>
    </div>
  );
}
