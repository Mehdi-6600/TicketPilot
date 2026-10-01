"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toPersianDate } from "@/lib/date";
import { formatAmount } from "@/lib/format";
import {
  BOOKING_STATUS_LABELS,
  BOOKING_STATUS_COLORS,
  BOOKING_STATUSES,
} from "@/lib/booking";
import ConfirmDelete from "@/components/ConfirmDelete";
import type { BookingStatus } from "@prisma/client";

type Props = {
  id: string;
  status: BookingStatus;
  amount: number | null;
  currency: "TOMAN" | "OMR" | "USD";
  note: string | null;
  customer: { id: string; name: string; phone: string };
  travel: {
    id: string;
    from: string;
    to: string;
    departDate: string;
  } | null;
  showCustomer?: boolean;
};

export default function BookingItem({
  id,
  status,
  amount,
  currency,
  note,
  customer,
  travel,
  showCustomer = true,
}: Props) {
  const router = useRouter();
  const [currentStatus, setCurrentStatus] = useState<BookingStatus>(status);
  const [loading, setLoading] = useState(false);

  async function changeStatus(next: BookingStatus) {
    setLoading(true);
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      if (res.ok) {
        setCurrentStatus(next);
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  const needsAction =
    currentStatus === "INQUIRY" ||
    currentStatus === "PRICE_QUOTED" ||
    currentStatus === "WAITING_CUSTOMER";

  const isDone = currentStatus === "SOLD";
  const isCanceled = currentStatus === "CANCELED";

  return (
    <div className="relative rounded-2xl bg-white p-4 shadow-sm">
      {needsAction && (
        <span className="absolute right-3 top-3 h-2.5 w-2.5 animate-pulse-fast rounded-full bg-amber-500" />
      )}
      {isDone && (
        <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-emerald-500" />
      )}
      {isCanceled && (
        <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-slate-400" />
      )}

      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 pr-5">
            <span
              className={`inline-block rounded-lg px-2 py-0.5 text-xs ${
                BOOKING_STATUS_COLORS[currentStatus]
              }`}
            >
              {BOOKING_STATUS_LABELS[currentStatus]}
            </span>
            {amount !== null && (
              <span className="text-sm font-medium text-emerald-700">
                {formatAmount(amount, currency)}
              </span>
            )}
          </div>

          {travel && (
            <div className="mt-2 text-sm text-slate-700">
              ✈️ {travel.from} → {travel.to}
              <span className="mr-2 text-xs text-slate-500">
                ({toPersianDate(new Date(travel.departDate))})
              </span>
            </div>
          )}

          {showCustomer && (
            <Link
              href={`/customers/${customer.id}`}
              className="mt-1 block text-sm text-slate-600"
            >
              {customer.name} — {customer.phone}
            </Link>
          )}

          {note && <div className="mt-2 text-sm text-slate-600">{note}</div>}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-end gap-2">
        <Link
          href={`/bookings/${id}/edit`}
          className="rounded-xl bg-slate-100 px-3 py-1.5 text-xs text-slate-700"
        >
          ✏️ ویرایش
        </Link>
        <ConfirmDelete url={`/api/bookings/${id}`} />
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {BOOKING_STATUSES.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => changeStatus(s)}
            disabled={loading || s === currentStatus}
            className={`rounded-lg px-2.5 py-1 text-xs transition ${
              s === currentStatus
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            } disabled:opacity-60`}
          >
            {BOOKING_STATUS_LABELS[s]}
          </button>
        ))}
      </div>
    </div>
  );
}
