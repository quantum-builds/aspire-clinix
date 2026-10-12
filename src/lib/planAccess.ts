export const PLAN_ACCESS_COOKIE = "plan_access";


export function isAccessGateEnabled(): boolean {
  return (
    process.env.PLAN_ACCESS_ENABLED === "true" &&
    !!process.env.PLAN_ACCESS_PASSWORD
  );
}

export async function getExpectedToken(): Promise<string> {
  const password = process.env.PLAN_ACCESS_PASSWORD ?? "";
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode("plan-access-v1"),
  );
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

// Only allow redirects to paths inside your own site
export function safeNextPath(next: string | null): string {
  if (next && next.startsWith("/") && !next.startsWith("//")) return next;
  return "/patient/plan-selection";
}