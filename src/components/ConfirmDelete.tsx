"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  url: string;
  message?: string;
  redirectTo?: string;
  className?: string;
  children?: React.ReactNode;
};

export default function ConfirmDelete({
  url,
  message = "آیا از حذف این مورد مطمئنی؟",
  redirectTo,
  className,
  children,
}: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onDelete() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(url, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "خطا در حذف");
        setLoading(false);
        return;
      }
      setOpen(false);
      if (redirectTo) {
        router.push(redirectTo);
      }
      router.refresh();
    } catch {
      setError("خطای شبکه");
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          className ??
          "rounded-xl bg-red-50 px-3 py-1.5 text-xs text-red-700"
        }
      >
        {children ?? "🗑️ حذف"}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 text-base font-bold text-slate-900">
              تأیید حذف
            </div>
            <p className="mb-4 text-sm text-slate-600">{message}</p>

            {error && (
              <div className="mb-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={loading}
                className="rounded-xl bg-slate-100 py-2.5 text-sm text-slate-700 disabled:opacity-60"
              >
                لغو
              </button>
              <button
                type="button"
                onClick={onDelete}
                disabled={loading}
                className="rounded-xl bg-red-600 py-2.5 text-sm font-medium text-white disabled:opacity-60"
              >
                {loading ? "..." : "حذف کن"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
