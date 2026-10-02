import Link from "next/link";
import { prisma } from "@/lib/prisma";
import EmptyState from "@/components/EmptyState";
import BookingItem from "@/components/BookingItem";
import { Plus } from "lucide-react";
import type { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: { filter?: string };
};

type Filter = "open" | "sold" | "all";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "open", label: "باز" },
  { key: "sold", label: "فروش‌شده" },
  { key: "all", label: "همه" },
];

export default async function BookingsPage({ searchParams }: Props) {
  const filter = (searchParams.filter ?? "open") as Filter;

  let where: Prisma.BookingWhereInput = {};

  if (filter === "open") {
    where = {
      status: {
        in: [
          "INQUIRY",
          "PRICE_QUOTED",
          "WAITING_CUSTOMER",
          "BOOKED",
          "TICKETED",
        ],
      },
    };
  } else if (filter === "sold") {
    where = { status: "SOLD" };
  }

  const bookings = await prisma.booking.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      customer: { select: { id: true, name: true, phone: true } },
      travel: {
        select: { id: true, from: true, to: true, departDate: true },
      },
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-ink">رزروها</h1>
        <Link
          href="/bookings/new"
          className="btn-ios-blue flex items-center gap-1 px-3 py-2 text-sm"
        >
          <Plus size={16} />
          <span>رزرو جدید</span>
        </Link>
      </div>

      <div className="flex gap-2">
        {FILTERS.map((f) => (
          <Link
            key={f.key}
            href={`/bookings?filter=${f.key}`}
            className={`rounded-xl px-3 py-1.5 text-sm transition-all duration-150 ${
              filter === f.key
                ? "bg-ink text-white shadow-raised-sm"
                : "bg-surface text-ink-soft shadow-raised-sm active:scale-95 active:shadow-pressed"
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      {bookings.length === 0 ? (
        <EmptyState
          icon="🎫"
          title={
            filter === "open"
              ? "رزرو بازی وجود ندارد"
              : filter === "sold"
                ? "فروشی ثبت نشده"
                : "رزروی ثبت نشده"
          }
          description="با دکمه بالا اولین رزرو رو ثبت کن"
        />
      ) : (
        <ul className="space-y-2">
          {bookings.map((b) => (
            <li key={b.id}>
              <BookingItem
                id={b.id}
                status={b.status}
                amount={b.amount}
                currency={b.currency}
                note={b.note}
                customer={b.customer}
                travel={
                  b.travel
                    ? {
                        id: b.travel.id,
                        from: b.travel.from,
                        to: b.travel.to,
                        departDate: b.travel.departDate.toISOString(),
                      }
                    : null
                }
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
