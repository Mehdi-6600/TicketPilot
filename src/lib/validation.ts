import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "نام کاربری الزامی است").max(50),
  password: z.string().min(1, "رمز عبور الزامی است").max(200),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const customerSchema = z.object({
  name: z.string().min(1, "نام الزامی است").max(100),
  phone: z.string().min(3, "شماره تماس الزامی است").max(30),
  note: z.string().max(500).optional().or(z.literal("")),
});

export type CustomerInput = z.infer<typeof customerSchema>;

export const activityTypeEnum = z.enum([
  "CALL",
  "REPLY",
  "INQUIRY",
  "PRICE_QUOTE",
  "FOLLOW_UP",
  "BOOKING",
  "SALE",
  "CANCEL",
  "CHANGE",
  "TRIP_FOLLOW_UP",
  "OTHER",
]);

export const currencyEnum = z.enum(["TOMAN", "OMR", "USD"]);

export const activitySchema = z.object({
  type: activityTypeEnum,
  customerId: z.string().min(1, "مشتری الزامی است"),
  note: z.string().max(500).optional().or(z.literal("")),
  amount: z
    .union([z.number().int().nonnegative(), z.null()])
    .optional()
    .transform((v) => (v === undefined ? null : v)),
  currency: currencyEnum.default("TOMAN"),
});

export type ActivityInput = z.infer<typeof activitySchema>;

export const followUpStatusEnum = z.enum(["OPEN", "DONE", "CANCELED"]);

export const followUpSchema = z.object({
  customerId: z.string().min(1, "مشتری الزامی است"),
  title: z.string().min(1, "عنوان الزامی است").max(200),
  dueAt: z.string().min(1, "تاریخ الزامی است"),
});

export type FollowUpInput = z.infer<typeof followUpSchema>;

export const travelStatusEnum = z.enum([
  "BOOKED",
  "TICKETED",
  "IN_TRIP",
  "RETURNED",
  "COMPLETED",
]);

export const travelSchema = z.object({
  customerId: z.string().min(1, "مشتری الزامی است"),
  from: z.string().min(1, "مبدأ الزامی است").max(100),
  to: z.string().min(1, "مقصد الزامی است").max(100),
  departDate: z.string().min(1, "تاریخ رفت الزامی است"),
  returnDate: z.string().optional().or(z.literal("")),
  status: travelStatusEnum.default("BOOKED"),
  note: z.string().max(500).optional().or(z.literal("")),
});

export type TravelInput = z.infer<typeof travelSchema>;

export const bookingStatusEnum = z.enum([
  "INQUIRY",
  "PRICE_QUOTED",
  "WAITING_CUSTOMER",
  "BOOKED",
  "TICKETED",
  "SOLD",
  "CANCELED",
]);

export const bookingSchema = z.object({
  customerId: z.string().min(1, "مشتری الزامی است"),
  travelId: z.string().optional().or(z.literal("")),
  status: bookingStatusEnum.default("INQUIRY"),
  amount: z
    .union([z.number().int().nonnegative(), z.null()])
    .optional()
    .transform((v) => (v === undefined ? null : v)),
  currency: currencyEnum.default("TOMAN"),
  note: z.string().max(500).optional().or(z.literal("")),
});

export type BookingInput = z.infer<typeof bookingSchema>;
