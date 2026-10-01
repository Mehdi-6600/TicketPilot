"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toPersianDate } from "@/lib/date";
import {
  TRAVEL_STATUS_LABELS,
  TRAVEL_STATUS_COLORS,
  TRAVEL_STATUSES,
} from "@/lib/travel";
import ConfirmDelete from "@/components/ConfirmDelete";
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

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="font-medium text-slate-900">
            {from} → {to}
          </div>

          <div className="mt-1 text-xs text-slate-500">
            رفت: {toPersianDate(new Date(departDate))}
            {returnDate && ` — برگشت: ${toPersianDate(new Date(returnDate))}`}
          </div>

          {showCustomer && (
            <Link
              href={`/customers/${customer.id}`}
              className="mt-1 block text-sm text-slate-600"
            >
              {customer.name} — {customer.phone}
            </Link>
          )}

          {note && <div className="mt-2 text-sm text-slate-600">{note}</div>}

          <div className="mt-2">
            <span
              className={`inline-block rounded-lg px-2 py-1 text-xs ${
                TRAVEL_STATUS_COLORS[currentStatus]
              }`}
            >
              {TRAVEL_STATUS_LABELS[currentStatus]}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-end gap-2">
        <Link
          href={`/travelers/${id}/edit`}
          className="rounded-xl bg-slate-100 px-3 py-1.5 text-xs text-slate-700"
        >
          ✏️ ویرایش
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
            className={`rounded-lg px-2.5 py-1 text-xs transition ${
              s === currentStatus
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            } disabled:opacity-60`}
          >
            {TRAVEL_STATUS_LABELS[s]}
          </button>
        ))}
      </div>
    </div>
  );
}
