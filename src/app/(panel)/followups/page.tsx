import Link from "next/link";
import { prisma } from "@/lib/prisma";
import EmptyState from "@/components/EmptyState";
import FollowUpItem from "@/components/FollowUpItem";
import { startOfTodayTehran } from "@/lib/date";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: { filter?: string };
};

type Filter = "today" | "overdue" | "all" | "done";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "today", label: "امروز و آینده" },
  { key: "overdue", label: "عقب‌افتاده" },
  { key: "done", label: "انجام‌شده" },
  { key: "all", label: "همه" },
];

export default async function FollowUpsPage({ searchParams }: Props) {
  const filter = (searchParams.filter ?? "today") as Filter;

  const todayStart = startOfTodayTehran();

  const where =
    filter === "today"
      ? { status: "OPEN" as const, dueAt: { gte: todayStart } }
      : filter === "overdue"
        ? { status: "OPEN" as const, dueAt: { lt: todayStart } }
        : filter === "done"
          ? { status: "DONE" as const }
          : {};

  const followUps = await prisma.followUp.findMany({
    where,
    orderBy: { dueAt: filter === "done" ? "desc" : "asc" },
    take: 100,
    include: {
      customer: { select: { id: true, name: true, phone: true } },
    },
  });

  const counts = await prisma.followUp.groupBy({
    by: ["status"],
    _count: true,
  });

  const openCount = counts.find((c) => c.status === "OPEN")?._count ?? 0;
  const doneCount = counts.find((c) => c.status === "DONE")?._count ?? 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900">پیگیری‌ها</h1>
        <Link
          href="/followups/new"
          className="rounded-xl bg-brand-600 px-3 py-1.5 text-sm font-medium text-white"
        >
          ＋ پیگیری جدید
        </Link>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map((f) => (
          <Link
            key={f.key}
            href={`/followups?filter=${f.key}`}
            className={`whitespace-nowrap rounded-xl px-3 py-1.5 text-sm transition ${
              filter === f.key
                ? "bg-brand-600 text-white"
                : "bg-white text-slate-700 shadow-sm"
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      <div className="text-xs text-slate-500">
        باز: {openCount} — انجام‌شده: {doneCount}
      </div>

      {followUps.length === 0 ? (
        <EmptyState
          icon="🔔"
          title="پیگیری‌ای در این دسته نیست"
          description="برای شروع، پیگیری جدید بساز"
        />
      ) : (
        <ul className="space-y-2">
          {followUps.map((f) => (
            <li key={f.id}>
              <FollowUpItem
                id={f.id}
                title={f.title}
                dueAt={f.dueAt.toISOString()}
                status={f.status}
                customer={f.customer}
                overdue={f.status === "OPEN" && f.dueAt < todayStart}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
