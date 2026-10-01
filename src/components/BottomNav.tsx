"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Bell,
  Users,
  Ticket,
  MoreHorizontal,
} from "lucide-react";

const ITEMS = [
  { href: "/today", label: "امروز", Icon: Home },
  { href: "/followups", label: "پیگیری‌ها", Icon: Bell },
  { href: "/customers", label: "مشتریان", Icon: Users },
  { href: "/bookings", label: "رزروها", Icon: Ticket },
  { href: "/more", label: "بیشتر", Icon: MoreHorizontal },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 border-t border-white/40 bg-white/80 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl">
      <ul className="mx-auto flex max-w-3xl items-stretch">
        {ITEMS.map((item) => {
          const active =
            pathname === item.href ||
            pathname.startsWith(item.href + "/");
          const Icon = item.Icon;

          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                className={`flex flex-col items-center justify-center gap-0.5 py-2 text-[10px] transition-all duration-150 ${
                  active
                    ? "text-ios-blue"
                    : "text-ink-muted hover:text-ink"
                }`}
              >
                <Icon
                  size={20}
                  strokeWidth={active ? 2.5 : 1.8}
                />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
