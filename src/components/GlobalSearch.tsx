"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Customer = { id: string; name: string; phone: string };
type Booking = {
  id: string;
  status: string;
  customer: { id: string; name: string };
  travel: { from: string; to: string } | null;
};
type Travel = {
  id: string;
  from: string;
  to: string;
  customer: { id: string; name: string };
};

export default function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [travels, setTravels] = useState<Travel[]>([]);

  useEffect(() => {
    if (!open) {
      setQ("");
      setCustomers([]);
      setBookings([]);
      setTravels([]);
      return;
    }
  }, [open]);

  useEffect(() => {
    if (q.trim().length < 2) {
      setCustomers([]);
      setBookings([]);
      setTravels([]);
      return;
    }
    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(q.trim())}`
        );
        const data = await res.json();
        if (res.ok) {
          setCustomers(data.customers ?? []);
          setBookings(data.bookings ?? []);
          setTravels(data.travels ?? []);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [q]);

  const empty =
    !loading &&
    q.trim().length >= 2 &&
    customers.length === 0 &&
    bookings.length === 0 &&
    travels.length === 0;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg px-2 py-1 text-slate-600 transition hover:bg-slate-100"
        aria-label="جستجو"
      >
        🔍
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4 pt-20">
          <div
            className="w-full max-w-lg rounded-2xl bg-white p-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center gap-2">
              <input
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="جستجو در مشتریان، رزروها، سفرها..."
                autoFocus
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 outline-none focus:border-brand-500 focus:bg-white"
              />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-xl bg-slate-100 px-3 py-2 text-sm text-slate-700"
              >
                بستن
              </button>
            </div>

            {q.trim().length < 2 && (
              <p className="py-4 text-center text-sm text-slate-500">
                حداقل ۲ حرف بنویس
              </p>
            )}

            {loading && (
              <p className="py-3 text-center text-sm text-slate-500">
                در حال جستجو...
              </p>
            )}

            {empty && (
              <p className="py-4 text-center text-sm text-slate-500">
                نتیجه‌ای پیدا نشد
              </p>
            )}

            <div className="max-h-[60vh] space-y-3 overflow-y-auto">
              {customers.length > 0 && (
                <div>
                  <div className="mb-1 px-1 text-xs font-medium text-slate-500">
                    مشتریان
                  </div>
                  <ul className="space-y-1">
                    {customers.map((c) => (
                      <li key={c.id}>
                        <Link
                          href={`/customers/${c.id}`}
                          onClick={() => setOpen(false)}
                          className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-sm hover:bg-slate-100"
                        >
                          <span>👤 {c.name}</span>
                          <span className="text-xs text-slate-500">
                            {c.phone}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {bookings.length > 0 && (
                <div>
                  <div className="mb-1 px-1 text-xs font-medium text-slate-500">
                    رزروها
                  </div>
                  <ul className="space-y-1">
                    {bookings.map((b) => (
                      <li key={b.id}>
                        <Link
                          href={`/customers/${b.customer.id}`}
                          onClick={() => setOpen(false)}
                          className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-sm hover:bg-slate-100"
                        >
                          <span>🎫 {b.customer.name}</span>
                          {b.travel && (
                            <span className="text-xs text-slate-500">
                              {b.travel.from} → {b.travel.to}
                            </span>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {travels.length > 0 && (
                <div>
                  <div className="mb-1 px-1 text-xs font-medium text-slate-500">
                    سفرها
                  </div>
                  <ul className="space-y-1">
                    {travels.map((t) => (
                      <li key={t.id}>
                        <Link
                          href={`/customers/${t.customer.id}`}
                          onClick={() => setOpen(false)}
                          className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-sm hover:bg-slate-100"
                        >
                          <span>✈️ {t.from} → {t.to}</span>
                          <span className="text-xs text-slate-500">
                            {t.customer.name}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
