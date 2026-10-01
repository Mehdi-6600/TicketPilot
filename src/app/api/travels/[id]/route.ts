import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { travelSchema, travelStatusEnum } from "@/lib/validation";
import { parseTehranInput } from "@/lib/date";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const travel = await prisma.travel.findUnique({
      where: { id: params.id },
      include: {
        customer: { select: { id: true, name: true, phone: true } },
      },
    });
    if (!travel) {
      return NextResponse.json({ error: "سفر پیدا نشد" }, { status: 404 });
    }
    return NextResponse.json({ ok: true, travel });
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
      const parsed = travelStatusEnum.safeParse(body.status);
      if (!parsed.success) {
        return NextResponse.json(
          { error: "وضعیت نامعتبر است" },
          { status: 400 }
        );
      }
      const travel = await prisma.travel.update({
        where: { id: params.id },
        data: { status: parsed.data },
      });
      return NextResponse.json({ ok: true, travel });
    }

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

    const travel = await prisma.travel.update({
      where: { id: params.id },
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

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.travel.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "unknown" },
      { status: 500 }
    );
  }
}
