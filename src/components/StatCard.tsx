import Link from "next/link";

type Props = {
  label: string;
  value: string | number;
  icon?: string;
  href?: string;
  tone?: "default" | "warn" | "success";
};

export default function StatCard({
  label,
  value,
  icon,
  href,
  tone = "default",
}: Props) {
  const toneClasses =
    tone === "warn"
      ? "bg-amber-50 text-amber-700"
      : tone === "success"
        ? "bg-emerald-50 text-emerald-700"
        : "bg-white text-slate-900";

  const content = (
    <div
      className={`flex flex-col gap-2 rounded-2xl p-4 shadow-sm ${toneClasses}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-500">{label}</span>
        {icon && <span className="text-lg">{icon}</span>}
      </div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block transition active:scale-[0.98]">
        {content}
      </Link>
    );
  }

  return content;
}
