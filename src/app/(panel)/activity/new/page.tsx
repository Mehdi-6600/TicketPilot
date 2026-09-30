import Link from "next/link";

export default function NewActivityPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900">ثبت فعالیت</h1>
        <Link href="/today" className="text-sm text-brand-600">
          بازگشت
        </Link>
      </div>

      <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-8 text-center text-slate-500">
        فرم ثبت فعالیت در PHASE 6 ساخته می‌شود
      </div>
    </div>
  );
}
