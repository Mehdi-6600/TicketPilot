"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toPersianDate } from "@/lib/date";
import {
  TRAVEL_STATUS_LABELS,
  TRAVEL_STATUSES,
} from "@/lib/travel";
import ConfirmDelete from "@/components/ConfirmDelete";
import { Pencil } from "lucide-react";
import type { TravelStatus } from "@prisma/client";

type Props = {
  id: string;
  from: string;
  to: string;
  departDate: string;
  returnDate: string | null;
  status: TravelStatus;
  note: string | null;
  customer: { id: string; name: string; phone: string };
  showCustomer?: boolean;
};

const STATUS_TINT: Record<TravelStatus, string> = {
  BOOKED: "bg-pastel-blue",
  TICKETED: "bg-pastel-lavender",
  IN_TRIP: "bg-pastel-peach",
  RETURNED: "bg-pastel-mint",
  COMPLETED: "bg-surface",
};

export default function TravelItem({
  id,
  from,
  to,
  departDate,
  returnDate,
  status,
  note,
  customer,
  showCustomer = true,
}: Props) {
  const router = useRouter();
  const [currentStatus, setCurrentStatus] = useState<TravelStatus>(status);
  const [loading, setLoading] = useState(false);

  async function changeStatus(next: TravelStatus) {
    setLoading(true);
    try {
      const res = await fetch(`/api/travels/${id}`, {
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
    currentStatus === "BOOKED" || currentStatus === "TICKETED";
  const isInTrip = currentStatus === "IN_TRIP";
  const isDone =
    currentStatus === "RETURNED" || currentStatus === "COMPLETED";

  return (
    <div
      className={`relative rounded-3xl ${STATUS_TINT[currentStatus]} p-4 shadow-raised transition-all duration-200 active:shadow-pressed`}
    >
      {needsAction && (
        <span className="absolute right-3 top-3 h-2.5 w-2.5 animate-pulse-fast rounded-full bg-ios-orange" />
      )}
      {isInTrip && (
        <span className="absolute right-3 top-3 h-2.5 w-2.5 animate-pulse-fast rounded-full bg-ios-red" />
      )}
      {isDone && (
        <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-ios-green" />
      )}

      <div className="flex items-start justify-between gap-3 pr-5">
        <div className="flex-1">
          <div className="font-medium text-ink">
            {from} → {to}
          </div>

          <div className="mt-1 text-xs text-ink-muted">
            رفت: {toPersianDate(new Date(departDate))}
            {returnDate && ` — برگشت: ${toPersianDate(new Date(returnDate))}`}
          </div>

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

          <div className="mt-2">
            <span className="rounded-lg bg-white/70 px-2 py-1 text-xs font-medium text-ink-soft">
              {TRAVEL_STATUS_LABELS[currentStatus]}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-end gap-2">
        <Link
          href={`/travelers/${id}/edit`}
          className="flex items-center gap-1 rounded-xl bg-surface px-3 py-1.5 text-xs text-ink-soft shadow-raised-sm transition-all duration-150 active:scale-95 active:shadow-pressed"
        >
          <Pencil size={12} />
          <span>ویرایش</span>
        </Link>
        <ConfirmDelete url={`/api/travels/${id}`} />
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {TRAVEL_STATUSES.map((s) => (
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
            {TRAVEL_STATUS_LABELS[s]}
          </button>
        ))}
      </div>
    </div>
  );
}
