import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";

export async function GET() {
  try {
    await prisma.user.deleteMany({});

    const passwordHash = await hashPassword("Ticket1234");

    const user = await prisma.user.create({
      data: {
        username: "shahinjarrahi",
        passwordHash,
      },
    });

    return NextResponse.json({
      ok: true,
      username: user.username,
      password: "Ticket1234",
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "unknown" },
      { status: 500 }
    );
  }
}
