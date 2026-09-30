import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import EmptyState from "@/components/EmptyState";
import { toPersianDate, toPersianDateTime } from "@/lib/date";
import { formatAmount } from "@/lib/format";
import { getActivityMeta } from "@/lib/activity";

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
        <h1 className="text-xl font-bold text-slate-900">{customer.name}</h1>
        <Link href="/customers" className="text-sm text-brand-600">
          بازگشت
        </Link>
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">شماره تماس</span>
          <a
            href={`tel:${customer.phone}`}
            className="font-medium text-brand-700"
          >
            {customer.phone}
          </a>
        </div>
        {customer.note && (
          <div className="mt-3 border-t border-slate-100 pt-3 text-sm text-slate-600">
            {customer.note}
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2">
        <Link
          href={`/activity/new?customerId=${customer.id}&type=CALL`}
          className="flex flex-col items-center justify-center gap-1 rounded-xl bg-white p-3 text-sm shadow-sm transition active:scale-[0.97]"
        >
          <span className="text-lg">📞</span>
          <span className="text-slate-700">تماس</span>
        </Link>

        <Link
          href={`/followups/new?customerId=${customer.id}`}
          className="flex flex-col items-center justify-center gap-1 rounded-xl bg-white p-3 text-sm shadow-sm transition active:scale-[0.97]"
        >
          <span className="text-lg">🔔</span>
          <span className="text-slate-700">پیگیری</span>
        </Link>

        <Link
          href={`/activity/new?customerId=${customer.id}&type=BOOKING`}
          className="flex flex-col items-center justify-center gap-1 rounded-xl bg-white p-3 text-sm shadow-sm transition active:scale-[0.97]"
        >
          <span className="text-lg">🎫</span>
          <span className="text-slate-700">رزرو</span>
        </Link>

        <Link
          href={`/travels/new?customerId=${customer.id}`}
          className="flex flex-col items-center justify-center gap-1 rounded-xl bg-white p-3 text-sm shadow-sm transition active:scale-[0.97]"
        >
          <span className="text-lg">✈️</span>
          <span className="text-slate-700">سفر</span>
        </Link>

        <Link
          href={`/activity/new?customerId=${customer.id}&type=PRICE_QUOTE`}
          className="flex flex-col items-center justify-center gap-1 rounded-xl bg-white p-3 text-sm shadow-sm transition active:scale-[0.97]"
        >
          <span className="text-lg">💰</span>
          <span className="text-slate-700">قیمت</span>
        </Link>

        <Link
          href={`/activity/new?customerId=${customer.id}`}
          className="flex flex-col items-center justify-center gap-1 rounded-xl bg-slate-900 p-3 text-sm text-white shadow-sm transition active:scale-[0.97]"
        >
          <span className="text-lg">＋</span>
          <span>سایر</span>
        </Link>
      </div>

      <section>
        <h2 className="mb-2 font-semibold text-slate-800">پیگیری‌ها</h2>
        {customer.followUps.length === 0 ? (
          <EmptyState icon="🔔" title="پیگیری‌ای ندارد" />
        ) : (
          <ul className="space-y-2">
            {customer.followUps.map((f) => (
              <li key={f.id} className="rounded-2xl bg-white p-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{f.title}</span>
                  <span className="text-xs text-slate-500">
                    {toPersianDateTime(f.dueAt)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="mb-2 font-semibold text-slate-800">سفرها</h2>
        {customer.travels.length === 0 ? (
          <EmptyState icon="✈️" title="سفری ثبت نشده" />
        ) : (
          <ul className="space-y-2">
            {customer.travels.map((t) => (
              <li key={t.id} className="rounded-2xl bg-white p-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="font-medium">
                    {t.from} → {t.to}
                  </span>
                  <span className="text-xs text-slate-500">
                    {toPersianDate(t.departDate)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="mb-2 font-semibold text-slate-800">رزروها</h2>
        {customer.bookings.length === 0 ? (
          <EmptyState icon="🎫" title="رزروی ثبت نشده" />
        ) : (
          <ul className="space-y-2">
            {customer.bookings.map((b) => (
              <li key={b.id} className="rounded-2xl bg-white p-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{b.status}</span>
                  <span className="text-xs text-slate-500">
                    {formatAmount(b.amount, b.currency)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="mb-2 font-semibold text-slate-800">فعالیت‌ها</h2>
        {customer.activities.length === 0 ? (
          <EmptyState icon="📋" title="فعالیتی ثبت نشده" />
        ) : (
          <ul className="space-y-2">
            {customer.activities.map((a) => {
              const meta = getActivityMeta(a.type);
              return (
                <li key={a.id} className="rounded-2xl bg-white p-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {meta.icon} {meta.label}
                    </span>
                    <span className="text-xs text-slate-500">
                      {toPersianDateTime(a.createdAt)}
                    </span>
                  </div>
                  {a.note && (
                    <div className="mt-1 text-sm text-slate-600">{a.note}</div>
                  )}
                  {a.amount !== null && (
                    <div className="mt-1 text-sm font-medium text-emerald-700">
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
