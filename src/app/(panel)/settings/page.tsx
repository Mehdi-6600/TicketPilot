"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Avatar from "@/components/Avatar";

const AVATAR_KEY = "tp_avatar";

export default function SettingsPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(AVATAR_KEY);
      if (saved) setAvatarPreview(saved);
    } catch {
      // ignore
    }
  }, []);

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result);
      setAvatarPreview(dataUrl);
      try {
        localStorage.setItem(AVATAR_KEY, dataUrl);
      } catch {
        // ignore
      }
    };
    reader.readAsDataURL(file);
  }

  function removeAvatar() {
    setAvatarPreview(null);
    try {
      localStorage.removeItem(AVATAR_KEY);
    } catch {
      // ignore
    }
  }

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
      <h1 className="text-xl font-bold text-ink">تنظیمات</h1>

      {/* تصویر پروفایل */}
      <section className="space-y-3 rounded-3xl bg-surface p-5 shadow-raised">
        <h2 className="font-semibold text-ink">تصویر پروفایل</h2>

        <div className="flex items-center gap-4">
          <div className="flex-shrink-0">
            {avatarPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarPreview}
                alt="profile"
                className="h-20 w-20 rounded-full border-2 border-white object-cover shadow-raised"
              />
            ) : (
              <Avatar name="?" size="lg" />
            )}
          </div>

          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="btn-ios-blue px-3 py-2 text-sm"
            >
              انتخاب تصویر
            </button>
            {avatarPreview && (
              <button
                type="button"
                onClick={removeAvatar}
                className="btn-ios-gray px-3 py-2 text-sm"
              >
                حذف تصویر
              </button>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>
        </div>

        <p className="text-xs text-ink-muted">
          تصویر در این مرورگر ذخیره می‌شود
        </p>
      </section>

      {/* تغییر رمز */}
      <section className="space-y-3 rounded-3xl bg-surface p-5 shadow-raised">
        <h2 className="font-semibold text-ink">تغییر رمز عبور</h2>

        <form onSubmit={onChangePassword} className="space-y-3">
          <label className="block">
            <span className="mb-2 block text-sm text-ink-soft">
              رمز فعلی
            </span>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="neo-input"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm text-ink-soft">
              رمز جدید
            </span>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={4}
              className="neo-input"
            />
          </label>

          {error && (
            <div className="rounded-2xl bg-pastel-pink px-3 py-2 text-sm text-ios-red">
              {error}
            </div>
          )}
          {message && (
            <div className="rounded-2xl bg-pastel-mint px-3 py-2 text-sm text-ios-green">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="btn-ios-blue w-full"
          >
            {saving ? "..." : "تغییر رمز"}
          </button>
        </form>
      </section>

      {/* پشتیبان‌گیری */}
      <section className="space-y-3 rounded-3xl bg-surface p-5 shadow-raised">
        <h2 className="font-semibold text-ink">پشتیبان‌گیری</h2>
        <p className="text-sm text-ink-soft">
          فایل JSON شامل تمام مشتریان، سفرها، رزروها، پیگیری‌ها، فعالیت‌ها
          و گزارش‌ها دانلود می‌شود.
        </p>
        <a
          href="/api/backup"
          className="btn-ios-gray block w-full text-center"
        >
          ⬇️ دانلود فایل پشتیبان
        </a>
      </section>

      <Link
        href="/today"
        className="btn-neo block w-full text-center"
      >
        بازگشت
      </Link>
    </div>
  );
}
