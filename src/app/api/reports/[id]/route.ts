import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const report = await prisma.dailyReport.findUnique({
      where: { id: params.id },
    });
    if (!report) {
      return NextResponse.json({ error: "گزارش پیدا نشد" }, { status: 404 });
    }
    return NextResponse.json({ ok: true, report });
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
    const content = typeof body?.content === "string" ? body.content : null;
    if (!content) {
      return NextResponse.json(
        { error: "متن گزارش نامعتبر است" },
        { status: 400 }
      );
    }
    const report = await prisma.dailyReport.update({
      where: { id: params.id },
      data: { content },
    });
    return NextResponse.json({ ok: true, report });
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
    await prisma.dailyReport.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "unknown" },
      { status: 500 }
    );
  }
}
