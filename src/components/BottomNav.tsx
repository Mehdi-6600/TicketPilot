"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Bell, Users, Ticket, MoreHorizontal } from "lucide-react";

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
    <nav className="fixed bottom-0 left-0 right-0 z-30 pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto max-w-3xl px-3 pb-3">
        <ul
          className="flex items-stretch rounded-3xl border border-sky-100/70 bg-white/55 px-2 py-2 shadow-raised backdrop-blur-2xl backdrop-saturate-150"
          style={{
            WebkitBackdropFilter: "blur(20px) saturate(150%)",
          }}
        >
          {ITEMS.map((item) => {
            const active =
              pathname === item.href ||
              pathname.startsWith(item.href + "/") ||
              (item.href === "/more" && pathname === "/flight-search");
            const Icon = item.Icon;

            return (
              <li key={item.href} className="flex-1">
                <Link
                  href={item.href}
                  className={`flex flex-col items-center justify-center gap-0.5 rounded-2xl py-1.5 text-[10px] transition-all duration-150 ${
                    active ? "text-ios-blue" : "text-ink-soft"
                  }`}
                >
                  <Icon size={20} strokeWidth={active ? 2.6 : 1.8} />
                  <span
                    className={
                      active ? "font-bold" : "font-medium"
                    }
                  >
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
