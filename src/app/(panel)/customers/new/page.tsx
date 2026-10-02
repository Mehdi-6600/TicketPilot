"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewCustomerPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, note }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "خطا در ثبت مشتری");
        setLoading(false);
        return;
      }

      router.push(`/customers/${data.customer.id}`);
      router.refresh();
    } catch {
      setError("خطای شبکه");
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-ink">مشتری جدید</h1>
        <Link href="/customers" className="text-sm text-ios-blue">
          بازگشت
        </Link>
      </div>

      <form
        onSubmit={onSubmit}
        className="space-y-4 rounded-3xl bg-surface p-5 shadow-raised"
      >
        <label className="block">
          <span className="mb-2 block text-sm text-ink-soft">نام *</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="neo-input"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm text-ink-soft">
            شماره تماس *
          </span>
          <input
            type="tel"
            inputMode="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="neo-input"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm text-ink-soft">
            یادداشت (اختیاری)
          </span>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            className="neo-textarea"
          />
        </label>

        {error && (
          <div className="rounded-2xl bg-pastel-pink px-3 py-2 text-sm text-ios-red">
            {error}
          </div>
        )}

        <button type="submit" disabled={loading} className="btn-ios-blue w-full">
          {loading ? "در حال ذخیره..." : "ذخیره"}
        </button>
      </form>
    </div>
  );
}
