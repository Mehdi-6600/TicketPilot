import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  needsPasswordMigration,
  hashPassword,
  verifyPassword,
} from "@/lib/password";
import { loginSchema } from "@/lib/validation";
import { createSession } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "نام کاربری و رمز عبور را وارد کنید" },
        { status: 400 }
      );
    }

    const { username, password } = parsed.data;

    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        passwordHash: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "نام کاربری یا رمز عبور اشتباه است" },
        { status: 401 }
      );
    }

    const validPassword = await verifyPassword(
      password,
      user.passwordHash
    );

    if (!validPassword) {
      return NextResponse.json(
        { error: "نام کاربری یا رمز عبور اشتباه است" },
        { status: 401 }
      );
    }

    if (needsPasswordMigration(user.passwordHash)) {
      const newPasswordHash = await hashPassword(password);

      await prisma.user.update({
        where: { id: user.id },
        data: { passwordHash: newPasswordHash },
      });
    }

    await createSession({
      userId: user.id,
      username: user.username,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("LOGIN_ERROR", error);

    return NextResponse.json(
      { error: "خطای سرور هنگام ورود" },
      { status: 500 }
    );
  }
}
