import { prisma } from "@/lib/prisma";
import {
  startOfTodayTehran,
  endOfTodayTehran,
  toPersianDate,
} from "@/lib/date";
import { formatNumber } from "@/lib/format";

export type ReportStats = {
  calls: number;
  replies: number;
  inquiries: number;
  priceQuotes: number;
  followUps: number;
  bookings: number;
  sales: number;
  cancels: number;
  changes: number;
  tripFollowUps: number;
  others: number;
  totalActivities: number;
  openFollowUps: number;
  overdueFollowUps: number;
  activeBookings: number;
  soldBookings: number;
  upcomingTravels: number;
};

export async function buildReportContent(date: Date): Promise<{
  content: string;
  stats: ReportStats;
}> {
  const dayStart = startOfTodayTehran();
  const dayEnd = endOfTodayTehran();

  const from = date ?? dayStart;

  const activities = await prisma.activity.findMany({
    where: { createdAt: { gte: dayStart, lte: dayEnd } },
    include: { customer: { select: { name: true } } },
    orderBy: { createdAt: "asc" },
  });

  const followUpsDone = await prisma.followUp.findMany({
    where: { doneAt: { gte: dayStart, lte: dayEnd }, status: "DONE" },
    include: { customer: { select: { name: true } } },
  });

  const followUpsOpen = await prisma.followUp.count({
    where: { status: "OPEN" },
  });

  const followUpsOverdue = await prisma.followUp.count({
    where: { status: "OPEN", dueAt: { lt: dayStart } },
  });

  const bookingsCreated = await prisma.booking.findMany({
    where: { createdAt: { gte: dayStart, lte: dayEnd } },
    include: { customer: { select: { name: true } } },
  });

  const bookingsSold = await prisma.booking.findMany({
    where: { updatedAt: { gte: dayStart, lte: dayEnd }, status: "SOLD" },
    include: { customer: { select: { name: true } } },
  });

  const countBy = (type: string) =>
    activities.filter((a) => a.type === type).length;

  const stats: ReportStats = {
    calls: countBy("CALL"),
    replies: countBy("REPLY"),
    inquiries: countBy("INQUIRY"),
    priceQuotes: countBy("PRICE_QUOTE"),
    followUps: countBy("FOLLOW_UP"),
    bookings: countBy("BOOKING"),
    sales: countBy("SALE"),
    cancels: countBy("CANCEL"),
    changes: countBy("CHANGE"),
    tripFollowUps: countBy("TRIP_FOLLOW_UP"),
    others: countBy("OTHER"),
    totalActivities: activities.length,
    openFollowUps: followUpsOpen,
    overdueFollowUps: followUpsOverdue,
    activeBookings: bookingsCreated.length,
    soldBookings: bookingsSold.length,
    upcomingTravels: 0,
  };

  const lines: string[] = [];

  lines.push("گزارش عملکرد روزانه");
  lines.push(`تاریخ: ${toPersianDate(dayStart)}`);
  lines.push("");

  lines.push("۱. خلاصه فعالیت‌ها");
  if (stats.totalActivities === 0) {
    lines.push("در این روز فعالیتی ثبت نشده است.");
  } else {
    lines.push(
      `مجموع فعالیت‌های ثبت‌شده: ${formatNumber(stats.totalActivities)}`
    );
    if (stats.calls > 0)
      lines.push(`— تماس با مشتری: ${formatNumber(stats.calls)}`);
    if (stats.replies > 0)
      lines.push(`— پاسخ به مشتری: ${formatNumber(stats.replies)}`);
    if (stats.inquiries > 0)
      lines.push(`— استعلام پرواز: ${formatNumber(stats.inquiries)}`);
    if (stats.priceQuotes > 0)
      lines.push(`— اعلام قیمت: ${formatNumber(stats.priceQuotes)}`);
    if (stats.tripFollowUps > 0)
      lines.push(`— پیگیری سفر: ${formatNumber(stats.tripFollowUps)}`);
    if (stats.others > 0)
      lines.push(`— سایر: ${formatNumber(stats.others)}`);
  }
  lines.push("");

  lines.push("۲. پیگیری‌ها");
  if (followUpsDone.length === 0 && stats.openFollowUps === 0) {
    lines.push("پیگیری خاصی ثبت نشده است.");
  } else {
    if (followUpsDone.length > 0) {
      lines.push(
        `پیگیری‌های انجام‌شده امروز: ${formatNumber(followUpsDone.length)}`
      );
      followUpsDone.slice(0, 10).forEach((f) => {
        lines.push(`— ${f.title} (${f.customer.name})`);
      });
    }
    if (stats.openFollowUps > 0) {
      lines.push(
        `پیگیری‌های باز باقی‌مانده: ${formatNumber(stats.openFollowUps)}`
      );
    }
    if (stats.overdueFollowUps > 0) {
      lines.push(
        `پیگیری‌های عقب‌افتاده: ${formatNumber(
          stats.overdueFollowUps
        )} (نیاز به اقدام)`
      );
    }
  }
  lines.push("");

  lines.push("۳. رزرو و فروش");
  if (bookingsCreated.length === 0 && bookingsSold.length === 0) {
    lines.push("رزرو یا فروشی ثبت نشده است.");
  } else {
    if (bookingsCreated.length > 0) {
      lines.push(
        `رزروهای جدید امروز: ${formatNumber(bookingsCreated.length)}`
      );
    }
    if (bookingsSold.length > 0) {
      lines.push(
        `فروش‌های انجام‌شده امروز: ${formatNumber(bookingsSold.length)}`
      );
      bookingsSold.slice(0, 10).forEach((b) => {
        lines.push(`— ${b.customer.name}`);
      });
    }
  }
  lines.push("");

  lines.push("۴. موارد مهم");
  const importantNotes = activities.filter((a) => a.note && a.note.trim());
  if (importantNotes.length === 0) {
    lines.push("مورد خاصی ثبت نشده است.");
  } else {
    importantNotes.slice(0, 10).forEach((a) => {
      lines.push(`— ${a.note}`);
    });
  }
  lines.push("");

  lines.push("۵. برنامه پیگیری روز بعد");
  const tomorrow = await prisma.followUp.findMany({
    where: { status: "OPEN", dueAt: { gt: dayEnd } },
    orderBy: { dueAt: "asc" },
    take: 10,
    include: { customer: { select: { name: true } } },
  });

  if (tomorrow.length === 0 && stats.overdueFollowUps === 0) {
    lines.push("مورد خاصی برای فردا ثبت نشده است.");
  } else {
    if (stats.overdueFollowUps > 0) {
      lines.push(
        `— ابتدا پیگیری‌های عقب‌افتاده (${formatNumber(
          stats.overdueFollowUps
        )} مورد)`
      );
    }
    tomorrow.forEach((f) => {
      lines.push(`— ${f.title} (${f.customer.name})`);
    });
  }

  const content = lines.join("\n");
  return { content, stats };
}
