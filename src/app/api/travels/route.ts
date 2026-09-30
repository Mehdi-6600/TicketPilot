import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { travelSchema } from "@/lib/validation";
import { parseTehranInput } from "@/lib/date";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = travelSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "اطلاعات نامعتبر است" },
        { status: 400 }
      );
    }

    const {
      customerId,
      from,
      to,
      departDate,
      returnDate,
      status,
      note,
    } = parsed.data;

    const travel = await prisma.travel.create({
      data: {
        customerId,
        from: from.trim(),
        to: to.trim(),
        departDate: parseTehranInput(departDate),
        returnDate: returnDate ? parseTehranInput(returnDate) : null,
        status,
        note: note?.trim() || null,
      },
    });

    return NextResponse.json({ ok: true, travel });
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

    const travels = await prisma.travel.findMany({
      where: customerId ? { customerId } : {},
      orderBy: { departDate: "asc" },
      take: 100,
      include: {
        customer: { select: { id: true, name: true, phone: true } },
      },
    });

    return NextResponse.json({ ok: true, travels });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "unknown" },
      { status: 500 }
    );
  }
}
