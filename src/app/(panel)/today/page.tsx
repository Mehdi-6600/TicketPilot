import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import StatCard from "@/components/StatCard";
import EmptyState from "@/components/EmptyState";
import {
  startOfTodayTehran,
  endOfTodayTehran,
  endOfTomorrowTehran,
  toPersianDate,
  toPersianDateTime,
} from "@/lib/date";
import { formatNumber } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function TodayPage() {
  const session = await getSession();

  const todayStart = startOfTodayTehran();
  const todayEnd = endOfTodayTehran();
  const tomorrowEnd = endOfTomorrowTehran();

  const [
    callsToday,
    followUpsToday,
    followUpsOverdue,
    bookingsToday,
    salesToday,
    upcomingTravels,
  ] = await Promise.all([
    prisma.activity.count({
      where: {
        type: "CALL",
        createdAt: { gte: todayStart, lte: todayEnd },
      },
    }),
    prisma.followUp.findMany({
      where: {
        status: "OPEN",
        dueAt: { gte: todayStart, lte: todayEnd },
      },
      include: { customer: true },
      orderBy: { dueAt: "asc" },
      take: 5,
    }),
    prisma.followUp.findMany({
      where: {
        status: "OPEN",
        dueAt: { lt: todayStart },
      },
      include: { customer: true },
      orderBy: { dueAt: "asc" },
      take: 5,
    }),
    prisma.booking.count({
      where: {
        createdAt: { gte: todayStart, lte: todayEnd },
      },
    }),
    prisma.activity.count({
      where: {
        type: "SALE",
        createdAt: { gte: todayStart, lte: todayEnd },
      },
    }),
    prisma.travel.findMany({
      where: {
        departDate: { gte: todayStart, lte: tomorrowEnd },
        status: { in: ["BOOKED", "TICKETED"] },
      },
      include: { customer: true },
      orderBy: { departDate: "asc" },
      take: 5,
    }),
  ]);

  const overdueCount = followUpsOverdue.length;

  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">امروز</h1>
            <p className="mt-1 text-sm text-slate-500">
              {session?.username} — {toPersianDate(new Date())}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/activity/new"
          className="flex items-center justify-center gap-2 rounded-2xl bg-brand-600 px-4 py-3 font-medium text-white shadow-sm transition active:scale-[0.98]"
        >
          <span className="text-lg">＋</span>
          <span>ثبت فعالیت</span>
        </Link>
        <Link
          href="/customers/new"
          className="flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 font-medium text-white shadow-sm transition active:scale-[0.98]"
        >
          <span className="text-lg">＋</span>
          <span>مشتری جدید</span>
        </Link>
      </div>

      <Link
        href="/reports/new"
        className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 font-medium text-white shadow-sm transition active:scale-[0.98]"
      >
        <span className="text-lg">📝</span>
        <span>گزارش روز را بنویس</span>
      </Link>

      <Link
        href="/plan"
        className="flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-4 py-3 font-medium text-white shadow-sm transition active:scale-[0.98]"
      >
        <span className="text-lg">📋</span>
        <span>برنامه کاری روز</span>
      </Link>

      {overdueCount > 0 && (
        <Link
          href="/followups?filter=overdue"
          className="flex items-center justify-between rounded-2xl bg-amber-50 px-4 py-3 text-amber-800 shadow-sm"
        >
          <span>🔔 {formatNumber(overdueCount)} پیگیری عقب‌افتاده</span>
          <span>›</span>
        </Link>
      )}

      <div className="grid grid-cols-2 gap-3">
        <StatCard
          label="تماس امروز"
          value={formatNumber(callsToday)}
          icon="📞"
        />
        <StatCard
          label="پیگیری امروز"
          value={formatNumber(followUpsToday.length)}
          icon="🔔"
        />
        <StatCard
          label="سفر نزدیک"
          value={formatNumber(upcomingTravels.length)}
          icon="✈️"
        />
        <StatCard
          label="رزرو امروز"
          value={formatNumber(bookingsToday)}
          icon="🎫"
        />
        <StatCard
          label="فروش امروز"
          value={formatNumber(salesToday)}
          icon="💰"
          tone="success"
        />
      </div>

      <section>
        <div className="mb-2 flex items-center justify-between px-1">
          <h2 className="font-semibold text-slate-800">پیگیری‌های امروز</h2>
          <Link href="/followups" className="text-sm text-brand-600">
            همه
          </Link>
        </div>

        {followUpsToday.length === 0 ? (
          <EmptyState
            icon="✅"
            title="پیگیری‌ای برای امروز نیست"
            description="برنامه امروزت خالیه"
          />
        ) : (
          <ul className="space-y-2">
            {followUpsToday.map((f) => (
              <li
                key={f.id}
                className="rounded-2xl bg-white p-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="font-medium text-slate-800">{f.title}</div>
                  <div className="text-xs text-slate-500">
                    {toPersianDateTime(f.dueAt)}
                  </div>
                </div>
                <div className="mt-1 text-sm text-slate-500">
                  {f.customer.name} — {f.customer.phone}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <div className="mb-2 flex items-center justify-between px-1">
          <h2 className="font-semibold text-slate-800">سفرهای نزدیک</h2>
          <Link href="/travelers" className="text-sm text-brand-600">
            همه
          </Link>
        </div>

        {upcomingTravels.length === 0 ? (
          <EmptyState
            icon="✈️"
            title="سفر نزدیکی نیست"
            description="سفرهای امروز و فردا اینجا نمایش داده می‌شوند"
          />
        ) : (
          <ul className="space-y-2">
            {upcomingTravels.map((t) => (
              <li
                key={t.id}
                className="rounded-2xl bg-white p-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="font-medium text-slate-800">
                    {t.from} → {t.to}
                  </div>
                  <div className="text-xs text-slate-500">
                    {toPersianDateTime(t.departDate)}
                  </div>
                </div>
                <div className="mt-1 text-sm text-slate-500">
                  {t.customer.name} — {t.customer.phone}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {overdueCount > 0 && (
        <section>
          <div className="mb-2 flex items-center justify-between px-1">
            <h2 className="font-semibold text-amber-700">
              پیگیری‌های عقب‌افتاده
            </h2>
          </div>

          <ul className="space-y-2">
            {followUpsOverdue.map((f) => (
              <li
                key={f.id}
                className="rounded-2xl bg-amber-50 p-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="font-medium text-amber-900">{f.title}</div>
                  <div className="text-xs text-amber-700">
                    {toPersianDateTime(f.dueAt)}
                  </div>
                </div>
                <div className="mt-1 text-sm text-amber-800">
                  {f.customer.name} — {f.customer.phone}
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
