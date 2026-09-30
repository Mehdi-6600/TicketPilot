import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { followUpSchema } from "@/lib/validation";
import { parseTehranInput } from "@/lib/date";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = followUpSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "اطلاعات نامعتبر است" },
        { status: 400 }
      );
    }

    const { customerId, title, dueAt } = parsed.data;

    const followUp = await prisma.followUp.create({
      data: {
        customerId,
        title: title.trim(),
        dueAt: parseTehranInput(dueAt),
      },
    });

    return NextResponse.json({ ok: true, followUp });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "unknown" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const filter = searchParams.get("filter") ?? "all";

    const now = new Date();
    const startToday = new Date(now);
    startToday.setHours(0, 0, 0, 0);

    const where =
      filter === "today"
        ? { status: "OPEN" as const, dueAt: { gte: startToday } }
        : filter === "overdue"
          ? { status: "OPEN" as const, dueAt: { lt: startToday } }
          : filter === "done"
            ? { status: "DONE" as const }
            : {};

    const followUps = await prisma.followUp.findMany({
      where,
      orderBy: { dueAt: "asc" },
      take: 100,
      include: {
        customer: { select: { id: true, name: true, phone: true } },
      },
    });

    return NextResponse.json({ ok: true, followUps });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "unknown" },
      { status: 500 }
    );
  }
}
