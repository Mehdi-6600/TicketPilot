import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const url = process.env.NEON_DATABASE_URL ?? "(not set)";
  const masked = url.length > 50 ? url.slice(0, 50) + "..." : url;

  const users = await prisma.user.findMany({
    select: { username: true, passwordHash: true },
  });

  return NextResponse.json({
    dbUrlPrefix: masked,
    userCount: users.length,
    users,
  });
}
