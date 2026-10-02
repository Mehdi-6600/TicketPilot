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
  const toneTitle = tone === "warn" ? "text-ios-orange" : "text-ink";
  const toneBg = tone === "warn" ? "bg-pastel-peach" : "bg-surface";

  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="text-lg">{icon}</span>
          <h2 className={`font-bold ${toneTitle}`}>{title}</h2>
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
              count > 0
                ? "bg-ios-blue text-white shadow-ios-blue"
                : "bg-surface text-ink-muted shadow-inset-sm"
            }`}
          >
            {count}
          </span>
        </div>
        {href && (
          <Link href={href} className="text-sm text-ios-blue">
            همه
          </Link>
        )}
      </div>

      {count === 0 ? (
        <div className="rounded-3xl bg-surface p-4 text-center text-sm text-ink-muted shadow-inset">
          {emptyText}
        </div>
      ) : (
        <div className={`space-y-2 rounded-3xl ${toneBg} p-2 shadow-inset`}>
          {children}
        </div>
      )}
    </section>
  );
}
