"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { toTehranInputValue } from "@/lib/date";

export default function EditFollowUpPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [title, setTitle] = useState("");
  const [dueAt, setDueAt] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await fetch(`/api/followups/${id}`);
        const data = await res.json();
        if (res.ok && data.followUp) {
          const f = data.followUp;
          setCustomerId(f.customerId);
          setTitle(f.title);
          setDueAt(toTehranInputValue(new Date(f.dueAt)));
        } else {
          setError(data.error ?? "خطا در بارگذاری");
        }
      } catch {
        setError("خطای شبکه");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!id) return;
    setSaving(true);
    setError(null);

    try {
      const res = await fetch(`/api/followups/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId, title, dueAt }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "خطا در ذخیره");
        setSaving(false);
        return;
      }
      router.push("/followups");
      router.refresh();
    } catch {
      setError("خطای شبکه");
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="rounded-3xl bg-surface p-6 text-center text-ink-muted shadow-raised">
        در حال بارگذاری...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-ink">ویرایش پیگیری</h1>
        <Link href="/followups" className="text-sm text-ios-blue">
          بازگشت
        </Link>
      </div>

      <form
        onSubmit={onSubmit}
        className="space-y-4 rounded-3xl bg-surface p-5 shadow-raised"
      >
        <label className="block">
          <span className="mb-2 block text-sm text-ink-soft">عنوان *</span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="neo-input"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm text-ink-soft">تاریخ *</span>
          <input
            type="datetime-local"
            value={dueAt}
            onChange={(e) => setDueAt(e.target.value)}
            required
            className="neo-input"
          />
        </label>

        {error && (
          <div className="rounded-2xl bg-pastel-pink px-3 py-2 text-sm text-ios-red">
            {error}
          </div>
        )}

        <button type="submit" disabled={saving} className="btn-ios-blue w-full">
          {saving ? "در حال ذخیره..." : "ذخیره تغییرات"}
        </button>
      </form>
    </div>
  );
}
