import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") ?? "").trim();

    if (q.length < 2) {
      return NextResponse.json({
        ok: true,
        customers: [],
        bookings: [],
        travels: [],
      });
    }

    const [customers, bookings, travels] = await Promise.all([
      prisma.customer.findMany({
        where: {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { phone: { contains: q } },
          ],
        },
        take: 5,
        select: { id: true, name: true, phone: true },
      }),
      prisma.booking.findMany({
        where: {
          OR: [
            { note: { contains: q, mode: "insensitive" } },
            { customer: { name: { contains: q, mode: "insensitive" } } },
            { customer: { phone: { contains: q } } },
          ],
        },
        take: 5,
        include: {
          customer: { select: { id: true, name: true } },
          travel: { select: { from: true, to: true } },
        },
      }),
      prisma.travel.findMany({
        where: {
          OR: [
            { from: { contains: q, mode: "insensitive" } },
            { to: { contains: q, mode: "insensitive" } },
            { customer: { name: { contains: q, mode: "insensitive" } } },
          ],
        },
        take: 5,
        include: {
          customer: { select: { id: true, name: true } },
        },
      }),
    ]);

    return NextResponse.json({
      ok: true,
      customers,
      bookings: bookings.map((b) => ({
        id: b.id,
        status: b.status,
        customer: b.customer,
        travel: b.travel,
        amount: b.amount,
        currency: b.currency,
      })),
      travels,
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "unknown" },
      { status: 500 }
    );
  }
}
