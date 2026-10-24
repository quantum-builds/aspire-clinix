import { Prisma } from "@prisma/client";
import prisma from "@/lib/db";

/**
 * Idempotency for Stripe webhook deliveries.
 *
 * Stripe retries any non-2xx response and can deliver the same event more
 * than once. Every event is claimed by inserting its id before it is handled:
 * - processed already            -> skip, it is a duplicate
 * - claimed by a run in progress -> skip, Stripe will retry later
 * - claimed by a run that died   -> take it over after STALE_CLAIM_MS
 *
 * On a handler error the claim is released, so Stripe's retry starts clean.
 */

const STALE_CLAIM_MS = 5 * 60 * 1000;

export type ClaimResult = "claimed" | "duplicate" | "in_progress";

export async function claimEvent(id: string, type: string): Promise<ClaimResult> {
  try {
    await prisma.stripeWebhookEvent.create({ data: { id, type } });
    return "claimed";
  } catch (error) {
    if (
      !(error instanceof Prisma.PrismaClientKnownRequestError) ||
      error.code !== "P2002"
    ) {
      throw error;
    }
  }

  const existing = await prisma.stripeWebhookEvent.findUnique({ where: { id } });

  if (!existing) {
    // Released between our insert and this read; claim it again.
    return claimEvent(id, type);
  }

  if (existing.processedAt) {
    return "duplicate";
  }

  // Take over a stale claim only if nobody else took it over first.
  const takeover = await prisma.stripeWebhookEvent.updateMany({
    where: {
      id,
      processedAt: null,
      receivedAt: { lt: new Date(Date.now() - STALE_CLAIM_MS) },
    },
    data: { receivedAt: new Date() },
  });

  return takeover.count === 1 ? "claimed" : "in_progress";
}

export async function markProcessed(id: string): Promise<void> {
  await prisma.stripeWebhookEvent.update({
    where: { id },
    data: { processedAt: new Date() },
  });
}

export async function releaseEvent(id: string): Promise<void> {
  await prisma.stripeWebhookEvent.deleteMany({
    where: { id, processedAt: null },
  });
}
