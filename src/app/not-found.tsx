import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-sm">
        <div className="mb-3 text-5xl">🔍</div>
        <h1 className="mb-2 text-lg font-bold text-slate-900">
          صفحه پیدا نشد
        </h1>
        <p className="mb-5 text-sm text-slate-500">
          آدرسی که دنبالش بودی وجود نداره یا حذف شده.
        </p>
        <Link
          href="/today"
          className="inline-block rounded-xl bg-brand-600 px-4 py-2 text-sm font-medium text-white"
        >
          بازگشت به امروز
        </Link>
      </div>
    </main>
  );
}
