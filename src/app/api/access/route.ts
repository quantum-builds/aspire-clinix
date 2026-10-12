import { NextRequest, NextResponse } from "next/server";
import {
  PLAN_ACCESS_COOKIE,
  getExpectedToken,
  safeEqual,
  isAccessGateEnabled,
} from "@/lib/planAccess";

// Simple in-memory rate limit: 5 attempts per minute per IP.
// On serverless hosting (e.g. Vercel) use Upstash Ratelimit instead.
const attempts = new Map<string, { count: number; resetAt: number }>();
const LIMIT = 5;
const WINDOW_MS = 60_000;

function isLimited(ip: string) {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || entry.resetAt < now) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > LIMIT;
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (!isAccessGateEnabled()) {
    return NextResponse.json(
      { ok: false, message: "Access check is disabled" },
      { status: 404 },
    );
  }

  if (isLimited(ip)) {
    return NextResponse.json(
      { ok: false, message: "Too many attempts. Try again in a minute." },
      { status: 429 },
    );
  }

  const body = await req.json().catch(() => ({}));
  const password = typeof body?.password === "string" ? body.password : "";
  const real = process.env.PLAN_ACCESS_PASSWORD ?? "";

  if (!real || !safeEqual(password, real)) {
    return NextResponse.json(
      { ok: false, message: "Incorrect password" },
      { status: 401 },
    );
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(PLAN_ACCESS_COOKIE, await getExpectedToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
  return res;
}
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(PLAN_ACCESS_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0, // expires it immediately
  });
  return res;
}
