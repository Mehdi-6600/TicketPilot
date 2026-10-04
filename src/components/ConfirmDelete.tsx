"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

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
      if (redirectTo) router.push(redirectTo);
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
          "flex items-center gap-1 rounded-2xl border border-white/60 bg-plush-danger px-3 py-1.5 text-xs font-medium text-white shadow-plush-sm transition-all duration-150 active:scale-95 active:shadow-plush-pressed"
        }
      >
        {children ?? (
          <>
            <Trash2 size={14} />
            <span>حذف</span>
          </>
        )}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-navy/40 p-4 backdrop-blur-md"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-4xl border border-white/70 bg-plush-surface p-5 shadow-plush-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 text-base font-bold text-ink">
              تأیید حذف
            </div>
            <p className="mb-4 text-sm text-ink-soft">{message}</p>

            {error && (
              <div className="mb-3 rounded-2xl border border-white/60 bg-status-dangerSoft px-3 py-2 text-sm text-status-danger">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={loading}
                className="btn-plush"
              >
                لغو
              </button>
              <button
                type="button"
                onClick={onDelete}
                disabled={loading}
                className="btn-plush-danger"
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
