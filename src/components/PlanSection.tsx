import Link from "next/link";

type Props = {
  title: string;
  icon: string;
  count: number;
  tone?: "default" | "warn";
  emptyText?: string;
  children: React.ReactNode;
  href?: string;
};

export default function PlanSection({
  title,
  icon,
  count,
  tone = "default",
  emptyText = "موردی وجود ندارد",
  children,
  href,
}: Props) {
  const toneBg = tone === "warn" ? "bg-amber-50" : "bg-white";
  const toneTitle = tone === "warn" ? "text-amber-800" : "text-slate-900";

  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="text-lg">{icon}</span>
          <h2 className={`font-bold ${toneTitle}`}>{title}</h2>
          <span
            className={`rounded-full px-2 py-0.5 text-xs ${
              count > 0
                ? "bg-brand-100 text-brand-800"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {count}
          </span>
        </div>
        {href && (
          <Link href={href} className="text-sm text-brand-600">
            همه
          </Link>
        )}
      </div>

      {count === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-4 text-center text-sm text-slate-500">
          {emptyText}
        </div>
      ) : (
        <div className={`space-y-2 rounded-2xl ${toneBg} p-2`}>{children}</div>
      )}
    </section>
  );
}
