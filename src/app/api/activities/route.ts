import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { activitySchema } from "@/lib/validation";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = activitySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "اطلاعات نامعتبر است" },
        { status: 400 }
      );
    }

    const { type, customerId, note, amount, currency } = parsed.data;

    const activity = await prisma.activity.create({
      data: {
        type,
        customerId,
        note: note?.trim() || null,
        amount: amount ?? null,
        currency,
      },
    });

    return NextResponse.json({ ok: true, activity });
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
    const customerId = searchParams.get("customerId");

    const activities = await prisma.activity.findMany({
      where: customerId ? { customerId } : {},
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        customer: { select: { id: true, name: true, phone: true } },
      },
    });

    return NextResponse.json({ ok: true, activities });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "unknown" },
      { status: 500 }
    );
  }
}
