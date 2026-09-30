"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ACTIVITY_TYPES, getActivityMeta } from "@/lib/activity";
import type { ActivityType } from "@prisma/client";

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
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // اگر customerId پاس داده شده، مستقیم انتخابش کن
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

  // مرحله ۱: نوع فعالیت
  if (step === "type") {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-900">ثبت فعالیت</h1>
          <Link href="/today" className="text-sm text-brand-600">
            بازگشت
          </Link>
        </div>

        <p className="text-sm text-slate-500">نوع فعالیت رو انتخاب کن</p>

        <div className="grid grid-cols-2 gap-2">
          {ACTIVITY_TYPES.map((a) => (
            <button
              key={a.type}
              type="button"
              onClick={() => {
                setType(a.type);
                setStep("customer");
              }}
              className="flex flex-col items-center justify-center gap-1 rounded-2xl bg-white p-4 shadow-sm transition active:scale-[0.97]"
            >
              <span className="text-2xl">{a.icon}</span>
              <span className="text-sm font-medium text-slate-800">
                {a.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // مرحله ۲: انتخاب مشتری
  if (step === "customer") {
    return (
      <CustomerPicker
        onBack={() => setStep("type")}
        onPick={(c) => {
          setCustomer(c);
          const meta = type ? getActivityMeta(type) : null;
          if (meta?.needsAmount) {
            setStep("details");
          } else {
            setStep("details");
          }
        }}
      />
    );
  }

  // مرحله ۳: جزئیات و ذخیره
  const meta = type ? getActivityMeta(type) : null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900">تأیید فعالیت</h1>
        <button
          type="button"
          onClick={() => setStep("customer")}
          className="text-sm text-brand-600"
        >
          بازگشت
        </button>
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{meta?.icon}</span>
          <div>
            <div className="font-medium text-slate-900">{meta?.label}</div>
            <div className="text-sm text-slate-500">
              {customer?.name} — {customer?.phone}
            </div>
          </div>
        </div>
      </div>

      {meta?.needsAmount && (
        <label className="block">
          <span className="mb-1 block text-sm text-slate-600">
            مبلغ (تومان)
          </span>
          <input
            type="text"
            inputMode="numeric"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="مثلاً ۱۵۰۰۰۰۰۰"
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none focus:border-brand-500"
          />
        </label>
      )}

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
        type="button"
        onClick={submit}
        disabled={loading}
        className="w-full rounded-xl bg-brand-600 py-3 font-medium text-white disabled:opacity-60"
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
        <h1 className="text-xl font-bold text-slate-900">انتخاب مشتری</h1>
        <button
          type="button"
          onClick={onBack}
          className="text-sm text-brand-600"
        >
          بازگشت
        </button>
      </div>

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
            <Link
              href="/customers/new"
              className="text-sm text-brand-600"
            >
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
