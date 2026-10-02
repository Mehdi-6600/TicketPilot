import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function escapeVCard(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;")
    .replace(/\n/g, "\\n");
}

function buildVCard(customer: {
  name: string;
  phone: string;
  note: string | null;
}): string {
  const name = escapeVCard(customer.name.trim());
  const phone = customer.phone.replace(/\s+/g, "");
  const note = customer.note ? escapeVCard(customer.note.trim()) : "";

  const lines: string[] = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${name}`,
    `N:${name};;;;`,
    `TEL;TYPE=CELL:${phone}`,
  ];

  if (note) {
    lines.push(`NOTE:${note}`);
  }

  lines.push("END:VCARD");
  return lines.join("\r\n");
}

export async function GET() {
  try {
    const customers = await prisma.customer.findMany({
      orderBy: { name: "asc" },
      select: { name: true, phone: true, note: true },
    });

    if (customers.length === 0) {
      return NextResponse.json(
        { error: "هیچ مشتری‌ای برای خروجی وجود ندارد" },
        { status: 404 }
      );
    }

    const vcards = customers.map((c) => buildVCard(c)).join("\r\n");

    const filename = `ticketpilot-contacts-${new Date()
      .toISOString()
      .slice(0, 10)}.vcf`;

    // BOM برای پشتیبانی UTF-8 در برخی اپ‌ها
    const body = "\uFEFF" + vcards;

    return new NextResponse(body, {
      headers: {
        "Content-Type": "text/vcard; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "unknown" },
      { status: 500 }
    );
  }
}
