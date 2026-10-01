"use client";

import { useState } from "react";
import Link from "next/link";

type Props = {
  id: string;
  dateLabel: string;
  initialContent: string;
};

export default function ReportEditor({
  id,
  dateLabel,
  initialContent,
}: Props) {
  const [content, setContent] = useState(initialContent);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSave() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/reports/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "خطا در ذخیره");
        setLoading(false);
        return;
      }
      setSavedAt(new Date().toLocaleTimeString("fa-IR"));
      setLoading(false);
    } catch {
      setError("خطای شبکه");
      setLoading(false);
    }
  }

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("کپی نشد. متن رو دستی انتخاب کن");
    }
  }

  async function onRegenerate() {
    if (
      !confirm(
        "گزارش امروز از نو ساخته شود؟ (تغییرات دستی از بین می‌رود)"
      )
    )
      return;
    setLoading(true);
    try {
      const res = await fetch("/api/reports/generate", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "خطا در ساخت گزارش");
        setLoading(false);
        return;
      }
      setContent(data.report.content);
      setLoading(false);
    } catch {
      setError("خطای شبکه");
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900">
          گزارش {dateLabel}
        </h1>
        <Link href="/reports" className="text-sm text-brand-600">
          بازگشت
        </Link>
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={22}
        className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-7 outline-none focus:border-brand-500"
        style={{ fontFamily: "inherit", direction: "rtl" }}
      />

      {error && (
        <div className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {savedAt && (
        <div className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          ذخیره شد — {savedAt}
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={onSave}
          disabled={loading}
          className="rounded-xl bg-slate-900 py-3 text-sm font-medium text-white disabled:opacity-60"
        >
          {loading ? "..." : "💾 ذخیره"}
        </button>
        <button
          type="button"
          onClick={onCopy}
          className="rounded-xl bg-brand-600 py-3 text-sm font-medium text-white"
        >
          {copied ? "✅ کپی شد" : "📋 کپی گزارش"}
        </button>
      </div>

      <button
        type="button"
        onClick={onRegenerate}
        disabled={loading}
        className="w-full rounded-xl bg-slate-100 py-2 text-xs text-slate-600 disabled:opacity-60"
      >
        🔄 ساخت مجدد از داده‌های امروز
      </button>
    </div>
  );
}
