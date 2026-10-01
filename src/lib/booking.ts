import type { BookingStatus } from "@prisma/client";

export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  INQUIRY: "استعلام",
  PRICE_QUOTED: "قیمت اعلام شد",
  WAITING_CUSTOMER: "در انتظار مشتری",
  BOOKED: "رزرو شده",
  TICKETED: "بلیت صادر شد",
  SOLD: "فروش انجام شد",
  CANCELED: "لغو شد",
};

export const BOOKING_STATUS_COLORS: Record<BookingStatus, string> = {
  INQUIRY: "bg-slate-100 text-slate-700",
  PRICE_QUOTED: "bg-blue-100 text-blue-800",
  WAITING_CUSTOMER: "bg-amber-100 text-amber-800",
  BOOKED: "bg-indigo-100 text-indigo-800",
  TICKETED: "bg-cyan-100 text-cyan-800",
  SOLD: "bg-emerald-100 text-emerald-800",
  CANCELED: "bg-rose-100 text-rose-800",
};

export const BOOKING_STATUSES: BookingStatus[] = [
  "INQUIRY",
  "PRICE_QUOTED",
  "WAITING_CUSTOMER",
  "BOOKED",
  "TICKETED",
  "SOLD",
  "CANCELED",
];
