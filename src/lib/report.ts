import { prisma } from "@/lib/prisma";
import {
  startOfTodayTehran,
  endOfTodayTehran,
  toPersianDate,
} from "@/lib/date";
import { formatNumber, formatAmount } from "@/lib/format";
import { getActivityMeta } from "@/lib/activity";
import { BOOKING_STATUS_LABELS } from "@/lib/booking";
import { TRAVEL_STATUS_LABELS } from "@/lib/travel";

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

const CURRENCY_EMOJI: Record<string, string> = {
  TOMAN: "🇮🇷",
  OMR: "🇴🇲",
  USD: "🇺🇸",
};

// تبدیل متن فارسی/انگلیسی به Unicode Bold
// چون textarea فونت بولد را نمایش نمی‌دهد، از کاراکترهای یونیکد استفاده می‌کنیم
const BOLD_MAP: Record<string, string> = {
  "0": "𝟎",
  "1": "𝟏",
  "2": "𝟐",
  "3": "𝟑",
  "4": "𝟒",
  "5": "𝟓",
  "6": "𝟔",
  "7": "𝟕",
  "8": "𝟖",
  "9": "𝟗",
  A: "𝗔",
  B: "𝗕",
  C: "𝗖",
  D: "𝗗",
  E: "𝗘",
  F: "𝗙",
  G: "𝗚",
  H: "𝗛",
  I: "𝗜",
  J: "𝗝",
  K: "𝗞",
  L: "𝗟",
  M: "𝗠",
  N: "𝗡",
  O: "𝗢",
  P: "𝗣",
  Q: "𝗤",
  R: "𝗥",
  S: "𝗦",
  T: "𝗧",
  U: "𝗨",
  V: "𝗩",
  W: "𝗪",
  X: "𝗫",
  Y: "𝗬",
  Z: "𝗭",
  a: "𝗮",
  b: "𝗯",
  c: "𝗰",
  d: "𝗱",
  e: "𝗲",
  f: "𝗳",
  g: "𝗴",
  h: "𝗵",
  i: "𝗶",
  j: "𝗷",
  k: "𝗸",
  l: "𝗹",
  m: "𝗺",
  n: "𝗻",
  o: "𝗼",
  p: "𝗽",
  q: "𝗾",
  r: "𝗿",
  s: "𝘀",
  t: "𝘁",
  u: "𝘂",
  v: "𝘃",
  w: "𝘄",
  x: "𝘅",
  y: "𝘆",
  z: "𝘇",
};

function bold(input: string): string {
  return input
    .split("")
    .map((ch) => BOLD_MAP[ch] ?? ch)
    .join("");
}

const SEP = "━━━━━━━━━━━━━━━━━━━━";

function sectionHeader(emoji: string, title: string): string[] {
  // فقط یک خط جداکننده بالا — بدون خط پایین
  return [SEP, `${emoji} ${bold(title)}`, ""];
}

function sumByCurrency(
  items: { amount: number | null; currency: "TOMAN" | "OMR" | "USD" }[]
): { TOMAN: number; OMR: number; USD: number } {
  const out = { TOMAN: 0, OMR: 0, USD: 0 };
  for (const it of items) {
    if (it.amount === null) continue;
    out[it.currency] += it.amount;
  }
  return out;
}

