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
        <h1 className="text-xl font-bold text-ink">سفر جدید</h1>
        <Link href="/travelers" className="text-sm text-ios-blue">
          بازگشت
        </Link>
      </div>

      <div className="rounded-3xl bg-pastel-lavender p-4 shadow-raised">
        <div className="text-xs text-ink-muted">مشتری</div>
        <div className="font-medium text-ink">{customer.name}</div>
        <div className="text-sm text-ink-soft">{customer.phone}</div>
        <button
          type="button"
          onClick={() => setCustomer(null)}
          className="mt-2 text-xs text-ios-blue"
        >
          تغییر مشتری
        </button>
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
            placeholder="مثلاً شیراز"
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
            placeholder="مثلاً استانبول"
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
            تاریخ برگشت (اختیاری)
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
        <h1 className="text-xl font-bold text-ink">سفر جدید</h1>
        <Link href="/travelers" className="text-sm text-ios-blue">
          بازگشت
        </Link>
      </div>

      <p className="text-sm text-ink-muted">اول مشتری رو انتخاب کن</p>

      <input
        type="text"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="نام یا شماره تماس..."
        className="neo-input"
        autoFocus
      />

      {q.trim().length < 2 && (
        <p className="text-sm text-ink-muted">
          حداقل ۲ حرف بنویس تا جستجو بشه
        </p>
      )}

      {loading && <p className="text-sm text-ink-muted">در حال جستجو...</p>}

      {!loading && q.trim().length >= 2 && results.length === 0 && (
        <div className="rounded-3xl bg-surface p-6 text-center text-ink-muted shadow-inset">
          مشتری پیدا نشد
          <div className="mt-3">
            <Link href="/customers/new" className="text-sm text-ios-blue">
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
              className="w-full rounded-2xl bg-surface p-4 text-right shadow-raised transition-all duration-150 active:scale-[0.98] active:shadow-pressed"
            >
              <div className="font-medium text-ink">{c.name}</div>
              <div className="mt-1 text-sm text-ink-muted">{c.phone}</div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
