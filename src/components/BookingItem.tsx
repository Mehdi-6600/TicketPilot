"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toPersianDate } from "@/lib/date";
import { formatAmount } from "@/lib/format";
import {
  BOOKING_STATUS_LABELS,
  BOOKING_STATUSES,
} from "@/lib/booking";
import ConfirmDelete from "@/components/ConfirmDelete";
import { Pencil } from "lucide-react";
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

const STATUS_TINT: Record<BookingStatus, string> = {
  INQUIRY: "bg-pastel-lavender",
  PRICE_QUOTED: "bg-pastel-blue",
  WAITING_CUSTOMER: "bg-pastel-peach",
  BOOKED: "bg-pastel-blue",
  TICKETED: "bg-pastel-mint",
  SOLD: "bg-pastel-mint",
  CANCELED: "bg-surface",
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
    <div
      className={`relative rounded-3xl ${STATUS_TINT[currentStatus]} p-4 shadow-raised transition-all duration-200 active:shadow-pressed`}
    >
      {needsAction && (
        <span className="absolute right-3 top-3 h-2.5 w-2.5 animate-pulse-fast rounded-full bg-ios-orange" />
      )}
      {isDone && (
        <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-ios-green" />
      )}
      {isCanceled && (
        <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-ios-gray" />
      )}

      <div className="flex items-start justify-between gap-3 pr-5">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-lg bg-white/70 px-2 py-0.5 text-xs font-medium text-ink-soft">
              {BOOKING_STATUS_LABELS[currentStatus]}
            </span>
            {amount !== null && (
              <span className="text-sm font-bold text-ios-green">
                {formatAmount(amount, currency)}
              </span>
            )}
          </div>

          {travel && (
            <div className="mt-2 text-sm text-ink-soft">
              ✈️ {travel.from} → {travel.to}
              <span className="mr-2 text-xs text-ink-muted">
                ({toPersianDate(new Date(travel.departDate))})
              </span>
            </div>
          )}

          {showCustomer && (
            <Link
              href={`/customers/${customer.id}`}
              className="mt-1 block text-sm text-ink-soft"
            >
              {customer.name} — {customer.phone}
            </Link>
          )}

          {note && (
            <div className="mt-2 text-sm text-ink-soft">{note}</div>
          )}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-end gap-2">
        <Link
          href={`/bookings/${id}/edit`}
          className="flex items-center gap-1 rounded-xl bg-surface px-3 py-1.5 text-xs text-ink-soft shadow-raised-sm transition-all duration-150 active:scale-95 active:shadow-pressed"
        >
          <Pencil size={12} />
          <span>ویرایش</span>
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
            className={`rounded-lg px-2.5 py-1 text-xs transition-all duration-150 ${
              s === currentStatus
                ? "bg-ink text-white shadow-raised-sm"
                : "bg-surface/80 text-ink-soft shadow-raised-sm hover:bg-surface active:scale-95 active:shadow-pressed"
            } disabled:opacity-60`}
          >
            {BOOKING_STATUS_LABELS[s]}
          </button>
        ))}
      </div>
    </div>
  );
}
