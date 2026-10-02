import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import StatPill from "@/components/StatPill";
import EmptyState from "@/components/EmptyState";
import ContactSheet from "@/components/ContactSheet";
import Avatar from "@/components/Avatar";
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
    bookingsWaiting,
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
    prisma.booking.count({
      where: {
        status: { in: ["INQUIRY", "PRICE_QUOTED", "WAITING_CUSTOMER"] },
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
      {/* کارت «امروز» — با عکس پروفایل */}
      <div className="neo-card overflow-hidden p-0">
        <div className="flex items-stretch">
          <div className="flex-shrink-0 p-3">
            <Avatar name={session?.username ?? "؟"} size="xl" />
          </div>
          <div className="flex flex-1 flex-col items-end justify-center px-4 py-3">
            <h1 className="text-2xl font-bold text-ink">امروز</h1>
            <p className="mt-1 text-sm text-ink-muted">
              {session?.username} — {toPersianDate(new Date())}
            </p>
          </div>
        </div>
      </div>

      {/* دکمه‌های عملیاتی iOS */}
      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/activity/new"
          className="btn-ios-blue flex items-center justify-center gap-2"
        >
          <span className="text-lg">＋</span>
          <span>ثبت فعالیت</span>
        </Link>
        <Link
          href="/customers/new"
          className="btn-ios-gray flex items-center justify-center gap-2"
        >
          <span className="text-lg">＋</span>
          <span>مشتری جدید</span>
        </Link>
      </div>

      <Link
        href="/reports/new"
        className="btn-ios-green flex items-center justify-center gap-2"
      >
        <span className="text-lg">📝</span>
        <span>گزارش روز را بنویس</span>
      </Link>

      <Link
        href="/plan"
        className="btn-ios-orange flex items-center justify-center gap-2"
      >
        <span className="text-lg">📋</span>
        <span>برنامه کاری روز</span>
      </Link>

      {/* کپسول‌های آمار — ایموجی */}
      <div className="flex gap-1.5">
        <StatPill
          label="تماس"
          value={formatNumber(callsToday)}
          icon="📞"
          href="/activity/new?type=CALL"
          pulse={callsToday > 0 ? "green" : "none"}
        />
        <StatPill
          label="پیگیری"
          value={formatNumber(followUpsToday.length)}
          icon="🔔"
          href="/followups?filter=today"
          pulse={
            followUpsToday.length === 0
              ? "none"
              : overdueCount > 0
                ? "red"
                : "orange"
          }
        />
        <StatPill
          label="سفر"
          value={formatNumber(upcomingTravels.length)}
          icon="✈️"
          href="/travelers?filter=upcoming"
          pulse={upcomingTravels.length > 0 ? "orange" : "none"}
        />
        <StatPill
          label="رزرو"
          value={formatNumber(bookingsToday)}
          icon="🎫"
          href="/bookings?filter=open"
          pulse={bookingsWaiting > 0 ? "orange" : "none"}
        />
        <StatPill
          label="فروش"
          value={formatNumber(salesToday)}
          icon="💰"
          href="/sales"
          pulse={salesToday > 0 ? "green" : "none"}
        />
      </div>

      {overdueCount > 0 && (
        <Link
          href="/followups?filter=overdue"
          className="flex items-center justify-between rounded-2xl bg-pastel-peach px-4 py-3 text-ios-orange shadow-raised-sm transition-all duration-150 active:scale-[0.98] active:shadow-pressed"
        >
          <span className="font-medium">
            🔔 {formatNumber(overdueCount)} پیگیری عقب‌افتاده
          </span>
          <span>›</span>
        </Link>
      )}

      <section>
        <div className="mb-2 flex items-center justify-between px-1">
          <h2 className="font-semibold text-ink">پیگیری‌های امروز</h2>
          <Link href="/followups" className="text-sm text-ios-blue">
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
                className="relative rounded-3xl bg-surface p-4 shadow-raised transition-all duration-200 active:shadow-pressed"
              >
                <span
                  className={`absolute right-3 top-3 h-2.5 w-2.5 rounded-full ${
                    f.dueAt < todayStart
                      ? "animate-pulse-fast bg-ios-red"
                      : "animate-pulse-fast bg-ios-orange"
                  }`}
                />
                <div className="flex items-center justify-between pr-5">
                  <div className="font-medium text-ink">{f.title}</div>
                  <div className="text-xs text-ink-muted">
                    {toPersianDateTime(f.dueAt)}
                  </div>
                </div>
                <div className="mt-1 flex items-center gap-2 text-sm text-ink-muted">
                  <span>{f.customer.name}</span>
                  <ContactSheet
                    phone={f.customer.phone}
                    customerName={f.customer.name}
                    className="text-ios-blue"
                  >
                    {f.customer.phone}
                  </ContactSheet>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <div className="mb-2 flex items-center justify-between px-1">
          <h2 className="font-semibold text-ink">سفرهای نزدیک</h2>
          <Link href="/travelers" className="text-sm text-ios-blue">
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
                className="relative rounded-3xl bg-surface p-4 shadow-raised transition-all duration-200 active:shadow-pressed"
              >
                <span className="absolute right-3 top-3 h-2.5 w-2.5 animate-pulse-fast rounded-full bg-ios-orange" />
                <div className="flex items-center justify-between pr-5">
                  <div className="font-medium text-ink">
                    {t.from} → {t.to}
                  </div>
                  <div className="text-xs text-ink-muted">
                    {toPersianDateTime(t.departDate)}
                  </div>
                </div>
                <div className="mt-1 flex items-center gap-2 text-sm text-ink-muted">
                  <span>{t.customer.name}</span>
                  <ContactSheet
                    phone={t.customer.phone}
                    customerName={t.customer.name}
                    className="text-ios-blue"
                  >
                    {t.customer.phone}
                  </ContactSheet>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {overdueCount > 0 && (
        <section>
          <div className="mb-2 flex items-center justify-between px-1">
            <h2 className="font-semibold text-ios-orange">
              پیگیری‌های عقب‌افتاده
            </h2>
          </div>

          <ul className="space-y-2">
            {followUpsOverdue.map((f) => (
              <li
                key={f.id}
                className="relative rounded-3xl bg-pastel-peach p-4 shadow-raised transition-all duration-200 active:shadow-pressed"
              >
                <span className="absolute right-3 top-3 h-2.5 w-2.5 animate-pulse-fast rounded-full bg-ios-red" />
                <div className="flex items-center justify-between pr-5">
                  <div className="font-medium text-ink">{f.title}</div>
                  <div className="text-xs text-ink-soft">
                    {toPersianDateTime(f.dueAt)}
                  </div>
                </div>
                <div className="mt-1 flex items-center gap-2 text-sm text-ink-soft">
                  <span>{f.customer.name}</span>
                  <ContactSheet
                    phone={f.customer.phone}
                    customerName={f.customer.name}
                    className="text-ios-blue underline decoration-dotted"
                  >
                    {f.customer.phone}
                  </ContactSheet>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