export async function buildReportContent(date: Date): Promise<{
  content: string;
  stats: ReportStats;
}> {
  const dayStart = startOfTodayTehran();
  const dayEnd = endOfTodayTehran();

  const activities = await prisma.activity.findMany({
    where: { createdAt: { gte: dayStart, lte: dayEnd } },
    include: {
      customer: { select: { name: true, phone: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  const followUpsDone = await prisma.followUp.findMany({
    where: { doneAt: { gte: dayStart, lte: dayEnd }, status: "DONE" },
    include: { customer: { select: { name: true } } },
  });

  const followUpsOpenToday = await prisma.followUp.findMany({
    where: {
      status: "OPEN",
      dueAt: { gte: dayStart, lte: dayEnd },
    },
    include: { customer: { select: { name: true } } },
  });

  const followUpsOpen = await prisma.followUp.count({
    where: { status: "OPEN" },
  });

  const followUpsOverdue = await prisma.followUp.findMany({
    where: { status: "OPEN", dueAt: { lt: dayStart } },
    include: { customer: { select: { name: true } } },
    orderBy: { dueAt: "asc" },
    take: 20,
  });

  const bookingsCreated = await prisma.booking.findMany({
    where: { createdAt: { gte: dayStart, lte: dayEnd } },
    include: {
      customer: { select: { name: true } },
      travel: { select: { from: true, to: true } },
    },
  });

  const bookingsSold = await prisma.booking.findMany({
    where: { updatedAt: { gte: dayStart, lte: dayEnd }, status: "SOLD" },
    include: {
      customer: { select: { name: true } },
      travel: { select: { from: true, to: true } },
    },
  });

  const upcomingTravels = await prisma.travel.findMany({
    where: {
      departDate: { gte: dayStart, lte: dayEnd },
      status: { in: ["BOOKED", "TICKETED", "IN_TRIP"] },
    },
    include: { customer: { select: { name: true } } },
    orderBy: { departDate: "asc" },
    take: 20,
  });

  const countBy = (type: string) =>
    activities.filter((a) => a.type === type).length;

  const saleActivities = activities.filter((a) => a.type === "SALE");
  const salesByCurrency = sumByCurrency(
    saleActivities.map((a) => ({
      amount: a.amount,
      currency: a.currency,
    }))
  );
  const soldByCurrency = sumByCurrency(
    bookingsSold.map((b) => ({ amount: b.amount, currency: b.currency }))
  );

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
    overdueFollowUps: followUpsOverdue.length,
    activeBookings: bookingsCreated.length,
    soldBookings: bookingsSold.length,
    upcomingTravels: upcomingTravels.length,
  };

  const lines: string[] = [];
  const todayLabel = toPersianDate(dayStart);

  // ====== تیتر رسمی ======
  lines.push(`🛫 ${bold("گزارش کار خانم شهین جراحی")}`);
  lines.push(`📅 ${bold("به تاریخ")} ${todayLabel}`);
  lines.push("");
  lines.push("بسمه تعالی");
  lines.push("");

  // ====== ۱) خلاصه عملکرد ======
  lines.push(...sectionHeader("📊", "۱) خلاصه عملکرد روز"));
  lines.push(
    `در تاریخ ${todayLabel} در مجموع ${formatNumber(
      stats.totalActivities
    )} فعالیت در سیستم به ثبت رسیده است.`
  );
  if (stats.totalActivities === 0) {
    lines.push("❗ در این روز هیچ فعالیتی ثبت نشده است.");
  } else {
    lines.push("");
    if (stats.calls > 0)
      lines.push(`📞 تماس با مشتری: ${formatNumber(stats.calls)}`);
    if (stats.replies > 0)
      lines.push(`💬 پاسخ به مشتری: ${formatNumber(stats.replies)}`);
    if (stats.inquiries > 0)
      lines.push(`🔍 استعلام پرواز: ${formatNumber(stats.inquiries)}`);
    if (stats.priceQuotes > 0)
      lines.push(`💰 اعلام قیمت: ${formatNumber(stats.priceQuotes)}`);
    if (stats.followUps > 0)
      lines.push(`🔔 پیگیری مشتری: ${formatNumber(stats.followUps)}`);
    if (stats.bookings > 0)
      lines.push(`🎫 رزرو بلیت: ${formatNumber(stats.bookings)}`);
    if (stats.sales > 0)
      lines.push(`💵 فروش بلیت: ${formatNumber(stats.sales)}`);
    if (stats.cancels > 0)
      lines.push(`❌ کنسلی: ${formatNumber(stats.cancels)}`);
    if (stats.changes > 0)
      lines.push(`🔄 تغییر رزرو: ${formatNumber(stats.changes)}`);
    if (stats.tripFollowUps > 0)
      lines.push(`✈️ پیگیری سفر: ${formatNumber(stats.tripFollowUps)}`);
    if (stats.others > 0)
      lines.push(`📌 موارد متفرقه: ${formatNumber(stats.others)}`);
  }
  lines.push("");

  // ====== ۲) تماس و پاسخگویی ======
  lines.push(...sectionHeader("📞", "۲) تماس و پاسخگویی به مشتریان"));
  const callActivities = activities.filter(
    (a) => a.type === "CALL" || a.type === "REPLY"
  );
  if (callActivities.length === 0) {
    lines.push("در این بخش فعالیتی ثبت نشده است.");
  } else {
    lines.push(
      `در این روز ${formatNumber(
        callActivities.length
      )} مورد تماس یا پاسخگویی با مشتریان انجام شده است:`
    );
    lines.push("");
    callActivities.forEach((a, idx) => {
      const meta = getActivityMeta(a.type);
      const who = a.customer
        ? `${a.customer.name} (${a.customer.phone})`
        : "بدون مشتری";
      lines.push(`${idx + 1}. ${meta.icon} ${meta.label} — ${who}`);
      if (a.note) lines.push(`   📝 یادداشت: ${a.note}`);
    });
  }
  lines.push("");

  // ====== ۳) استعلام و اعلام قیمت ======
  lines.push(...sectionHeader("🔍", "۳) استعلام پرواز و اعلام قیمت"));
  const inquiryActivities = activities.filter(
    (a) => a.type === "INQUIRY" || a.type === "PRICE_QUOTE"
  );
  if (inquiryActivities.length === 0) {
    lines.push("در این بخش فعالیتی ثبت نشده است.");
  } else {
    lines.push(
      `در این روز ${formatNumber(
        inquiryActivities.length
      )} مورد استعلام یا اعلام قیمت انجام شده است:`
    );
    lines.push("");
    inquiryActivities.forEach((a, idx) => {
      const meta = getActivityMeta(a.type);
      const who = a.customer
        ? `${a.customer.name} (${a.customer.phone})`
        : "بدون مشتری";
      lines.push(`${idx + 1}. ${meta.icon} ${meta.label} — ${who}`);
      if (a.note) lines.push(`   📝 یادداشت: ${a.note}`);
    });
  }
  lines.push("");

  // ====== ۴) پیگیری‌ها ======
  lines.push(...sectionHeader("🔔", "۴) پیگیری‌ها"));
  if (followUpsDone.length === 0 && followUpsOpenToday.length === 0) {
    lines.push("پیگیری خاصی در این روز ثبت یا انجام نشده است.");
  } else {
    if (followUpsDone.length > 0) {
      lines.push(
        `✅ پیگیری‌های انجام‌شده امروز (${formatNumber(
          followUpsDone.length
        )} مورد):`
      );
      followUpsDone.forEach((f, idx) => {
        lines.push(`   ${idx + 1}. ${f.title} — ${f.customer.name}`);
      });
      lines.push("");
    }
    if (followUpsOpenToday.length > 0) {
      lines.push(
        `🕐 پیگیری‌های در دست اقدام امروز (${formatNumber(
          followUpsOpenToday.length
        )} مورد):`
      );
      followUpsOpenToday.forEach((f, idx) => {
        lines.push(`   ${idx + 1}. ${f.title} — ${f.customer.name}`);
      });
    }
  }
  lines.push("");

  // ====== ۵) رزرو و فروش ======
  lines.push(...sectionHeader("🎫", "۵) رزرو و فروش"));
  if (
    bookingsCreated.length === 0 &&
    bookingsSold.length === 0 &&
    saleActivities.length === 0
  ) {
    lines.push("رزرو یا فروشی در این روز ثبت نشده است.");
  } else {
    if (bookingsCreated.length > 0) {
      lines.push(
        `📌 رزروهای جدید ثبت‌شده (${formatNumber(
          bookingsCreated.length
        )} مورد):`
      );
      lines.push("");
      bookingsCreated.forEach((b, idx) => {
        const route = b.travel
          ? `${b.travel.from} ✈️ ${b.travel.to}`
          : "بدون سفر مرتبط";
        const amountStr =
          b.amount !== null
            ? ` — ${CURRENCY_EMOJI[b.currency] ?? ""} ${formatAmount(
                b.amount,
                b.currency
              )}`
            : "";
        lines.push(
          `   ${idx + 1}. 👤 ${b.customer.name} — 🗺️ ${route} — 📌 ${
            BOOKING_STATUS_LABELS[b.status]
          }${amountStr}`
        );
      });
      lines.push("");
    }

    if (bookingsSold.length > 0) {
      lines.push(
        `💰 فروش‌های نهایی‌شده امروز (${formatNumber(
          bookingsSold.length
        )} مورد):`
      );
      lines.push("");
      bookingsSold.forEach((b, idx) => {
        const route = b.travel
          ? `${b.travel.from} ✈️ ${b.travel.to}`
          : "بدون سفر مرتبط";
        const amountStr =
          b.amount !== null
            ? ` — ${CURRENCY_EMOJI[b.currency] ?? ""} ${formatAmount(
                b.amount,
                b.currency
              )}`
            : " — مبلغ ثبت نشده";
        lines.push(
          `   ${idx + 1}. 👤 ${b.customer.name} — 🗺️ ${route}${amountStr}`
        );
      });
      lines.push("");
    }

    if (saleActivities.length > 0) {
      lines.push(
        `💵 فعالیت‌های فروش ثبت‌شده (${formatNumber(
          saleActivities.length
        )} مورد):`
      );
      lines.push("");
      saleActivities.forEach((a, idx) => {
        const who = a.customer
          ? `${a.customer.name} (${a.customer.phone})`
          : "بدون مشتری";
        const amountStr =
          a.amount !== null
            ? ` — ${CURRENCY_EMOJI[a.currency] ?? ""} ${formatAmount(
                a.amount,
                a.currency
              )}`
            : "";
        lines.push(`   ${idx + 1}. 💵 ${who}${amountStr}`);
        if (a.note) lines.push(`       📝 ${a.note}`);
      });
      lines.push("");
    }

    const totalTomans = salesByCurrency.TOMAN + soldByCurrency.TOMAN;
    const totalOman = salesByCurrency.OMR + soldByCurrency.OMR;
    const totalUsd = salesByCurrency.USD + soldByCurrency.USD;

    if (totalTomans > 0 || totalOman > 0 || totalUsd > 0) {
      lines.push(`📊 ${bold("جمع مبالغ فروش امروز به تفکیک ارز")}:`);
      if (totalTomans > 0)
        lines.push(`   🇮🇷 تومان: ${formatAmount(totalTomans, "TOMAN")}`);
      if (totalOman > 0)
        lines.push(`   🇴🇲 ریال عمان: ${formatAmount(totalOman, "OMR")}`);
      if (totalUsd > 0)
        lines.push(`   🇺🇸 دلار: ${formatAmount(totalUsd, "USD")}`);
    }
  }
  lines.push("");

  // ====== ۶) وضعیت سفرها ======
  lines.push(...sectionHeader("✈️", "۶) وضعیت سفرها"));
  if (upcomingTravels.length === 0) {
    lines.push("سفر مرتبطی برای این روز ثبت نشده است.");
  } else {
    lines.push(
      `در این روز ${formatNumber(
        upcomingTravels.length
      )} سفر در جریان یا نزدیک به پرواز داریم:`
    );
    lines.push("");
    upcomingTravels.forEach((t, idx) => {
      lines.push(
        `   ${idx + 1}. 👤 ${t.customer.name} — 🗺️ ${t.from} ✈️ ${
          t.to
        } — 📌 ${TRAVEL_STATUS_LABELS[t.status]}`
      );
      if (t.note) lines.push(`       📝 ${t.note}`);
    });
  }
  lines.push("");

  // ====== ۷) موارد مهم ======
  lines.push(...sectionHeader("📝", "۷) موارد مهم و یادداشت‌های کلیدی"));
  const importantNotes = activities.filter(
    (a) => a.note && a.note.trim().length > 0
  );
  if (importantNotes.length === 0) {
    lines.push("مورد خاصی ثبت نشده است.");
  } else {
    importantNotes.forEach((a, idx) => {
      const meta = getActivityMeta(a.type);
      const who = a.customer ? a.customer.name : "—";
      lines.push(`${idx + 1}. ${meta.icon} [${meta.label}] ${who}`);
      lines.push(`   📝 ${a.note}`);
    });
  }
  lines.push("");

  // ====== ۸) پیگیری‌های باقی‌مانده ======
  lines.push(...sectionHeader("⚠️", "۸) پیگیری‌های باقی‌مانده و عقب‌افتاده"));
  if (followUpsOverdue.length === 0 && stats.openFollowUps === 0) {
    lines.push("✅ هیچ پیگیری باقی‌مانده‌ای وجود ندارد.");
  } else {
    if (stats.openFollowUps > 0) {
      lines.push(
        `📋 تعداد کل پیگیری‌های باز در سیستم: ${formatNumber(
          stats.openFollowUps
        )} مورد`
      );
    }
    if (followUpsOverdue.length > 0) {
      lines.push("");
      lines.push(
        `🚨 پیگیری‌های عقب‌افتاده (نیازمند اقدام فوری) — ${formatNumber(
          followUpsOverdue.length
        )} مورد:`
      );
      followUpsOverdue.forEach((f, idx) => {
        lines.push(`   ${idx + 1}. ${f.title} — 👤 ${f.customer.name}`);
      });
    }
  }
  lines.push("");

  // ====== ۹) برنامه پیگیری روز بعد ======
  lines.push(...sectionHeader("📅", "۹) برنامه پیشنهادی برای روز بعد"));
  const tomorrowFollowUps = await prisma.followUp.findMany({
    where: {
      status: "OPEN",
      dueAt: { gt: dayEnd },
    },
    orderBy: { dueAt: "asc" },
    take: 15,
    include: { customer: { select: { name: true } } },
  });

  if (followUpsOverdue.length === 0 && tomorrowFollowUps.length === 0) {
    lines.push("مورد مشخصی برای پیگیری روز بعد ثبت نشده است.");
  } else {
    if (followUpsOverdue.length > 0) {
      lines.push(
        `   🔴 اولویت اول: رسیدگی به ${formatNumber(
          followUpsOverdue.length
        )} پیگیری عقب‌افتاده.`
      );
    }
    tomorrowFollowUps.forEach((f, idx) => {
      lines.push(
        `   ${idx + 1}. 🔔 پیگیری «${f.title}» با مشتری ${f.customer.name}`
      );
    });
  }
  lines.push("");

  lines.push(SEP);
  lines.push(`✍️ ${bold("پایان گزارش")}`);

  const content = lines.join("\n");
  return { content, stats };
}
