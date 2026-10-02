"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { toTehranInputValue } from "@/lib/date";
import { TRAVEL_STATUSES, TRAVEL_STATUS_LABELS } from "@/lib/travel";
import type { TravelStatus } from "@prisma/client";

export default function EditTravelPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [departDate, setDepartDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [status, setStatus] = useState<TravelStatus>("BOOKED");
  const [note, setNote] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await fetch(`/api/travels/${id}`);
        const data = await res.json();
        if (res.ok && data.travel) {
          const t = data.travel;
          setCustomerId(t.customerId);
          setFrom(t.from);
          setTo(t.to);
          setDepartDate(toTehranInputValue(new Date(t.departDate)));
          setReturnDate(
            t.returnDate ? toTehranInputValue(new Date(t.returnDate)) : ""
          );
          setStatus(t.status);
          setNote(t.note ?? "");
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
      const res = await fetch(`/api/travels/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId,
          from,
          to,
          departDate,
          returnDate,
          status,
          note,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "خطا در ذخیره");
        setSaving(false);
        return;
      }
      router.push("/travelers");
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
        <h1 className="text-xl font-bold text-ink">ویرایش سفر</h1>
        <Link href="/travelers" className="text-sm text-ios-blue">
          بازگشت
        </Link>
      </div>

      <form
        onSubmit={onSubmit}
        className="space-y-4 rounded-3xl bg-surface p-5 shadow-raised"
      >
        <label className="block">
          <span className="mb-2 block text-sm text-ink-soft">مبدأ *</span>
          <input
            type="text"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            required
            className="neo-input"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm text-ink-soft">مقصد *</span>
          <input
            type="text"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            required
            className="neo-input"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm text-ink-soft">
            تاریخ رفت *
          </span>
          <input
            type="datetime-local"
            value={departDate}
            onChange={(e) => setDepartDate(e.target.value)}
            required
            className="neo-input"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm text-ink-soft">
            تاریخ برگشت
          </span>
          <input
            type="datetime-local"
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
            className="neo-input"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm text-ink-soft">وضعیت</span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as TravelStatus)}
            className="neo-select"
          >
            {TRAVEL_STATUSES.map((s) => (
              <option key={s} value={s}>
                {TRAVEL_STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm text-ink-soft">یادداشت</span>
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
