import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { bookingSchema, bookingStatusEnum } from "@/lib/validation";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: {
        customer: { select: { id: true, name: true, phone: true } },
        travel: {
          select: { id: true, from: true, to: true, departDate: true },
        },
      },
    });
    if (!booking) {
      return NextResponse.json({ error: "رزرو پیدا نشد" }, { status: 404 });
    }
    return NextResponse.json({ ok: true, booking });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "unknown" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();

    if (
      body &&
      typeof body.status === "string" &&
      Object.keys(body).length === 1
    ) {
      const parsed = bookingStatusEnum.safeParse(body.status);
      if (!parsed.success) {
        return NextResponse.json(
          { error: "وضعیت نامعتبر است" },
          { status: 400 }
        );
      }
      const booking = await prisma.booking.update({
        where: { id: params.id },
        data: { status: parsed.data },
      });
      return NextResponse.json({ ok: true, booking });
    }

    const parsed = bookingSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "اطلاعات نامعتبر است" },
        { status: 400 }
      );
    }

    const { customerId, travelId, status, amount, currency, note } =
      parsed.data;

    const booking = await prisma.booking.update({
      where: { id: params.id },
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

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.booking.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "unknown" },
      { status: 500 }
    );
  }
}
