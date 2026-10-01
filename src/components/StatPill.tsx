import Link from "next/link";

type Props = {
  label: string;
  value: string | number;
  icon: string;
  href?: string;
  pulse?: "none" | "green" | "orange" | "red";
};

export default function StatPill({
  label,
  value,
  icon,
  href,
  pulse = "none",
}: Props) {
  const pulseColor =
    pulse === "red"
      ? "bg-red-500"
      : pulse === "orange"
        ? "bg-amber-500"
        : pulse === "green"
          ? "bg-emerald-500"
          : "";

  const pulseClass =
    pulse === "red" || pulse === "orange" ? "animate-pulse-fast" : "";

  const content = (
    <div className="relative flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-2xl bg-white px-2 py-2.5 shadow-sm transition active:scale-[0.97]">
      {pulse !== "none" && (
        <span
          className={`absolute right-1.5 top-1.5 h-2 w-2 rounded-full ${pulseColor} ${pulseClass}`}
        />
      )}
      <span className="text-base leading-none">{icon}</span>
      <span className="text-[10px] leading-tight text-slate-500">
        {label}
      </span>
      <span className="text-sm font-bold leading-none text-slate-900">
        {value}
      </span>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="flex min-w-0 flex-1">
        {content}
      </Link>
    );
  }

  return content;
}
