import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";

export async function GET() {
  try {
    const existing = await prisma.user.count();
    if (existing > 0) {
      return NextResponse.json(
        { error: "کاربر قبلاً ساخته شده است" },
        { status: 400 }
      );
    }

    const username = process.env.ADMIN_USERNAME;
    const plainPassword = process.env.ADMIN_PASSWORD;

    if (!username || !plainPassword) {
      return NextResponse.json(
        {
          error: "ADMIN_USERNAME یا ADMIN_PASSWORD تنظیم نشده است",
          hasUsername: Boolean(username),
          hasPassword: Boolean(plainPassword),
        },
        { status: 500 }
      );
    }

    const passwordHash = await hashPassword(plainPassword);

    await prisma.user.create({
      data: { username, passwordHash },
    });

    return NextResponse.json({
      ok: true,
      message: "user created",
      username,
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "unknown" },
      { status: 500 }
    );
  }
}
