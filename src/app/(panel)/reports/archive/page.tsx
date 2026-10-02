import Link from "next/link";
import { prisma } from "@/lib/prisma";
import EmptyState from "@/components/EmptyState";
import { toPersianDate, toPersianDateTime } from "@/lib/date";

export const dynamic = "force-dynamic";

export default async function ReportsArchivePage() {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  await prisma.dailyReport.deleteMany({
    where: { date: { lt: sixMonthsAgo } },
  });

  const reports = await prisma.dailyReport.findMany({
    orderBy: { date: "desc" },
    take: 200,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-ink">آرشیو گزارش‌ها</h1>
        <Link href="/reports" className="text-sm text-ios-blue">
          بازگشت
        </Link>
      </div>

      <p className="px-1 text-xs text-ink-muted">
        گزارش‌ها تا ۶ ماه نگهداری می‌شوند
      </p>

      {reports.length === 0 ? (
        <EmptyState icon="📁" title="آرشیو خالی است" />
      ) : (
        <ul className="space-y-2">
          {reports.map((r) => (
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
    </div>
  );
}
