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
      <div className="w-full max-w-sm rounded-3xl bg-surface p-6 text-center shadow-raised">
        <div className="mb-3 text-5xl">😔</div>
        <h1 className="mb-2 text-lg font-bold text-ink">
          یه مشکلی پیش اومد
        </h1>
        <p className="mb-5 text-sm text-ink-muted">
          لطفاً دوباره تلاش کن. اگه مشکل ادامه داشت به پشتیبانی بگو.
        </p>
        <div className="grid grid-cols-2 gap-2">
          <button type="button" onClick={reset} className="btn-ios-blue">
            تلاش مجدد
          </button>
          <Link href="/today" className="btn-ios-gray text-center">
            بازگشت
          </Link>
        </div>
      </div>
    </main>
  );
}
