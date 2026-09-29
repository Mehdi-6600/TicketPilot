import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const out: Record<string, unknown> = {};

  // 1) بررسی env vars
  out.hasDatabaseUrl = Boolean(process.env.DATABASE_URL);
  out.hasNeonDatabaseUrl = Boolean(process.env.NEON_DATABASE_URL);
  out.hasSessionSecret = Boolean(process.env.SESSION_SECRET);
  out.hasAdminUsername = Boolean(process.env.ADMIN_USERNAME);
  out.hasAdminPasswordHash = Boolean(process.env.ADMIN_PASSWORD_HASH);

  // 2) بررسی اتصال دیتابیس
  try {
    const count = await prisma.user.count();
    out.dbOk = true;
    out.userCount = count;
  } catch (e) {
    out.dbOk = false;
    out.dbError = e instanceof Error ? e.message : String(e);
  }

  return NextResponse.json(out);
}
