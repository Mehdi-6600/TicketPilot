import Link from "next/link";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const session = await getSession();

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-slate-900">تنظیمات</h1>

      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <div className="mb-2 text-sm text-slate-500">کاربر فعال</div>
        <div className="font-medium text-slate-900">
          {session?.username ?? "—"}
        </div>
      </div>

      <div className="rounded-2xl bg-white p-4 text-sm text-slate-600 shadow-sm">
        تنظیمات بیشتر در نسخه‌های بعدی اضافه می‌شود.
      </div>

      <Link
        href="/today"
        className="block rounded-xl bg-slate-100 py-3 text-center text-sm text-slate-700"
      >
        بازگشت به امروز
      </Link>
    </div>
  );
}
