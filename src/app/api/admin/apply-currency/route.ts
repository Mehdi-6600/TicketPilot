import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // 1) ساخت enum اگر نیست
    await prisma.$executeRawUnsafe(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'Currency') THEN
          CREATE TYPE "Currency" AS ENUM ('TOMAN', 'OMR', 'USD');
        END IF;
      END $$;
    `);

    // 2) اضافه کردن ستون currency به Activity اگر نیست
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "Activity"
        ADD COLUMN IF NOT EXISTS "currency" "Currency" NOT NULL DEFAULT 'TOMAN';
    `);

    // 3) اضافه کردن ستون currency به Booking اگر نیست
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "Booking"
        ADD COLUMN IF NOT EXISTS "currency" "Currency" NOT NULL DEFAULT 'TOMAN';
    `);

    // 4) چک نهایی
    const result = await prisma.$queryRawUnsafe<
      { column_name: string }[]
    >(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name IN ('Activity', 'Booking')
        AND column_name = 'currency';
    `);

    return NextResponse.json({
      ok: true,
      message: "columns added",
      found: result,
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "unknown" },
      { status: 500 }
    );
  }
}
