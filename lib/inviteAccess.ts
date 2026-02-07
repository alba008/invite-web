import { NextResponse } from "next/server";

function getInviteCodes(): Record<string, string> {
  const raw = process.env.INVITE_CODES_JSON || "{}";
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function expectedCodeForSlug(slug: string): string | null {
  const codes = getInviteCodes();
  const v = codes[slug];
  return typeof v === "string" && v.trim() ? v.trim() : null;
}

export function requireInviteCode(req: Request, slug: string) {
  const expected = expectedCodeForSlug(slug);
  if (!expected) {
    // If you want "no code configured = open", change this behavior.
    return NextResponse.json(
      { error: "No access code configured for this event." },
      { status: 500 }
    );
  }

  const got =
    req.headers.get("x-invite-code") ||
    req.headers.get("X-Invite-Code") ||
    "";

  if (got.trim() !== expected) {
    return NextResponse.json({ error: "Invalid access code." }, { status: 401 });
  }

  return null; // ok
}
