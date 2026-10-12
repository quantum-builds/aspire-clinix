import { Suspense } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AccessForm from "./AccessForm";
import {
  PLAN_ACCESS_COOKIE,
  getExpectedToken,
  isAccessGateEnabled,
  safeEqual,
  safeNextPath,
} from "@/lib/planAccess";

export default async function AccessPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  // Gate is off: skip the password form
  if (!isAccessGateEnabled()) {
    redirect(safeNextPath(next ?? null));
  }

  const cookie = (await cookies()).get(PLAN_ACCESS_COOKIE)?.value ?? "";

  if (cookie && safeEqual(cookie, await getExpectedToken())) {
    redirect(safeNextPath(next ?? null));
  }

  return (
    <Suspense fallback={null}>
      <AccessForm />
    </Suspense>
  );
}