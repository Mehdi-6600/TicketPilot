import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const customers = await prisma.customer.count();
  const activities = await prisma.activity.count();
  const bookings = await prisma.booking.count();
  const travels = await prisma.travel.count();
  const followUps = await prisma.followUp.count();
  const reports = await prisma.dailyReport.count();

  const recentActivities = await prisma.activity.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      id: true,
      type: true,
      createdAt: true,
      customerId: true,
    },
  });

  return NextResponse.json({
    counts: { customers, activities, bookings, travels, followUps, reports },
    recentActivities,
    now: new Date().toISOString(),
  });
}
