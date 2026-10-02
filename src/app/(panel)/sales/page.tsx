import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatAmount, formatNumber } from "@/lib/format";
import EmptyState from "@/components/EmptyState";

export const dynamic = "force-dynamic";

export default async function SalesPage() {
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
        <h1 className="text-xl font-bold text-ink">📊 فروش ۳۰ روز اخیر</h1>
        <Link href="/today" className="text-sm text-ios-blue">
          امروز
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <div className="rounded-3xl bg-pastel-mint p-4 shadow-raised">
          <div className="mb-1 text-xs text-ink-muted">🇮🇷 فروش تومانی</div>
          <div className="text-xl font-bold text-ink">
            {formatAmount(totals.TOMAN, "TOMAN")}
          </div>
          <div className="mt-1 text-xs text-ink-soft">
            تعداد: {formatNumber(counts.TOMAN)}
          </div>
        </div>

        <div className="rounded-3xl bg-pastel-peach p-4 shadow-raised">
          <div className="mb-1 text-xs text-ink-muted">
            🇴🇲 فروش ریال عمان
          </div>
          <div className="text-xl font-bold text-ink">
            {formatAmount(totals.OMR, "OMR")}
          </div>
          <div className="mt-1 text-xs text-ink-soft">
            تعداد: {formatNumber(counts.OMR)}
          </div>
        </div>

        <div className="rounded-3xl bg-pastel-blue p-4 shadow-raised">
          <div className="mb-1 text-xs text-ink-muted">🇺🇸 فروش دلاری</div>
          <div className="text-xl font-bold text-ink">
            {formatAmount(totals.USD, "USD")}
          </div>
          <div className="mt-1 text-xs text-ink-soft">
            تعداد: {formatNumber(counts.USD)}
          </div>
        </div>
      </div>

      <div className="rounded-3xl bg-ink p-4 text-white shadow-raised">
        <div className="text-xs text-slate-300">مجموع فروش‌ها</div>
        <div className="text-2xl font-bold">{formatNumber(totalCount)}</div>
        <div className="mt-1 text-xs text-slate-300">
          (از این تعداد، {formatNumber(withAmount)} مورد مبلغ ثبت شده)
        </div>
      </div>

      <section>
        <h2 className="mb-2 px-1 font-semibold text-ink">
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
                className="rounded-2xl bg-surface p-3 shadow-raised-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-ink">
                    💵 {a.customer?.name ?? "—"}
                  </span>
                  {a.amount !== null && (
                    <span className="text-sm font-bold text-ios-green">
                      {formatAmount(a.amount, a.currency)}
                    </span>
                  )}
                </div>
                {a.note && (
                  <div className="mt-1 text-xs text-ink-soft">
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
