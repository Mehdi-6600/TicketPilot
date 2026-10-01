import Link from "next/link";
import { prisma } from "@/lib/prisma";
import EmptyState from "@/components/EmptyState";
import {
  toPersianDate,
  toPersianDateTime,
  startOfTodayTehran,
  toTehranInputValue,
} from "@/lib/date";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  await prisma.dailyReport.deleteMany({
    where: { date: { lt: sixMonthsAgo } },
  });

  const reports = await prisma.dailyReport.findMany({
    orderBy: { date: "desc" },
    take: 200,
  });

  const todayDate = new Date(
    toTehranInputValue(startOfTodayTehran()).slice(0, 10)
  );
  const todayReport = reports.find(
    (r) => r.date.getTime() === todayDate.getTime()
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900">گزارش روز</h1>
        <Link href="/today" className="text-sm text-brand-600">
          امروز
        </Link>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="mb-1 text-sm text-slate-500">گزارش امروز</div>
        <div className="mb-3 font-medium text-slate-900">
          {toPersianDate(new Date())}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Link
            href={`/reports/${todayReport ? todayReport.id : "new"}`}
            className="rounded-xl bg-brand-600 px-3 py-2.5 text-center text-sm font-medium text-white"
          >
            {todayReport ? "مشاهده گزارش امروز" : "📝 گزارش روز را بنویس"}
          </Link>
          <Link
            href="/reports/archive"
            className="rounded-xl bg-slate-900 px-3 py-2.5 text-center text-sm font-medium text-white"
          >
            📁 آرشیو گزارش‌ها
          </Link>
        </div>
      </div>

      <section>
        <h2 className="mb-2 font-semibold text-slate-800">گزارش‌های اخیر</h2>

        {reports.length === 0 ? (
          <EmptyState
            icon="📝"
            title="هنوز گزارشی ساخته نشده"
            description="با دکمه بالا اولین گزارش رو بساز"
          />
        ) : (
          <ul className="space-y-2">
            {reports.slice(0, 7).map((r) => (
              <li key={r.id}>
                <Link
                  href={`/reports/${r.id}`}
                  className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm"
                >
                  <div>
                    <div className="font-medium text-slate-900">
                      {toPersianDate(r.date)}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      آخرین ویرایش: {toPersianDateTime(r.updatedAt)}
                    </div>
                  </div>
                  <span className="text-slate-400">›</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
