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
      ? "bg-ios-red"
      : pulse === "orange"
        ? "bg-ios-orange"
        : pulse === "green"
          ? "bg-ios-green"
          : "";

  const pulseClass =
    pulse === "red" || pulse === "orange" ? "animate-pulse-fast" : "";

  const content = (
    <div className="relative flex min-w-0 flex-1 flex-col items-center gap-1 rounded-2xl bg-surface px-2 py-3 shadow-raised-sm transition-all duration-150 active:scale-[0.95] active:shadow-pressed">
      {pulse !== "none" && (
        <span
          className={`absolute right-2 top-2 h-2 w-2 rounded-full ${pulseColor} ${pulseClass}`}
        />
      )}
      <span className="text-base leading-none">{icon}</span>
      <span className="text-[10px] leading-tight text-ink-muted">
        {label}
      </span>
      <span className="text-sm font-bold leading-none text-ink">
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
