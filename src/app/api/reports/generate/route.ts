import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { buildReportContent } from "@/lib/report";
import { startOfTodayTehran, toTehranInputValue } from "@/lib/date";

export async function POST() {
  try {
    const today = startOfTodayTehran();
    const dateOnly = new Date(toTehranInputValue(today).slice(0, 10));

    const { content } = await buildReportContent(today);

    const existing = await prisma.dailyReport.findUnique({
      where: { date: dateOnly },
    });

    if (existing) {
      const updated = await prisma.dailyReport.update({
        where: { date: dateOnly },
        data: { content },
      });
      return NextResponse.json({
        ok: true,
        report: updated,
        mode: "updated",
      });
    }

    const created = await prisma.dailyReport.create({
      data: { date: dateOnly, content },
    });
    return NextResponse.json({
      ok: true,
      report: created,
      mode: "created",
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "unknown" },
      { status: 500 }
    );
  }
}
