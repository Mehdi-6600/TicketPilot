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
      <div className="rounded-3xl bg-surface p-6 text-center text-ink-muted shadow-raised">
        در حال بارگذاری...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-ink">ویرایش مشتری</h1>
        <Link href={`/customers/${id}`} className="text-sm text-ios-blue">
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

        <button type="submit" disabled={saving} className="btn-ios-blue w-full">
          {saving ? "در حال ذخیره..." : "ذخیره تغییرات"}
        </button>
      </form>
    </div>
  );
}
