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
        <h1 className="text-xl font-bold text-ink">گزارش روز</h1>
        <Link href="/today" className="text-sm text-ios-blue">
          امروز
        </Link>
      </div>

      <div className="rounded-3xl bg-surface p-5 shadow-raised">
        <div className="mb-1 text-sm text-ink-muted">گزارش امروز</div>
        <div className="mb-3 font-bold text-ink">
          {toPersianDate(new Date())}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Link
            href={`/reports/${todayReport ? todayReport.id : "new"}`}
            className="btn-ios-green px-3 py-2.5 text-center text-sm"
          >
            {todayReport ? "مشاهده گزارش امروز" : "📝 گزارش روز را بنویس"}
          </Link>
          <Link
            href="/reports/archive"
            className="btn-ios-gray px-3 py-2.5 text-center text-sm"
          >
            📁 آرشیو
          </Link>
        </div>
      </div>

      <section>
        <h2 className="mb-2 px-1 font-semibold text-ink">گزارش‌های اخیر</h2>

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
                  className="flex items-center justify-between rounded-3xl bg-surface p-4 shadow-raised transition-all duration-200 active:scale-[0.99] active:shadow-pressed"
                >
                  <div>
                    <div className="font-medium text-ink">
                      {toPersianDate(r.date)}
                    </div>
                    <div className="mt-1 text-xs text-ink-muted">
                      آخرین ویرایش: {toPersianDateTime(r.updatedAt)}
                    </div>
                  </div>
                  <span className="text-ink-faint">›</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
