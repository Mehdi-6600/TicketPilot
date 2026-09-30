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
        { error: "اطلاعات ورودی نامعتبر است" },
        { status: 400 }
      );
    }

    const { username, password } = parsed.data;

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      const allUsers = await prisma.user.findMany({
        select: { username: true },
      });
      return NextResponse.json(
        {
          error: "کاربر یافت نشد",
          debug: {
            searched: username,
            availableUsers: allUsers.map((u) => u.username),
            dbUrlPrefix: (process.env.NEON_DATABASE_URL ?? "").slice(0, 35),
          },
        },
        { status: 401 }
      );
    }

    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok) {
      return NextResponse.json(
        { error: "رمز عبور اشتباه است" },
        { status: 401 }
      );
    }

    await createSession({ userId: user.id, username: user.username });

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      {
        error: "خطای سرور",
        detail: e instanceof Error ? e.message : String(e),
      },
      { status: 500 }
    );
  }
}
