import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { bookingSchema } from "@/lib/validation";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = bookingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "اطلاعات نامعتبر است" },
        { status: 400 }
      );
    }

    const { customerId, travelId, status, amount, currency, note } =
      parsed.data;

    const booking = await prisma.booking.create({
      data: {
        customerId,
        travelId: travelId && travelId !== "" ? travelId : null,
        status,
        amount: amount ?? null,
        currency,
        note: note?.trim() || null,
      },
    });

    return NextResponse.json({ ok: true, booking });
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

    const bookings = await prisma.booking.findMany({
      where: customerId ? { customerId } : {},
      orderBy: { createdAt: "desc" },
      take: 100,
      include: {
        customer: { select: { id: true, name: true, phone: true } },
        travel: {
          select: { id: true, from: true, to: true, departDate: true },
        },
      },
    });

    return NextResponse.json({ ok: true, bookings });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "unknown" },
      { status: 500 }
    );
  }
}
