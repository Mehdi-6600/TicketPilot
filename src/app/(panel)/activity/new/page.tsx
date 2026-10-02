"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ACTIVITY_TYPES, getActivityMeta } from "@/lib/activity";
import { CURRENCIES } from "@/lib/format";
import type { ActivityType, Currency } from "@prisma/client";

type CustomerLite = {
  id: string;
  name: string;
  phone: string;
};

export default function NewActivityPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const presetCustomerId = searchParams.get("customerId");

  const [step, setStep] = useState<"type" | "customer" | "details">("type");
  const [type, setType] = useState<ActivityType | null>(null);
  const [customer, setCustomer] = useState<CustomerLite | null>(null);
  const [note, setNote] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState<Currency>("TOMAN");
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

  async function submit() {
    if (!type || !customer) return;
    setError(null);
    setLoading(true);

    const amountNumber =
      amount.trim() === "" ? null : Number(amount.replace(/[^\d]/g, ""));

    try {
      const res = await fetch("/api/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          customerId: customer.id,
          note,
          amount: amountNumber,
          currency,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "خطا در ثبت فعالیت");
        setLoading(false);
        return;
      }

      router.push("/today");
      router.refresh();
    } catch {
      setError("خطای شبکه");
      setLoading(false);
    }
  }

  if (step === "type") {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-ink">ثبت فعالیت</h1>
          <Link href="/today" className="text-sm text-ios-blue">
            بازگشت
          </Link>
        </div>

        <p className="text-sm text-ink-muted">نوع فعالیت رو انتخاب کن</p>

        <div className="grid grid-cols-2 gap-3">
          {ACTIVITY_TYPES.map((a) => (
            <button
              key={a.type}
              type="button"
              onClick={() => {
                setType(a.type);
                setStep("customer");
              }}
              className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-surface p-4 shadow-raised transition-all duration-150 active:scale-[0.97] active:shadow-pressed"
            >
              <span className="text-2xl">{a.icon}</span>
              <span className="text-sm font-medium text-ink-soft">
                {a.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (step === "customer") {
    return (
      <CustomerPicker
        onBack={() => setStep("type")}
        onPick={(c) => {
          setCustomer(c);
          setStep("details");
        }}
      />
    );
  }

  const meta = type ? getActivityMeta(type) : null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-ink">تأیید فعالیت</h1>
        <button
          type="button"
          onClick={() => setStep("customer")}
          className="text-sm text-ios-blue"
        >
          بازگشت
        </button>
      </div>

      <div className="rounded-3xl bg-pastel-lavender p-4 shadow-raised">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{meta?.icon}</span>
          <div>
            <div className="font-medium text-ink">{meta?.label}</div>
            <div className="text-sm text-ink-soft">
              {customer?.name} — {customer?.phone}
            </div>
          </div>
        </div>
      </div>

      {meta?.needsAmount && (
        <div className="space-y-3 rounded-3xl bg-surface p-5 shadow-raised">
          <span className="block text-sm text-ink-soft">مبلغ</span>
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
              placeholder="مثلاً 15000000"
              className="neo-input"
            />
          </div>
          <p className="text-xs text-ink-muted">
            واحد پول رو انتخاب کن و مبلغ رو وارد کن
          </p>
        </div>
      )}

      <div className="space-y-3 rounded-3xl bg-surface p-5 shadow-raised">
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
      </div>

      {error && (
        <div className="rounded-2xl bg-pastel-pink px-3 py-2 text-sm text-ios-red">
          {error}
        </div>
      )}

      <button
        type="button"
        onClick={submit}
        disabled={loading}
        className="btn-ios-green w-full"
      >
        {loading ? "در حال ثبت..." : "ثبت شد"}
      </button>
    </div>
  );
}

function CustomerPicker({
  onBack,
  onPick,
}: {
  onBack: () => void;
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
        <h1 className="text-xl font-bold text-ink">انتخاب مشتری</h1>
        <button
          type="button"
          onClick={onBack}
          className="text-sm text-ios-blue"
        >
          بازگشت
        </button>
      </div>

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
