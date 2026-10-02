import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-3xl bg-surface p-6 text-center shadow-raised">
        <div className="mb-3 text-5xl">🔍</div>
        <h1 className="mb-2 text-lg font-bold text-ink">صفحه پیدا نشد</h1>
        <p className="mb-5 text-sm text-ink-muted">
          آدرسی که دنبالش بودی وجود نداره یا حذف شده.
        </p>
        <Link href="/today" className="btn-ios-blue inline-block">
          بازگشت به امروز
        </Link>
      </div>
    </main>
  );
}
