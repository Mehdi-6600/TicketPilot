import Link from "next/link";
import { buildPlan } from "@/lib/plan";
import PlanSection from "@/components/PlanSection";
import { toPersianDateTime, toPersianDate } from "@/lib/date";
import { formatAmount } from "@/lib/format";
import { BOOKING_STATUS_LABELS } from "@/lib/booking";
import { TRAVEL_STATUS_LABELS } from "@/lib/travel";
import type { BookingStatus, TravelStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function PlanPage() {
  const plan = await buildPlan();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-ink">📋 برنامه کاری</h1>
        <Link href="/today" className="text-sm text-ios-blue">
          امروز
        </Link>
      </div>

      <div className="rounded-3xl bg-surface p-4 text-sm text-ink-soft shadow-inset">
        این صفحه بر اساس داده‌های واقعی، برنامه کاری روز رو نشون می‌ده.
        هر بخش بر اساس اولویت مرتب شده.
      </div>

      <PlanSection
        title="پیگیری‌های عقب‌افتاده"
        icon="🚨"
        count={plan.overdueFollowUps.length}
        tone="warn"
        emptyText="هیچ پیگیری عقب‌افتاده‌ای نداری ✅"
        href="/followups?filter=overdue"
      >
        {plan.overdueFollowUps.map((f) => (
          <Link
            key={f.id}
            href={`/customers/${f.customer.id}`}
            className="block rounded-2xl bg-surface p-3 shadow-raised-sm transition-all duration-150 active:scale-[0.99] active:shadow-pressed"
          >
            <div className="flex items-center justify-between">
              <div className="font-medium text-ink">{f.title}</div>
              <div className="text-xs text-ios-orange">
                {toPersianDateTime(f.dueAt)}
              </div>
            </div>
            <div className="mt-1 text-sm text-ink-soft">
              {f.customer.name} — {f.customer.phone}
            </div>
          </Link>
        ))}
      </PlanSection>

      <PlanSection
        title="پیگیری‌های امروز"
        icon="🔔"
        count={plan.todayFollowUps.length}
        emptyText="پیگیری‌ای برای امروز نیست"
        href="/followups?filter=today"
      >
        {plan.todayFollowUps.map((f) => (
          <Link
            key={f.id}
            href={`/customers/${f.customer.id}`}
            className="block rounded-2xl bg-surface p-3 shadow-raised-sm transition-all duration-150 active:scale-[0.99] active:shadow-pressed"
          >
            <div className="flex items-center justify-between">
              <div className="font-medium text-ink">{f.title}</div>
              <div className="text-xs text-ink-muted">
                {toPersianDateTime(f.dueAt)}
              </div>
            </div>
            <div className="mt-1 text-sm text-ink-soft">
              {f.customer.name} — {f.customer.phone}
            </div>
          </Link>
        ))}
      </PlanSection>

      <PlanSection
        title="رزروهای در جریان"
        icon="🎫"
        count={plan.openBookings.length}
        emptyText="رزرو بازی نداری"
        href="/bookings?filter=open"
      >
        {plan.openBookings.map((b) => (
          <Link
            key={b.id}
            href={`/customers/${b.customer.id}`}
            className="block rounded-2xl bg-surface p-3 shadow-raised-sm transition-all duration-150 active:scale-[0.99] active:shadow-pressed"
          >
            <div className="flex items-center justify-between">
              <div className="text-sm text-ink-soft">
                👤 {b.customer.name}
              </div>
              <div className="text-xs text-ink-muted">
                {BOOKING_STATUS_LABELS[b.status as BookingStatus]}
              </div>
            </div>
            {b.travel && (
              <div className="mt-1 text-sm text-ink-soft">
                ✈️ {b.travel.from} → {b.travel.to}
              </div>
            )}
            {b.amount !== null && (
              <div className="mt-1 text-sm font-bold text-ios-green">
                {formatAmount(b.amount, b.currency)}
              </div>
            )}
          </Link>
        ))}
      </PlanSection>

      <PlanSection
        title="سفرهای نزدیک"
        icon="✈️"
        count={plan.nearTravels.length}
        emptyText="سفری نزدیک نیست"
        href="/travelers?filter=upcoming"
      >
        {plan.nearTravels.map((t) => (
          <Link
            key={t.id}
            href={`/customers/${t.customer.id}`}
            className="block rounded-2xl bg-surface p-3 shadow-raised-sm transition-all duration-150 active:scale-[0.99] active:shadow-pressed"
          >
            <div className="flex items-center justify-between">
              <div className="font-medium text-ink">
                {t.from} → {t.to}
              </div>
              <div className="text-xs text-ink-muted">
                {toPersianDate(t.departDate)}
              </div>
            </div>
            <div className="mt-1 text-sm text-ink-soft">
              👤 {t.customer.name} — 📌{" "}
              {TRAVEL_STATUS_LABELS[t.status as TravelStatus]}
            </div>
          </Link>
        ))}
      </PlanSection>
    </div>
  );
}
