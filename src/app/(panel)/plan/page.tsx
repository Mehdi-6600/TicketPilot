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
        <h1 className="text-xl font-bold text-slate-900">
          📋 برنامه کاری
        </h1>
        <Link href="/today" className="text-sm text-brand-600">
          امروز
        </Link>
      </div>

      <div className="rounded-2xl bg-white p-4 text-sm text-slate-600 shadow-sm">
        این صفحه بر اساس داده‌های واقعی، برنامه کاری روز رو بهت نشون می‌ده.
        هر بخش بر اساس اولویت مرتب شده.
      </div>

      {/* عقب‌افتاده */}
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
            className="block rounded-xl bg-white p-3 shadow-sm transition active:scale-[0.99]"
          >
            <div className="flex items-center justify-between">
              <div className="font-medium text-amber-900">{f.title}</div>
              <div className="text-xs text-amber-700">
                {toPersianDateTime(f.dueAt)}
              </div>
            </div>
            <div className="mt-1 text-sm text-slate-600">
              {f.customer.name} — {f.customer.phone}
            </div>
          </Link>
        ))}
      </PlanSection>

      {/* امروز */}
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
            className="block rounded-xl bg-white p-3 shadow-sm transition active:scale-[0.99]"
          >
            <div className="flex items-center justify-between">
              <div className="font-medium text-slate-900">{f.title}</div>
              <div className="text-xs text-slate-500">
                {toPersianDateTime(f.dueAt)}
              </div>
            </div>
            <div className="mt-1 text-sm text-slate-600">
              {f.customer.name} — {f.customer.phone}
            </div>
          </Link>
        ))}
      </PlanSection>

      {/* رزروهای باز */}
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
            className="block rounded-xl bg-white p-3 shadow-sm transition active:scale-[0.99]"
          >
            <div className="flex items-center justify-between">
              <div className="text-sm">
                👤 {b.customer.name}
              </div>
              <div className="text-xs text-slate-500">
                {BOOKING_STATUS_LABELS[b.status as BookingStatus]}
              </div>
            </div>
            {b.travel && (
              <div className="mt-1 text-sm text-slate-600">
                ✈️ {b.travel.from} → {b.travel.to}
              </div>
            )}
            {b.amount !== null && (
              <div className="mt-1 text-sm font-medium text-emerald-700">
                {formatAmount(b.amount, b.currency)}
              </div>
            )}
          </Link>
        ))}
      </PlanSection>

      {/* سفرهای نزدیک */}
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
            className="block rounded-xl bg-white p-3 shadow-sm transition active:scale-[0.99]"
          >
            <div className="flex items-center justify-between">
              <div className="font-medium text-slate-900">
                {t.from} → {t.to}
              </div>
              <div className="text-xs text-slate-500">
                {toPersianDate(t.departDate)}
              </div>
            </div>
            <div className="mt-1 text-sm text-slate-600">
              👤 {t.customer.name} — 📌{" "}
              {TRAVEL_STATUS_LABELS[t.status as TravelStatus]}
            </div>
          </Link>
        ))}
      </PlanSection>
    </div>
  );
}
