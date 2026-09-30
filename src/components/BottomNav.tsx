"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/today", label: "امروز", icon: "🏠" },
  { href: "/followups", label: "پیگیری‌ها", icon: "🔔" },
  { href: "/customers", label: "مشتریان", icon: "👥" },
  { href: "/bookings", label: "رزروها", icon: "🎫" },
  { href: "/more", label: "بیشتر", icon: "⋯" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 border-t border-slate-200 bg-white pb-[env(safe-area-inset-bottom)]">
      <ul className="mx-auto flex max-w-3xl items-stretch">
        {ITEMS.map((item) => {
          const active =
            pathname === item.href ||
            pathname.startsWith(item.href + "/");
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                className={`flex flex-col items-center justify-center gap-0.5 py-2 text-xs transition ${
                  active
                    ? "text-brand-600"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
