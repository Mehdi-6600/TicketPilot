import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const action = body?.action as string | undefined;

    if (action === "done") {
      const followUp = await prisma.followUp.update({
        where: { id: params.id },
        data: { status: "DONE", doneAt: new Date() },
      });
      return NextResponse.json({ ok: true, followUp });
    }

    if (action === "cancel") {
      const followUp = await prisma.followUp.update({
        where: { id: params.id },
        data: { status: "CANCELED" },
      });
      return NextResponse.json({ ok: true, followUp });
    }

    if (action === "reopen") {
      const followUp = await prisma.followUp.update({
        where: { id: params.id },
        data: { status: "OPEN", doneAt: null },
      });
      return NextResponse.json({ ok: true, followUp });
    }

    return NextResponse.json({ error: "action نامعتبر" }, { status: 400 });
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
