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
      ? "bg-status-danger"
      : pulse === "orange"
        ? "bg-status-warning"
        : pulse === "green"
          ? "bg-status-success"
          : "";

  const pulseClass =
    pulse === "red" || pulse === "orange" ? "animate-pulse-fast" : "";

  const content = (
    <div className="relative flex min-w-0 flex-1 flex-col items-center gap-1 rounded-3xl border border-white/70 bg-plush-surface px-2 py-3 shadow-plush-sm transition-all duration-150 active:scale-[0.94] active:shadow-plush-pressed">
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
