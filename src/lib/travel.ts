import type { TravelStatus } from "@prisma/client";

export const TRAVEL_STATUS_LABELS: Record<TravelStatus, string> = {
  BOOKED: "رزرو شده",
  TICKETED: "بلیت صادر شده",
  IN_TRIP: "در سفر",
  RETURNED: "بازگشته",
  COMPLETED: "پایان سفر",
};

export const TRAVEL_STATUS_COLORS: Record<TravelStatus, string> = {
  BOOKED: "bg-blue-100 text-blue-800",
  TICKETED: "bg-indigo-100 text-indigo-800",
  IN_TRIP: "bg-emerald-100 text-emerald-800",
  RETURNED: "bg-amber-100 text-amber-800",
  COMPLETED: "bg-slate-100 text-slate-700",
};

export const TRAVEL_STATUSES: TravelStatus[] = [
  "BOOKED",
  "TICKETED",
  "IN_TRIP",
  "RETURNED",
  "COMPLETED",
];
