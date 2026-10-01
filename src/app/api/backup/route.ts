import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [
      customers,
      travels,
      bookings,
      followUps,
      activities,
      reports,
    ] = await Promise.all([
      prisma.customer.findMany(),
      prisma.travel.findMany(),
      prisma.booking.findMany(),
      prisma.followUp.findMany(),
      prisma.activity.findMany(),
      prisma.dailyReport.findMany(),
    ]);

    const backup = {
      exportedAt: new Date().toISOString(),
      version: 1,
      counts: {
        customers: customers.length,
        travels: travels.length,
        bookings: bookings.length,
        followUps: followUps.length,
        activities: activities.length,
        reports: reports.length,
      },
      data: {
        customers,
        travels,
        bookings,
        followUps,
        activities,
        reports,
      },
    };

    const filename = `ticketpilot-backup-${new Date()
      .toISOString()
      .slice(0, 10)}.json`;

    return new NextResponse(JSON.stringify(backup, null, 2), {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "unknown" },
      { status: 500 }
    );
  }
}
