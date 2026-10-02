"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toPersianDateTime } from "@/lib/date";
import ContactSheet from "@/components/ContactSheet";
import ConfirmDelete from "@/components/ConfirmDelete";
import { Pencil } from "lucide-react";

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

  const bgClass =
    overdue && status === "OPEN"
      ? "bg-pastel-peach"
      : isDone
        ? "bg-pastel-mint"
        : isCanceled
          ? "bg-surface opacity-70"
          : "bg-surface";

  return (
    <div
      className={`relative rounded-3xl ${bgClass} p-4 shadow-raised transition-all duration-200 active:shadow-pressed`}
    >
      {/* نقطه وضعیت */}
      {overdue && status === "OPEN" && (
        <span className="absolute right-3 top-3 h-2.5 w-2.5 animate-pulse-fast rounded-full bg-ios-red" />
      )}
      {!overdue && status === "OPEN" && (
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
          <div className="flex items-center gap-2">
            {isDone && <span>✅</span>}
            {isCanceled && <span>🚫</span>}
            <span
              className={`font-medium ${
                isDone
                  ? "text-ink-soft line-through"
                  : isCanceled
                    ? "text-ink-muted line-through"
                    : "text-ink"
              }`}
            >
              {title}
            </span>
          </div>
          <div className="mt-1 text-xs text-ink-muted">
            {toPersianDateTime(new Date(dueAt))}
          </div>
          <div className="mt-1 flex items-center gap-2 text-sm text-ink-soft">
            <Link href={`/customers/${customer.id}`}>
              {customer.name}
            </Link>
            <ContactSheet
              phone={customer.phone}
              customerName={customer.name}
              className="text-ios-blue underline decoration-dotted"
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
              className="btn-ios-green px-3 py-1.5 text-xs"
            >
              انجام شد
            </button>
          )}
          {(isDone || isCanceled) && (
            <button
              type="button"
              onClick={reopen}
              disabled={loading}
              className="btn-ios-gray px-3 py-1.5 text-xs"
            >
              بازگردانی
            </button>
          )}
          <Link
            href={`/followups/${id}/edit`}
            className="flex items-center justify-center gap-1 rounded-xl bg-surface px-3 py-1.5 text-xs text-ink-soft shadow-raised-sm transition-all duration-150 active:scale-95 active:shadow-pressed"
          >
            <Pencil size={12} />
          </Link>
          <ConfirmDelete url={`/api/followups/${id}`} />
        </div>
      </div>
    </div>
  );
}
