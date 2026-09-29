import { getSession } from "@/lib/auth";

export default async function TodayPage() {
  const session = await getSession();

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h1 className="text-xl font-bold text-slate-900">امروز</h1>
        <p className="mt-1 text-sm text-slate-500">
          خوش آمدی، {session?.username}
        </p>
      </div>

      <div className="rounded-2xl border-2 border-dashed border-slate-200 p-8 text-center text-slate-400">
        به‌زودی برنامه امروز اینجا نمایش داده می‌شود
      </div>
    </div>
  );
}
