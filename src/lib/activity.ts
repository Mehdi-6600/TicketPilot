import type { ActivityType } from "@prisma/client";

type ActivityMeta = {
  type: ActivityType;
  label: string;
  icon: string;
  needsAmount: boolean;
};

export const ACTIVITY_TYPES: ActivityMeta[] = [
  { type: "CALL", label: "تماس با مشتری", icon: "📞", needsAmount: false },
  { type: "REPLY", label: "پاسخ به مشتری", icon: "💬", needsAmount: false },
  { type: "INQUIRY", label: "استعلام پرواز", icon: "🔍", needsAmount: false },
  { type: "PRICE_QUOTE", label: "اعلام قیمت", icon: "💰", needsAmount: false },
  { type: "FOLLOW_UP", label: "پیگیری مشتری", icon: "🔔", needsAmount: false },
  { type: "BOOKING", label: "رزرو بلیت", icon: "🎫", needsAmount: true },
  { type: "SALE", label: "فروش بلیت", icon: "💵", needsAmount: true },
  { type: "CANCEL", label: "کنسلی", icon: "❌", needsAmount: false },
  { type: "CHANGE", label: "تغییر رزرو", icon: "🔄", needsAmount: false },
  {
    type: "TRIP_FOLLOW_UP",
    label: "پیگیری سفر",
    icon: "✈️",
    needsAmount: false,
  },
  { type: "OTHER", label: "سایر", icon: "📌", needsAmount: false },
];

export function getActivityMeta(type: ActivityType): ActivityMeta {
  return (
    ACTIVITY_TYPES.find((a) => a.type === type) ?? {
      type,
      label: type,
      icon: "📌",
      needsAmount: false,
    }
  );
}
