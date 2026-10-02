"use client";

import { useState } from "react";
import Link from "next/link";

type Props = {
  id: string;
  dateLabel: string;
  initialContent: string;
};

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function renderPreview(content: string): string {
  const lines = content.split("\n");
  const out: string[] = [];

  for (const raw of lines) {
    if (/^▬{3,}$/.test(raw.trim())) {
      out.push(
        `<div style="border-top:1px solid #c7cdd6;margin:10px 0;width:55%;"></div>`
      );
      continue;
    }

    if (raw.trim() === "") {
      out.push(`<div style="height:6px;"></div>`);
      continue;
    }

    const boldMatch = raw.match(/^\*\*(.+)\*\*\s*$/);
    if (boldMatch) {
      out.push(
        `<div style="font-weight:800;color:#1F2937;margin:6px 0;font-size:15px;">${escapeHtml(
          boldMatch[1]
        )}</div>`
      );
      continue;
    }

    const leading = raw.match(/^\s*/)?.[0] ?? "";
    const indent = leading.replace(/\t/g, "    ").length;
    const padding = Math.min(indent, 12) * 6;

    out.push(
      `<div style="padding-right:${padding}px;margin:2px 0;">${escapeHtml(
        raw.trimStart()
      )}</div>`
    );
  }

  return out.join("");
}

export default function ReportEditor({
  id,
  dateLabel,
  initialContent,
}: Props) {
  const [content, setContent] = useState(initialContent);
  const [mode, setMode] = useState<"preview" | "edit">("preview");
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
    const clean = content.replace(/\*\*/g, "");
    try {
      await navigator.clipboard.writeText(clean);
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
      setMode("preview");
    } catch {
      setError("خطای شبکه");
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-ink">گزارش {dateLabel}</h1>
        <Link href="/reports" className="text-sm text-ios-blue">
          بازگشت
        </Link>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setMode("preview")}
          className={`rounded-xl px-3 py-1.5 text-sm transition-all duration-150 ${
            mode === "preview"
              ? "bg-ink text-white shadow-raised-sm"
              : "bg-surface text-ink-soft shadow-raised-sm active:scale-95 active:shadow-pressed"
          }`}
        >
          👁️ پیش‌نمایش
        </button>
        <button
          type="button"
          onClick={() => setMode("edit")}
          className={`rounded-xl px-3 py-1.5 text-sm transition-all duration-150 ${
            mode === "edit"
              ? "bg-ink text-white shadow-raised-sm"
              : "bg-surface text-ink-soft shadow-raised-sm active:scale-95 active:shadow-pressed"
          }`}
        >
          ✏️ ویرایش متن
        </button>
      </div>

      {mode === "preview" ? (
        <div
          className="rounded-3xl bg-surface p-5 text-sm leading-7 text-ink-soft shadow-raised"
          style={{ direction: "rtl", fontFamily: "inherit" }}
          dangerouslySetInnerHTML={{ __html: renderPreview(content) }}
        />
      ) : (
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={22}
          className="neo-textarea text-sm leading-7"
          style={{ fontFamily: "inherit", direction: "rtl" }}
        />
      )}

      {error && (
        <div className="rounded-2xl bg-pastel-pink px-3 py-2 text-sm text-ios-red">
          {error}
        </div>
      )}

      {savedAt && (
        <div className="rounded-2xl bg-pastel-mint px-3 py-2 text-sm text-ios-green">
          ذخیره شد — {savedAt}
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={onSave}
          disabled={loading}
          className="btn-ios-gray"
        >
          {loading ? "..." : "💾 ذخیره"}
        </button>
        <button type="button" onClick={onCopy} className="btn-ios-blue">
          {copied ? "✅ کپی شد" : "📋 کپی گزارش"}
        </button>
      </div>

      <button
        type="button"
        onClick={onRegenerate}
        disabled={loading}
        className="btn-neo w-full text-xs"
      >
        🔄 ساخت مجدد از داده‌های امروز
      </button>
    </div>
  );
}
