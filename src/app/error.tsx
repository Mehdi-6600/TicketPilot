"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-sm">
        <div className="mb-3 text-5xl">😔</div>
        <h1 className="mb-2 text-lg font-bold text-slate-900">
          یه مشکلی پیش اومد
        </h1>
        <p className="mb-5 text-sm text-slate-500">
          لطفاً دوباره تلاش کن. اگه مشکل ادامه داشت به پشتیبانی بگو.
        </p>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={reset}
            className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-medium text-white"
          >
            تلاش مجدد
          </button>
          <Link
            href="/today"
            className="rounded-xl bg-slate-900 px-4 py-2 text-center text-sm font-medium text-white"
          >
            بازگشت
          </Link>
        </div>
      </div>
    </main>
  );
}
