"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";

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
        className="rounded-xl p-2 text-ink-muted transition-all duration-150 hover:bg-white/60 active:scale-95"
        aria-label="جستجو"
      >
        <Search size={20} strokeWidth={2} />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4 pt-20 backdrop-blur-sm">
          <div
            className="w-full max-w-lg rounded-3xl border border-white/60 bg-white/95 p-4 shadow-card backdrop-blur-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center gap-2">
              <div className="relative flex-1">
                <Search
                  size={18}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted"
                />
                <input
                  type="text"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="جستجو در مشتریان، رزروها، سفرها..."
                  autoFocus
                  className="input-soft pr-10"
                />
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="btn-ios-gray px-3 py-2.5"
              >
                <X size={18} />
              </button>
            </div>

            {q.trim().length < 2 && (
              <p className="py-4 text-center text-sm text-ink-muted">
                حداقل ۲ حرف بنویس
              </p>
            )}

            {loading && (
              <p className="py-3 text-center text-sm text-ink-muted">
                در حال جستجو...
              </p>
            )}

            {empty && (
              <p className="py-4 text-center text-sm text-ink-muted">
                نتیجه‌ای پیدا نشد
              </p>
            )}

            <div className="max-h-[60vh] space-y-3 overflow-y-auto">
              {customers.length > 0 && (
                <div>
                  <div className="mb-1 px-1 text-xs font-medium text-ink-muted">
                    مشتریان
                  </div>
                  <ul className="space-y-1">
                    {customers.map((c) => (
                      <li key={c.id}>
                        <Link
                          href={`/customers/${c.id}`}
                          onClick={() => setOpen(false)}
                          className="flex items-center justify-between rounded-2xl bg-pastel-lavenderLight px-3 py-2.5 text-sm transition-all duration-150 hover:bg-pastel-lavender active:scale-[0.98]"
                        >
                          <span className="text-ink">👤 {c.name}</span>
                          <span className="text-xs text-ink-muted">
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
                  <div className="mb-1 px-1 text-xs font-medium text-ink-muted">
                    رزروها
                  </div>
                  <ul className="space-y-1">
                    {bookings.map((b) => (
                      <li key={b.id}>
                        <Link
                          href={`/customers/${b.customer.id}`}
                          onClick={() => setOpen(false)}
                          className="flex items-center justify-between rounded-2xl bg-pastel-pinkLight px-3 py-2.5 text-sm transition-all duration-150 hover:bg-pastel-pink active:scale-[0.98]"
                        >
                          <span className="text-ink">🎫 {b.customer.name}</span>
                          {b.travel && (
                            <span className="text-xs text-ink-muted">
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
                  <div className="mb-1 px-1 text-xs font-medium text-ink-muted">
                    سفرها
                  </div>
                  <ul className="space-y-1">
                    {travels.map((t) => (
                      <li key={t.id}>
                        <Link
                          href={`/customers/${t.customer.id}`}
                          onClick={() => setOpen(false)}
                          className="flex items-center justify-between rounded-2xl bg-pastel-blueLight px-3 py-2.5 text-sm transition-all duration-150 hover:bg-pastel-blue active:scale-[0.98]"
                        >
                          <span className="text-ink">✈️ {t.from} → {t.to}</span>
                          <span className="text-xs text-ink-muted">
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
