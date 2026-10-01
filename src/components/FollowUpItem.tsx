"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toPersianDateTime } from "@/lib/date";
import ContactSheet from "@/components/ContactSheet";
import ConfirmDelete from "@/components/ConfirmDelete";

type Props = {
  id: string;
  title: string;
  dueAt: string;
  status: "OPEN" | "DONE" | "CANCELED";
  customer: { id: string; name: string; phone: string };
  overdue?: boolean;
};

export default function FollowUpItem({
  id,
  title,
  dueAt,
  status,
  customer,
  overdue = false,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function markDone() {
    setLoading(true);
    try {
      await fetch(`/api/followups/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "done" }),
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  async function reopen() {
    setLoading(true);
    try {
      await fetch(`/api/followups/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reopen" }),
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  const isDone = status === "DONE";
  const isCanceled = status === "CANCELED";

  return (
    <div
      className={`rounded-2xl p-4 shadow-sm ${
        overdue && status === "OPEN"
          ? "bg-amber-50"
          : isDone
            ? "bg-emerald-50"
            : isCanceled
              ? "bg-slate-100 opacity-70"
              : "bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            {isDone && <span>✅</span>}
            {isCanceled && <span>🚫</span>}
            {overdue && status === "OPEN" && <span>⚠️</span>}
            <span
              className={`font-medium ${
                isDone
                  ? "text-emerald-800 line-through"
                  : isCanceled
                    ? "text-slate-500 line-through"
                    : overdue
                      ? "text-amber-900"
                      : "text-slate-900"
              }`}
            >
              {title}
            </span>
          </div>
          <div className="mt-1 text-xs text-slate-500">
            {toPersianDateTime(new Date(dueAt))}
          </div>
          <div className="mt-1 flex items-center gap-2 text-sm text-slate-600">
            <Link href={`/customers/${customer.id}`}>
              {customer.name}
            </Link>
            <ContactSheet
              phone={customer.phone}
              customerName={customer.name}
              className="text-brand-700 underline decoration-dotted"
            >
              {customer.phone}
            </ContactSheet>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {status === "OPEN" && (
            <button
              type="button"
              onClick={markDone}
              disabled={loading}
              className="rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-60"
            >
              انجام شد
            </button>
          )}
          {(isDone || isCanceled) && (
            <button
              type="button"
              onClick={reopen}
              disabled={loading}
              className="rounded-xl bg-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 disabled:opacity-60"
            >
              بازگردانی
            </button>
          )}
          <Link
            href={`/followups/${id}/edit`}
            className="rounded-xl bg-slate-100 px-3 py-1.5 text-center text-xs text-slate-700"
          >
            ✏️ ویرایش
          </Link>
          <ConfirmDelete url={`/api/followups/${id}`} />
        </div>
      </div>
    </div>
  );
}
