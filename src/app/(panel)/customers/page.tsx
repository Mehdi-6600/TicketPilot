import Link from "next/link";
import { prisma } from "@/lib/prisma";
import EmptyState from "@/components/EmptyState";
import { Search, Plus } from "lucide-react";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: { q?: string };
};

export default async function CustomersPage({ searchParams }: Props) {
  const q = (searchParams.q ?? "").trim();

  const where = q
    ? {
        OR: [
          { name: { contains: q, mode: "insensitive" as const } },
          { phone: { contains: q } },
        ],
      }
    : {};

  const customers = await prisma.customer.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-ink">مشتریان</h1>
        <Link
          href="/customers/new"
          className="btn-ios-blue flex items-center gap-1 px-3 py-2 text-sm"
        >
          <Plus size={16} />
          <span>مشتری جدید</span>
        </Link>
      </div>

      <form action="/customers" method="get" className="relative">
        <Search
          size={18}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-muted"
        />
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="جستجو با نام یا شماره تماس"
          className="neo-input pr-11"
        />
      </form>

      {customers.length === 0 ? (
        <EmptyState
          icon="👥"
          title={q ? "مشتری پیدا نشد" : "هنوز مشتری‌ای ثبت نشده"}
          description={
            q
              ? "با عبارت دیگری جستجو کن"
              : "با دکمه بالا اولین مشتری رو اضافه کن"
          }
        />
      ) : (
        <ul className="space-y-2">
          {customers.map((c) => (
            <li key={c.id}>
              <Link
                href={`/customers/${c.id}`}
                className="flex items-center justify-between rounded-3xl bg-surface p-4 shadow-raised transition-all duration-200 active:scale-[0.99] active:shadow-pressed"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-pastel-lavender text-base font-bold text-ink-soft">
                    {c.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium text-ink">{c.name}</div>
                    <div className="mt-0.5 text-sm text-ink-muted">
                      {c.phone}
                    </div>
                  </div>
                </div>
                <span className="text-ink-faint">›</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
