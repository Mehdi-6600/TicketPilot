import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatAmount, formatNumber } from "@/lib/format";
import EmptyState from "@/components/EmptyState";

export const dynamic = "force-dynamic";

export default async function SalesPage() {
  // ۳۰ روز اخیر
  const since = new Date();
  since.setDate(since.getDate() - 30);

  const activities = await prisma.activity.findMany({
    where: {
      type: "SALE",
      createdAt: { gte: since },
    },
    include: {
      customer: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const totals = { TOMAN: 0, OMR: 0, USD: 0 };
  const counts = { TOMAN: 0, OMR: 0, USD: 0 };

  for (const a of activities) {
    if (a.amount === null) continue;
    totals[a.currency] += a.amount;
    counts[a.currency] += 1;
  }

  const totalCount = activities.length;
  const withAmount = activities.filter((a) => a.amount !== null).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900">
          📊 فروش ۳۰ روز اخیر
        </h1>
        <Link href="/today" className="text-sm text-brand-600">
          امروز
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <div className="mb-1 text-xs text-slate-500">
            🇮🇷 فروش تومانی
          </div>
          <div className="text-xl font-bold text-slate-900">
            {formatAmount(totals.TOMAN, "TOMAN")}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            تعداد: {formatNumber(counts.TOMAN)}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <div className="mb-1 text-xs text-slate-500">
            🇴🇲 فروش ریال عمان
          </div>
          <div className="text-xl font-bold text-slate-900">
            {formatAmount(totals.OMR, "OMR")}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            تعداد: {formatNumber(counts.OMR)}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <div className="mb-1 text-xs text-slate-500">
            🇺🇸 فروش دلاری
          </div>
          <div className="text-xl font-bold text-slate-900">
            {formatAmount(totals.USD, "USD")}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            تعداد: {formatNumber(counts.USD)}
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-slate-900 p-4 text-white shadow-sm">
        <div className="text-xs text-slate-300">مجموع فروش‌ها</div>
        <div className="text-2xl font-bold">{formatNumber(totalCount)}</div>
        <div className="mt-1 text-xs text-slate-300">
          (از این تعداد، {formatNumber(withAmount)} مورد مبلغ ثبت شده)
        </div>
      </div>

      <section>
        <h2 className="mb-2 font-semibold text-slate-800">
          آخرین فروش‌های ثبت‌شده
        </h2>

        {activities.length === 0 ? (
          <EmptyState
            icon="📊"
            title="فروشی در ۳۰ روز اخیر ثبت نشده"
          />
        ) : (
          <ul className="space-y-2">
            {activities.slice(0, 30).map((a) => (
              <li
                key={a.id}
                className="rounded-2xl bg-white p-3 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-800">
                    💵 {a.customer?.name ?? "—"}
                  </span>
                  {a.amount !== null && (
                    <span className="text-sm font-medium text-emerald-700">
                      {formatAmount(a.amount, a.currency)}
                    </span>
                  )}
                </div>
                {a.note && (
                  <div className="mt-1 text-xs text-slate-500">
                    📝 {a.note}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
