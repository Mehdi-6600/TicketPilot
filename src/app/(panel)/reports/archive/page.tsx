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
        <h1 className="text-xl font-bold text-slate-900">آرشیو گزارش‌ها</h1>
        <Link href="/reports" className="text-sm text-brand-600">
          بازگشت
        </Link>
      </div>

      <p className="text-xs text-slate-500">
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
    </div>
  );
}
