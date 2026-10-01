import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { followUpSchema } from "@/lib/validation";
import { parseTehranInput } from "@/lib/date";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const followUp = await prisma.followUp.findUnique({
      where: { id: params.id },
      include: {
        customer: { select: { id: true, name: true, phone: true } },
      },
    });
    if (!followUp) {
      return NextResponse.json(
        { error: "پیگیری پیدا نشد" },
        { status: 404 }
      );
    }
    return NextResponse.json({ ok: true, followUp });
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

    if (body?.action === "done") {
      const followUp = await prisma.followUp.update({
        where: { id: params.id },
        data: { status: "DONE", doneAt: new Date() },
      });
      return NextResponse.json({ ok: true, followUp });
    }
    if (body?.action === "cancel") {
      const followUp = await prisma.followUp.update({
        where: { id: params.id },
        data: { status: "CANCELED" },
      });
      return NextResponse.json({ ok: true, followUp });
    }
    if (body?.action === "reopen") {
      const followUp = await prisma.followUp.update({
        where: { id: params.id },
        data: { status: "OPEN", doneAt: null },
      });
      return NextResponse.json({ ok: true, followUp });
    }

    const parsed = followUpSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "اطلاعات نامعتبر است" },
        { status: 400 }
      );
    }

    const { customerId, title, dueAt } = parsed.data;

    const followUp = await prisma.followUp.update({
      where: { id: params.id },
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

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.followUp.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "unknown" },
      { status: 500 }
    );
  }
}
