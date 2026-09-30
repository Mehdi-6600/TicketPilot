"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toTehranInputValue } from "@/lib/date";
import { TRAVEL_STATUSES, TRAVEL_STATUS_LABELS } from "@/lib/travel";
import type { TravelStatus } from "@prisma/client";

type CustomerLite = {
  id: string;
  name: string;
  phone: string;
};

export default function NewTravelPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const presetCustomerId = searchParams.get("customerId");

  const [customer, setCustomer] = useState<CustomerLite | null>(null);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [departDate, setDepartDate] = useState(() =>
    toTehranInputValue(new Date(Date.now() + 24 * 60 * 60 * 1000))
  );
  const [returnDate, setReturnDate] = useState("");
  const [status, setStatus] = useState<TravelStatus>("BOOKED");
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

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!customer) {
      setError("مشتری رو انتخاب کن");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/travels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: customer.id,
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
        setError(data.error ?? "خطا در ثبت سفر");
        setLoading(false);
        return;
      }

      router.push("/travelers");
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
        <h1 className="text-xl font-bold text-slate-900">سفر جدید</h1>
        <Link href="/travelers" className="text-sm text-brand-600">
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
        <label className="block">
          <span className="mb-1 block text-sm text-slate-600">مبدأ *</span>
          <input
            type="text"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            required
            placeholder="مثلاً شیراز"
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none focus:border-brand-500"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm text-slate-600">مقصد *</span>
          <input
            type="text"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            required
            placeholder="مثلاً استانبول"
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none focus:border-brand-500"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm text-slate-600">
            تاریخ رفت *
          </span>
          <input
            type="datetime-local"
            value={departDate}
            onChange={(e) => setDepartDate(e.target.value)}
            required
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none focus:border-brand-500"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm text-slate-600">
            تاریخ برگشت (اختیاری)
          </span>
          <input
            type="datetime-local"
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none focus:border-brand-500"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm text-slate-600">وضعیت</span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as TravelStatus)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none focus:border-brand-500"
          >
            {TRAVEL_STATUSES.map((s) => (
              <option key={s} value={s}>
                {TRAVEL_STATUS_LABELS[s]}
              </option>
            ))}
          </select>
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
          disabled={loading}
          className="w-full rounded-xl bg-brand-600 py-3 font-medium text-white disabled:opacity-60"
        >
          {loading ? "در حال ذخیره..." : "ذخیره سفر"}
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
        <h1 className="text-xl font-bold text-slate-900">سفر جدید</h1>
        <Link href="/travelers" className="text-sm text-brand-600">
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
