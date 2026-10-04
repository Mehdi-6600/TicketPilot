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
        <ul className="flex items-stretch gap-1 rounded-[2.5rem] border border-white/85 bg-[#e8f0f8] px-2 py-2 shadow-[8px_8px_20px_rgba(120,145,175,0.35),-8px_-8px_20px_rgba(255,255,255,0.95),inset_0_2px_3px_rgba(255,255,255,0.95),inset_0_-3px_6px_rgba(15,27,61,0.08)]">
          {ITEMS.map((item) => {
            const active =
              pathname === item.href ||
              pathname.startsWith(item.href + "/");
            const Icon = item.Icon;

            return (
              <li key={item.href} className="flex-1">
                <Link
                  href={item.href}
                  className={`flex flex-col items-center justify-center gap-0.5 rounded-[2rem] py-2 text-[10px] transition-all duration-150 active:scale-[0.94] ${
                    active
                      ? "text-[#0f1b3d]"
                      : "text-[#0f1b3d]"
                  }`}
                  style={
                    active
                      ? {
                          backgroundImage:
                            "linear-gradient(165deg, #f8fbff 0%, #e4eef7 45%, #d0dde9 100%)",
                          boxShadow:
                            "5px 5px 12px rgba(120,145,175,0.3), -5px -5px 12px rgba(255,255,255,0.92), inset 0 2px 3px rgba(255,255,255,0.95), inset 0 -2px 5px rgba(15,27,61,0.08)",
                        }
                      : undefined
                  }
                >
                  <Icon size={20} strokeWidth={active ? 2.6 : 2} />
                  <span className={active ? "font-bold" : "font-medium"}>
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
