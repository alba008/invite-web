export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Pledge from "@/models/Pledge";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const body = await req.json();

  const { fullName, amount, currency, phone, note } = body ?? {};
  if (!fullName || amount == null) {
    return NextResponse.json(
      { error: "fullName and amount are required" },
      { status: 400 }
    );
  }

  await dbConnect();

  const created = await Pledge.create({
    eventSlug: slug,
    fullName: String(fullName).trim(),
    amount: Number(amount),
    currency: currency ? String(currency).toUpperCase() : "USD",
    phone: phone ? String(phone).trim() : undefined,
    note: note ? String(note).trim() : undefined,
  });

  return NextResponse.json({ ok: true, id: String(created._id) });
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  await dbConnect();

  const items = await Pledge.find({ eventSlug: slug })
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json({
    ok: true,
    items: items.map((x: any) => ({
      id: String(x._id),
      eventSlug: x.eventSlug,
      fullName: x.fullName,
      amount: x.amount,
      currency: x.currency ?? "USD",
      phone: x.phone ?? "",
      note: x.note ?? "",
      createdAt: x.createdAt,
      updatedAt: x.updatedAt,
    })),
  });
}
