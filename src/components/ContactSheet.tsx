"use client";

import { useState } from "react";

type Props = {
  phone: string;
  customerName?: string;
  className?: string;
  children: React.ReactNode;
};

function normalizeForWhatsApp(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("0")) return "98" + digits.slice(1);
  if (digits.startsWith("98")) return digits;
  return digits;
}

export default function ContactSheet({
  phone,
  customerName,
  className,
  children,
}: Props) {
  const [open, setOpen] = useState(false);

  const cleanPhone = phone.replace(/\D/g, "");
  const wa = normalizeForWhatsApp(phone);

  const actions = [
    {
      label: "تماس",
      icon: "📞",
      href: `tel:${cleanPhone}`,
      bg: "bg-pastel-blue",
    },
    {
      label: "پیامک",
      icon: "💬",
      href: `sms:${cleanPhone}`,
      bg: "bg-pastel-mint",
    },
    {
      label: "واتساپ",
      icon: "🟢",
      href: `https://wa.me/${wa}`,
      bg: "bg-pastel-mint",
    },
    {
      label: "تلگرام",
      icon: "🔵",
      href: `https://t.me/+${wa}`,
      bg: "bg-pastel-blue",
    },
  ];

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={className}
      >
        {children}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 backdrop-blur-sm sm:items-center"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-t-3xl bg-surface p-5 pb-8 shadow-raised sm:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-1 text-xs text-ink-muted">
              {customerName ?? "ارتباط با مشتری"}
            </div>
            <div className="mb-4 text-lg font-bold text-ink">{phone}</div>

            <div className="grid grid-cols-4 gap-3">
              {actions.map((a) => (
                <a
                  key={a.label}
                  href={a.href}
                  target={a.href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    a.href.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  onClick={() => setOpen(false)}
                  className={`flex flex-col items-center gap-1 rounded-2xl ${a.bg} p-3 text-center shadow-raised-sm transition-all duration-150 active:scale-95 active:shadow-pressed`}
                >
                  <span className="text-2xl">{a.icon}</span>
                  <span className="text-xs text-ink-soft">{a.label}</span>
                </a>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="btn-ios-gray mt-5 w-full"
            >
              بستن
            </button>
          </div>
        </div>
      )}
    </>
  );
}
