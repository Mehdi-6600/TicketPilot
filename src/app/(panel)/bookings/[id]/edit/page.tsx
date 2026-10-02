"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { CURRENCIES } from "@/lib/format";
import {
  BOOKING_STATUSES,
  BOOKING_STATUS_LABELS,
} from "@/lib/booking";
import type { BookingStatus, Currency } from "@prisma/client";

type TravelLite = {
  id: string;
  from: string;
  to: string;
};

export default function EditBookingPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [customerId, setCustomerId] = useState("");
  const [travels, setTravels] = useState<TravelLite[]>([]);
  const [travelId, setTravelId] = useState("");
  const [status, setStatus] = useState<BookingStatus>("INQUIRY");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState<Currency>("TOMAN");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await fetch(`/api/bookings/${id}`);
        const data = await res.json();
        if (res.ok && data.booking) {
          const b = data.booking;
          setCustomerId(b.customerId);
          setTravelId(b.travelId ?? "");
          setStatus(b.status);
          setAmount(b.amount !== null ? String(b.amount) : "");
          setCurrency(b.currency);
          setNote(b.note ?? "");

          const tres = await fetch(`/api/travels?customerId=${b.customerId}`);
          const tdata = await tres.json();
          if (tres.ok) {
            setTravels(
              (tdata.travels ?? []).map(
                (t: { id: string; from: string; to: string }) => ({
                  id: t.id,
                  from: t.from,
                  to: t.to,
                })
              )
            );
          }
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

    const amountNumber =
      amount.trim() === "" ? null : Number(amount.replace(/[^\d]/g, ""));

    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId,
          travelId,
          status,
          amount: amountNumber,
          currency,
          note,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "خطا در ذخیره");
        setSaving(false);
        return;
      }
      router.push("/bookings");
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
        <h1 className="text-xl font-bold text-ink">ویرایش رزرو</h1>
        <Link href="/bookings" className="text-sm text-ios-blue">
          بازگشت
        </Link>
      </div>

      <form
        onSubmit={onSubmit}
        className="space-y-4 rounded-3xl bg-surface p-5 shadow-raised"
      >
        {travels.length > 0 && (
          <label className="block">
            <span className="mb-2 block text-sm text-ink-soft">
              سفر مرتبط
            </span>
            <select
              value={travelId}
              onChange={(e) => setTravelId(e.target.value)}
              className="neo-select"
            >
              <option value="">بدون سفر</option>
              {travels.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.from} → {t.to}
                </option>
              ))}
            </select>
          </label>
        )}

        <label className="block">
          <span className="mb-2 block text-sm text-ink-soft">وضعیت</span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as BookingStatus)}
            className="neo-select"
          >
            {BOOKING_STATUSES.map((s) => (
              <option key={s} value={s}>
                {BOOKING_STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </label>

        <div>
          <span className="mb-2 block text-sm text-ink-soft">مبلغ</span>
          <div className="flex gap-2">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as Currency)}
              className="neo-select w-32 flex-shrink-0"
            >
              {CURRENCIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
            <input
              type="text"
              inputMode="numeric"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="neo-input"
            />
          </div>
        </div>

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
