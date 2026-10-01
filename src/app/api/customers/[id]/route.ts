import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { customerSchema } from "@/lib/validation";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const customer = await prisma.customer.findUnique({
      where: { id: params.id },
      include: {
        travels: { orderBy: { departDate: "desc" }, take: 20 },
        bookings: { orderBy: { createdAt: "desc" }, take: 20 },
        followUps: { orderBy: { dueAt: "desc" }, take: 20 },
        activities: { orderBy: { createdAt: "desc" }, take: 20 },
      },
    });

    if (!customer) {
      return NextResponse.json(
        { error: "مشتری پیدا نشد" },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true, customer });
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
    const parsed = customerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "اطلاعات نامعتبر است" },
        { status: 400 }
      );
    }

    const { name, phone, note } = parsed.data;

    const customer = await prisma.customer.update({
      where: { id: params.id },
      data: {
        name: name.trim(),
        phone: phone.trim(),
        note: note?.trim() || null,
      },
    });

    return NextResponse.json({ ok: true, customer });
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
    await prisma.customer.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "unknown" },
      { status: 500 }
    );
  }
}
