import Link from "next/link";
import { PlaneTakeoff } from "lucide-react";

const ITEMS = [
  { href: "/plan", label: "برنامه کاری", icon: "📋" },
  { href: "/travelers", label: "مسافران در سفر", icon: "✈️" },
  { href: "/reports", label: "گزارش روز", icon: "📝" },
  { href: "/sales", label: "فروش ۳۰ روز اخیر", icon: "📊" },
  { href: "/settings", label: "تنظیمات", icon: "⚙️" },
];

export default function MorePage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-slate-900">بیشتر</h1>

      <Link
        href="/flight-search"
        className="neo-card-blue flex items-center justify-between gap-3"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/70 text-ios-blue shadow-raised-sm">
            <PlaneTakeoff size={21} />
          </span>
          <div>
            <div className="font-semibold text-ink">استعلام قیمت بلیط</div>
            <div className="mt-1 text-xs leading-5 text-ink-muted">
              جستجوی سریع مسیر و مقایسه نرخ‌ها
            </div>
          </div>
        </div>
        <span className="text-lg text-ios-blue" aria-hidden="true">‹</span>
      </Link>

      <ul className="space-y-2">
        {ITEMS.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium text-slate-800">
                  {item.label}
                </span>
              </div>
              <span className="text-slate-400">›</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
