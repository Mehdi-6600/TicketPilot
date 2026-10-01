import { prisma } from "@/lib/prisma";
import {
  startOfTodayTehran,
  endOfTodayTehran,
  endOfTomorrowTehran,
} from "@/lib/date";

export type PlanFollowUp = {
  id: string;
  title: string;
  dueAt: Date;
  customer: { id: string; name: string; phone: string };
  overdue: boolean;
};

export type PlanBooking = {
  id: string;
  status: string;
  amount: number | null;
  currency: "TOMAN" | "OMR" | "USD";
  customer: { id: string; name: string; phone: string };
  travel: { from: string; to: string; departDate: Date } | null;
};

export type PlanTravel = {
  id: string;
  from: string;
  to: string;
  departDate: Date;
  status: string;
  customer: { id: string; name: string; phone: string };
};

export type Plan = {
  overdueFollowUps: PlanFollowUp[];
  todayFollowUps: PlanFollowUp[];
  openBookings: PlanBooking[];
  nearTravels: PlanTravel[];
};

export async function buildPlan(): Promise<Plan> {
  const todayStart = startOfTodayTehran();
  const todayEnd = endOfTodayTehran();
  const tomorrowEnd = endOfTomorrowTehran();

  const [overdue, today, openBookings, nearTravels] = await Promise.all([
    prisma.followUp.findMany({
      where: {
        status: "OPEN",
        dueAt: { lt: todayStart },
      },
      include: { customer: true },
      orderBy: { dueAt: "asc" },
      take: 30,
    }),
    prisma.followUp.findMany({
      where: {
        status: "OPEN",
        dueAt: { gte: todayStart, lte: todayEnd },
      },
      include: { customer: true },
      orderBy: { dueAt: "asc" },
      take: 30,
    }),
    prisma.booking.findMany({
      where: {
        status: {
          in: [
            "INQUIRY",
            "PRICE_QUOTED",
            "WAITING_CUSTOMER",
            "BOOKED",
            "TICKETED",
          ],
        },
      },
      include: {
        customer: true,
        travel: { select: { from: true, to: true, departDate: true } },
      },
      orderBy: { createdAt: "asc" },
      take: 30,
    }),
    prisma.travel.findMany({
      where: {
        departDate: { gte: todayStart, lte: tomorrowEnd },
        status: { in: ["BOOKED", "TICKETED", "IN_TRIP"] },
      },
      include: { customer: true },
      orderBy: { departDate: "asc" },
      take: 30,
    }),
  ]);

  return {
    overdueFollowUps: overdue.map((f) => ({
      id: f.id,
      title: f.title,
      dueAt: f.dueAt,
      customer: {
        id: f.customer.id,
        name: f.customer.name,
        phone: f.customer.phone,
      },
      overdue: true,
    })),
    todayFollowUps: today.map((f) => ({
      id: f.id,
      title: f.title,
      dueAt: f.dueAt,
      customer: {
        id: f.customer.id,
        name: f.customer.name,
        phone: f.customer.phone,
      },
      overdue: false,
    })),
    openBookings: openBookings.map((b) => ({
      id: b.id,
      status: b.status,
      amount: b.amount,
      currency: b.currency,
      customer: {
        id: b.customer.id,
        name: b.customer.name,
        phone: b.customer.phone,
      },
      travel: b.travel
        ? {
            from: b.travel.from,
            to: b.travel.to,
            departDate: b.travel.departDate,
          }
        : null,
    })),
    nearTravels: nearTravels.map((t) => ({
      id: t.id,
      from: t.from,
      to: t.to,
      departDate: t.departDate,
      status: t.status,
      customer: {
        id: t.customer.id,
        name: t.customer.name,
        phone: t.customer.phone,
      },
    })),
  };
}
