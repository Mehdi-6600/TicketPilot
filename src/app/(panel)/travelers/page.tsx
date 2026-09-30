import Link from "next/link";
import { prisma } from "@/lib/prisma";
import EmptyState from "@/components/EmptyState";
import TravelItem from "@/components/TravelItem";
import { startOfTodayTehran, endOfTomorrowTehran } from "@/lib/date";
import type { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: { filter?: string };
};

type Filter = "active" | "upcoming" | "all";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "active", label: "در سفر" },
  { key: "upcoming", label: "نزدیک" },
  { key: "all", label: "همه" },
];

export default async function TravelersPage({ searchParams }: Props) {
  const filter = (searchParams.filter ?? "active") as Filter;

  const todayStart = startOfTodayTehran();
  const tomorrowEnd = endOfTomorrowTehran();

  let where: Prisma.TravelWhereInput = {};

  if (filter === "active") {
    where = { status: "IN_TRIP" };
  } else if (filter === "upcoming") {
    where = {
      status: { in: ["BOOKED", "TICKETED"] },
      departDate: { gte: todayStart, lte: tomorrowEnd },
    };
  }

  const travels = await prisma.travel.findMany({
    where,
    orderBy: { departDate: "asc" },
    take: 100,
    include: {
      customer: { select: { id: true, name: true, phone: true } },
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900">مسافران</h1>
        <Link
          href="/travels/new"
          className="rounded-xl bg-brand-600 px-3 py-1.5 text-sm font-medium text-white"
        >
          ＋ سفر جدید
        </Link>
      </div>

      <div className="flex gap-2">
        {FILTERS.map((f) => (
          <Link
            key={f.key}
            href={`/travelers?filter=${f.key}`}
            className={`rounded-xl px-3 py-1.5 text-sm transition ${
              filter === f.key
                ? "bg-brand-600 text-white"
                : "bg-white text-slate-700 shadow-sm"
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      {travels.length === 0 ? (
        <EmptyState
          icon="✈️"
          title={
            filter === "active"
              ? "هیچ مسافری در سفر نیست"
              : filter === "upcoming"
                ? "سفر نزدیکی نیست"
                : "سفری ثبت نشده"
          }
          description="با دکمه بالا اولین سفر رو ثبت کن"
        />
      ) : (
        <ul className="space-y-2">
          {travels.map((t) => (
            <li key={t.id}>
              <TravelItem
                id={t.id}
                from={t.from}
                to={t.to}
                departDate={t.departDate.toISOString()}
                returnDate={t.returnDate ? t.returnDate.toISOString() : null}
                status={t.status}
                note={t.note}
                customer={t.customer}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
