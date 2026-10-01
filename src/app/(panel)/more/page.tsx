import Link from "next/link";

const ITEMS = [
  { href: "/plan", label: "برنامه کاری", icon: "📋" },
  { href: "/travelers", label: "مسافران در سفر", icon: "✈️" },
  { href: "/reports", label: "گزارش روز", icon: "📝" },
  { href: "/settings", label: "تنظیمات", icon: "⚙️" },
];

export default function MorePage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-slate-900">بیشتر</h1>

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
