import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";

// این route فقط یک‌بار برای ساخت اولین کاربر ادمین استفاده می‌شود.
// بعد از ساخت کاربر، این فایل را از ریپو حذف کن.

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
    const passwordHash = process.env.ADMIN_PASSWORD_HASH;

    if (!username || !passwordHash) {
      return NextResponse.json(
        { error: "ADMIN_USERNAME یا ADMIN_PASSWORD_HASH تنظیم نشده است" },
        { status: 500 }
      );
    }

    await prisma.user.create({
      data: {
        username,
        passwordHash,
      },
    });

    return NextResponse.json({ ok: true, message: "کاربر ساخته شد" });
  } catch {
    return NextResponse.json({ error: "خطا در ساخت کاربر" }, { status: 500 });
  }
}
