import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import EmptyState from "@/components/EmptyState";
import { toPersianDate, toPersianDateTime } from "@/lib/date";
import { formatAmount } from "@/lib/format";
import { getActivityMeta } from "@/lib/activity";
import { BOOKING_STATUS_LABELS } from "@/lib/booking";
import ContactSheet from "@/components/ContactSheet";
import ConfirmDelete from "@/components/ConfirmDelete";
import { Pencil } from "lucide-react";

export const dynamic = "force-dynamic";

type Props = {
  params: { id: string };
};

export default async function CustomerDetailPage({ params }: Props) {
  const customer = await prisma.customer.findUnique({
    where: { id: params.id },
    include: {
      travels: { orderBy: { departDate: "desc" }, take: 20 },
      bookings: { orderBy: { createdAt: "desc" }, take: 20 },
      followUps: { orderBy: { dueAt: "desc" }, take: 20 },
      activities: { orderBy: { createdAt: "desc" }, take: 20 },
    },
  });

  if (!customer) notFound();

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-ink">{customer.name}</h1>
        <div className="flex items-center gap-2">
          <Link
            href={`/customers/${customer.id}/edit`}
            className="flex items-center gap-1 rounded-xl bg-surface px-3 py-1.5 text-xs text-ink-soft shadow-raised-sm transition-all duration-150 active:scale-95 active:shadow-pressed"
          >
            <Pencil size={12} />
            <span>ویرایش</span>
          </Link>
          <ConfirmDelete
            url={`/api/customers/${customer.id}`}
            message={`مشتری ${customer.name} حذف شود؟ تمام سفرها، رزروها، پیگیری‌ها و فعالیت‌های او هم پاک می‌شوند.`}
            redirectTo="/customers"
          />
        </div>
      </div>

      {/* اطلاعات تماس */}
      <div className="rounded-3xl bg-surface p-4 shadow-raised">
        <div className="flex items-center justify-between text-sm">
          <span className="text-ink-muted">شماره تماس</span>
          <ContactSheet
            phone={customer.phone}
            customerName={customer.name}
            className="font-medium text-ios-blue"
          >
            {customer.phone}
          </ContactSheet>
        </div>
        {customer.note && (
          <div className="mt-3 border-t border-white/60 pt-3 text-sm text-ink-soft">
            {customer.note}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-2">
        <ContactSheet
          phone={customer.phone}
          customerName={customer.name}
          className="flex flex-col items-center justify-center gap-1 rounded-2xl bg-pastel-mint p-3 text-sm shadow-raised-sm transition-all duration-150 active:scale-[0.95] active:shadow-pressed"
        >
          <span className="text-lg">📞</span>
          <span className="text-ink-soft">تماس</span>
        </ContactSheet>

        <Link
          href={`/followups/new?customerId=${customer.id}`}
          className="flex flex-col items-center justify-center gap-1 rounded-2xl bg-pastel-lavender p-3 text-sm shadow-raised-sm transition-all duration-150 active:scale-[0.95] active:shadow-pressed"
        >
          <span className="text-lg">🔔</span>
          <span className="text-ink-soft">پیگیری</span>
        </Link>

        <Link
          href={`/bookings/new?customerId=${customer.id}`}
          className="flex flex-col items-center justify-center gap-1 rounded-2xl bg-pastel-pink p-3 text-sm shadow-raised-sm transition-all duration-150 active:scale-[0.95] active:shadow-pressed"
        >
          <span className="text-lg">🎫</span>
          <span className="text-ink-soft">رزرو</span>
        </Link>

        <Link
          href={`/travelers/new?customerId=${customer.id}`}
          className="flex flex-col items-center justify-center gap-1 rounded-2xl bg-pastel-blue p-3 text-sm shadow-raised-sm transition-all duration-150 active:scale-[0.95] active:shadow-pressed"
        >
          <span className="text-lg">✈️</span>
          <span className="text-ink-soft">سفر</span>
        </Link>

        <Link
          href={`/activity/new?customerId=${customer.id}&type=PRICE_QUOTE`}
          className="flex flex-col items-center justify-center gap-1 rounded-2xl bg-pastel-peach p-3 text-sm shadow-raised-sm transition-all duration-150 active:scale-[0.95] active:shadow-pressed"
        >
          <span className="text-lg">💰</span>
          <span className="text-ink-soft">قیمت</span>
        </Link>

        <Link
          href={`/activity/new?customerId=${customer.id}`}
          className="flex flex-col items-center justify-center gap-1 rounded-2xl bg-surface p-3 text-sm shadow-raised-sm transition-all duration-150 active:scale-[0.95] active:shadow-pressed"
        >
          <span className="text-lg">＋</span>
          <span className="text-ink-soft">سایر</span>
        </Link>
      </div>

      <section>
        <h2 className="mb-2 px-1 font-semibold text-ink">پیگیری‌ها</h2>
        {customer.followUps.length === 0 ? (
          <EmptyState icon="🔔" title="پیگیری‌ای ندارد" />
        ) : (
          <ul className="space-y-2">
            {customer.followUps.map((f) => (
              <li
                key={f.id}
                className="rounded-2xl bg-surface p-3 shadow-raised-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-ink">{f.title}</span>
                  <span className="text-xs text-ink-muted">
                    {toPersianDateTime(f.dueAt)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="mb-2 px-1 font-semibold text-ink">سفرها</h2>
        {customer.travels.length === 0 ? (
          <EmptyState icon="✈️" title="سفری ثبت نشده" />
        ) : (
          <ul className="space-y-2">
            {customer.travels.map((t) => (
              <li
                key={t.id}
                className="rounded-2xl bg-surface p-3 shadow-raised-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-ink">
                    {t.from} → {t.to}
                  </span>
                  <span className="text-xs text-ink-muted">
                    {toPersianDate(t.departDate)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="mb-2 px-1 font-semibold text-ink">رزروها</h2>
        {customer.bookings.length === 0 ? (
          <EmptyState icon="🎫" title="رزروی ثبت نشده" />
        ) : (
          <ul className="space-y-2">
            {customer.bookings.map((b) => (
              <li
                key={b.id}
                className="rounded-2xl bg-surface p-3 shadow-raised-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-ink">
                    {BOOKING_STATUS_LABELS[b.status]}
                  </span>
                  <span className="text-xs text-ink-muted">
                    {formatAmount(b.amount, b.currency)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="mb-2 px-1 font-semibold text-ink">فعالیت‌ها</h2>
        {customer.activities.length === 0 ? (
          <EmptyState icon="📋" title="فعالیتی ثبت نشده" />
        ) : (
          <ul className="space-y-2">
            {customer.activities.map((a) => {
              const meta = getActivityMeta(a.type);
              return (
                <li
                  key={a.id}
                  className="rounded-2xl bg-surface p-3 shadow-raised-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-ink">
                      {meta.icon} {meta.label}
                    </span>
                    <span className="text-xs text-ink-muted">
                      {toPersianDateTime(a.createdAt)}
                    </span>
                  </div>
                  {a.note && (
                    <div className="mt-1 text-sm text-ink-soft">{a.note}</div>
                  )}
                  {a.amount !== null && (
                    <div className="mt-1 text-sm font-medium text-ios-green">
                      {formatAmount(a.amount, a.currency)}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
