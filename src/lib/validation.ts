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
