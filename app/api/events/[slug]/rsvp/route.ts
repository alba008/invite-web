export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import RSVP from "@/models/RSVP";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const body = await req.json();

  const { fullName, status, guests, phone, message } = body ?? {};
  if (!fullName || !status) {
    return NextResponse.json(
      { error: "fullName and status are required" },
      { status: 400 }
    );
  }

  await dbConnect();

  const created = await RSVP.create({
    eventSlug: slug,
    fullName: String(fullName).trim(),
    status,
    guests: Number.isFinite(Number(guests)) ? Number(guests) : 0,
    phone: phone ? String(phone).trim() : undefined,
    message: message ? String(message).trim() : undefined,
  });

  return NextResponse.json({ ok: true, id: String(created._id) });
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  await dbConnect();

  const items = await RSVP.find({ eventSlug: slug })
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json({
    ok: true,
    items: items.map((x: any) => ({
      id: String(x._id),
      eventSlug: x.eventSlug,
      fullName: x.fullName,
      status: x.status,
      guests: x.guests ?? 0,
      phone: x.phone ?? "",
      message: x.message ?? "",
      createdAt: x.createdAt,
      updatedAt: x.updatedAt,
    })),
  });
}
