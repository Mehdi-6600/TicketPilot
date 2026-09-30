import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validation";
import { verifyPassword } from "@/lib/password";
import { createSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "اطلاعات ورودی نامعتبر است", step: "validation" },
        { status: 400 }
      );
    }

    const { username, password } = parsed.data;

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      return NextResponse.json(
        { error: "کاربر یافت نشد", step: "user-lookup", username },
        { status: 401 }
      );
    }

    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok) {
      return NextResponse.json(
        {
          error: "رمز عبور اشتباه است",
          step: "verify",
          received: password,
          stored: user.passwordHash,
        },
        { status: 401 }
      );
    }

    try {
      await createSession({ userId: user.id, username: user.username });
    } catch (e) {
      return NextResponse.json(
        {
          error: "خطا در ساخت session",
          step: "session",
          detail: e instanceof Error ? e.message : String(e),
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      {
        error: "خطای سرور",
        step: "catch",
        detail: e instanceof Error ? e.message : String(e),
      },
      { status: 500 }
    );
  }
}
