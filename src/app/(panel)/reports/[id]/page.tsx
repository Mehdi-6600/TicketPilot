import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ReportEditor from "@/components/ReportEditor";
import {
  toPersianDate,
  startOfTodayTehran,
  toTehranInputValue,
} from "@/lib/date";
import { buildReportContent } from "@/lib/report";

export const dynamic = "force-dynamic";

type Props = {
  params: { id: string };
};

export default async function ReportDetailPage({ params }: Props) {
  if (params.id === "new") {
    const today = new Date(
      toTehranInputValue(startOfTodayTehran()).slice(0, 10)
    );

    const existing = await prisma.dailyReport.findUnique({
      where: { date: today },
    });

    if (existing) {
      return (
        <ReportEditor
          id={existing.id}
          dateLabel={toPersianDate(existing.date)}
          initialContent={existing.content}
        />
      );
    }

    const { content } = await buildReportContent(new Date());

    const created = await prisma.dailyReport.create({
      data: { date: today, content },
    });

    return (
      <ReportEditor
        id={created.id}
        dateLabel={toPersianDate(created.date)}
        initialContent={created.content}
      />
    );
  }

  const report = await prisma.dailyReport.findUnique({
    where: { id: params.id },
  });

  if (!report) notFound();

  return (
    <ReportEditor
      id={report.id}
      dateLabel={toPersianDate(report.date)}
      initialContent={report.content}
    />
  );
}
