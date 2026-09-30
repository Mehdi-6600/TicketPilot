import Link from "next/link";
import { prisma } from "@/lib/prisma";
import EmptyState from "@/components/EmptyState";

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
        <h1 className="text-xl font-bold text-slate-900">مشتریان</h1>
        <Link
          href="/customers/new"
          className="rounded-xl bg-brand-600 px-3 py-1.5 text-sm font-medium text-white"
        >
          ＋ مشتری جدید
        </Link>
      </div>

      <form action="/customers" method="get" className="flex gap-2">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="جستجو با نام یا شماره تماس"
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none focus:border-brand-500"
        />
        <button
          type="submit"
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm text-white"
        >
          جستجو
        </button>
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
                className="block rounded-2xl bg-white p-4 shadow-sm transition active:scale-[0.99]"
              >
                <div className="flex items-center justify-between">
                  <div className="font-medium text-slate-900">{c.name}</div>
                  <div className="text-xs text-slate-400">›</div>
                </div>
                <div className="mt-1 text-sm text-slate-500">{c.phone}</div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
