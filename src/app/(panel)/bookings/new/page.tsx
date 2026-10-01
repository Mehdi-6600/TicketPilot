"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CURRENCIES } from "@/lib/format";
import {
  BOOKING_STATUSES,
  BOOKING_STATUS_LABELS,
} from "@/lib/booking";
import type { BookingStatus, Currency } from "@prisma/client";

type CustomerLite = {
  id: string;
  name: string;
  phone: string;
};

type TravelLite = {
  id: string;
  from: string;
  to: string;
  departDate: string;
};

export default function NewBookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const presetCustomerId = searchParams.get("customerId");

  const [customer, setCustomer] = useState<CustomerLite | null>(null);
  const [travels, setTravels] = useState<TravelLite[]>([]);
  const [travelId, setTravelId] = useState("");
  const [status, setStatus] = useState<BookingStatus>("INQUIRY");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState<Currency>("TOMAN");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!presetCustomerId) return;
    (async () => {
      try {
        const res = await fetch(`/api/customers/${presetCustomerId}`);
        const data = await res.json();
        if (res.ok && data.customer) {
          setCustomer({
            id: data.customer.id,
            name: data.customer.name,
            phone: data.customer.phone,
          });
        }
      } catch {
        // ignore
      }
    })();
  }, [presetCustomerId]);

  useEffect(() => {
    if (!customer) return;
    (async () => {
      try {
        const res = await fetch(`/api/travels?customerId=${customer.id}`);
        const data = await res.json();
        if (res.ok) {
          setTravels(
            (data.travels ?? []).map(
              (t: {
                id: string;
                from: string;
                to: string;
                departDate: string;
              }) => ({
                id: t.id,
                from: t.from,
                to: t.to,
                departDate: t.departDate,
              })
            )
          );
        }
      } catch {
        // ignore
      }
    })();
  }, [customer]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!customer) {
      setError("مشتری رو انتخاب کن");
      return;
    }
    setError(null);
    setLoading(true);

    const amountNumber =
      amount.trim() === "" ? null : Number(amount.replace(/[^\d]/g, ""));

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: customer.id,
          travelId,
          status,
          amount: amountNumber,
          currency,
          note,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "خطا در ثبت رزرو");
        setLoading(false);
        return;
      }

      router.push("/bookings");
      router.refresh();
    } catch {
      setError("خطای شبکه");
      setLoading(false);
    }
  }

  if (!customer) {
    return <CustomerPicker onPick={setCustomer} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900">رزرو جدید</h1>
        <Link href="/bookings" className="text-sm text-brand-600">
          بازگشت
        </Link>
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <div className="text-sm text-slate-500">مشتری</div>
        <div className="font-medium text-slate-900">{customer.name}</div>
        <div className="text-sm text-slate-600">{customer.phone}</div>
        <button
          type="button"
          onClick={() => setCustomer(null)}
          className="mt-2 text-xs text-brand-600"
        >
          تغییر مشتری
        </button>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        {travels.length > 0 && (
          <label className="block">
            <span className="mb-1 block text-sm text-slate-600">
              اتصال به سفر (اختیاری)
            </span>
            <select
              value={travelId}
              onChange={(e) => setTravelId(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none focus:border-brand-500"
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
          <span className="mb-1 block text-sm text-slate-600">وضعیت</span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as BookingStatus)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none focus:border-brand-500"
          >
            {BOOKING_STATUSES.map((s) => (
              <option key={s} value={s}>
                {BOOKING_STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </label>

        <div className="rounded-2xl bg-white p-4 shadow-sm space-y-3">
          <span className="block text-sm text-slate-600">مبلغ</span>
          <div className="flex gap-2">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as Currency)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none focus:border-brand-500"
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
              placeholder="مثلاً 15000000"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none focus:border-brand-500"
            />
          </div>
        </div>

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
          disabled={loading}
          className="w-full rounded-xl bg-brand-600 py-3 font-medium text-white disabled:opacity-60"
        >
          {loading ? "در حال ذخیره..." : "ذخیره رزرو"}
        </button>
      </form>
    </div>
  );
}

function CustomerPicker({
  onPick,
}: {
  onPick: (c: CustomerLite) => void;
}) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<CustomerLite[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (q.trim().length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/customers/quick-search?q=${encodeURIComponent(q.trim())}`
        );
        const data = await res.json();
        setResults(data.customers ?? []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [q]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900">رزرو جدید</h1>
        <Link href="/bookings" className="text-sm text-brand-600">
          بازگشت
        </Link>
      </div>

      <p className="text-sm text-slate-500">اول مشتری رو انتخاب کن</p>

      <input
        type="text"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="نام یا شماره تماس..."
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none focus:border-brand-500"
        autoFocus
      />

      {q.trim().length < 2 && (
        <p className="text-sm text-slate-500">
          حداقل ۲ حرف بنویس تا جستجو بشه
        </p>
      )}

      {loading && <p className="text-sm text-slate-500">در حال جستجو...</p>}

      {!loading && q.trim().length >= 2 && results.length === 0 && (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 p-6 text-center text-slate-500">
          مشتری پیدا نشد
          <div className="mt-3">
            <Link href="/customers/new" className="text-sm text-brand-600">
              ＋ افزودن مشتری جدید
            </Link>
          </div>
        </div>
      )}

      <ul className="space-y-2">
        {results.map((c) => (
          <li key={c.id}>
            <button
              type="button"
              onClick={() => onPick(c)}
              className="w-full rounded-2xl bg-white p-4 text-right shadow-sm transition active:scale-[0.98]"
            >
              <div className="font-medium text-slate-900">{c.name}</div>
              <div className="mt-1 text-sm text-slate-500">{c.phone}</div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
