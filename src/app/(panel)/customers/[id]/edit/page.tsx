"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

export default function EditCustomerPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await fetch(`/api/customers/${id}`);
        const data = await res.json();
        if (res.ok && data.customer) {
          setName(data.customer.name);
          setPhone(data.customer.phone);
          setNote(data.customer.note ?? "");
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
      const res = await fetch(`/api/customers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, note }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "خطا در ذخیره");
        setSaving(false);
        return;
      }
      router.push(`/customers/${id}`);
      router.refresh();
    } catch {
      setError("خطای شبکه");
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="rounded-2xl bg-white p-6 text-center text-slate-500 shadow-sm">
        در حال بارگذاری...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900">ویرایش مشتری</h1>
        <Link href={`/customers/${id}`} className="text-sm text-brand-600">
          بازگشت
        </Link>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <label className="block">
          <span className="mb-1 block text-sm text-slate-600">نام *</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none focus:border-brand-500"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm text-slate-600">
            شماره تماس *
          </span>
          <input
            type="tel"
            inputMode="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none focus:border-brand-500"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm text-slate-600">
            یادداشت (اختیاری)
          </span>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none focus:border-brand-500"
          />
        </label>

        {error && (
          <div className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-xl bg-brand-600 py-3 font-medium text-white disabled:opacity-60"
        >
          {saving ? "در حال ذخیره..." : "ذخیره تغییرات"}
        </button>
      </form>
    </div>
  );
}
