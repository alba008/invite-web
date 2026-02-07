import { NextResponse } from "next/server";
import { expectedCodeForSlug } from "@/lib/inviteAccess";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const body = await req.json().catch(() => ({}));

  const code = String(body?.code || "").trim();
  if (!code) {
    return NextResponse.json({ error: "Code is required." }, { status: 400 });
  }

  const expected = expectedCodeForSlug(slug);
  if (!expected) {
    return NextResponse.json(
      { error: "No access code configured for this event." },
      { status: 500 }
    );
  }

  if (code !== expected) {
    return NextResponse.json({ error: "Invalid access code." }, { status: 401 });
  }

  return NextResponse.json({ ok: true });
}
