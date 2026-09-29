import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "نام کاربری الزامی است").max(50),
  password: z.string().min(1, "رمز عبور الزامی است").max(200),
});

export type LoginInput = z.infer<typeof loginSchema>;
