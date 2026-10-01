import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { bookingStatusEnum } from "@/lib/validation";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const parsed = bookingStatusEnum.safeParse(body?.status);

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
