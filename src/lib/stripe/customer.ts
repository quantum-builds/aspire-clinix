import type { Patient } from "@prisma/client";
import Stripe from "stripe";
import prisma from "@/lib/db";
import { stripe } from "@/lib/stripe/client";

/**
 * Return the patient's Stripe Customer id, creating the customer on first use.
 *
 * The stored id is checked against Stripe because it can stop existing: the
 * customer may be deleted in the dashboard, or the app may switch from test
 * to live keys, where test-mode ids are unknown. In both cases a new customer
 * is created and stored.
 */
export async function getOrCreateStripeCustomer(patient: Patient): Promise<string> {
  if (patient.stripeCustomerId) {
    try {
      const existing = await stripe.customers.retrieve(patient.stripeCustomerId);

      if (!existing.deleted) {
        return existing.id;
      }
    } catch (error) {
      if (
        !(error instanceof Stripe.errors.StripeInvalidRequestError) ||
        error.code !== "resource_missing"
      ) {
        throw error;
      }
    }
  }

  const customer = await stripe.customers.create({
    email: patient.email,
    name: patient.name,
    metadata: {
      app: "aspire-clinix",
      patientId: patient.id,
      dentallyId: String(patient.dentallyId),
    },
  });

  // Only store it if nobody stored another one in the meantime, so two
  // concurrent checkouts settle on one customer.
  const stored = await prisma.patient.updateMany({
    where: {
      id: patient.id,
      stripeCustomerId: patient.stripeCustomerId ?? null,
    },
    data: { stripeCustomerId: customer.id },
  });

  if (stored.count === 1) {
    return customer.id;
  }

  const current = await prisma.patient.findUnique({
    where: { id: patient.id },
    select: { stripeCustomerId: true },
  });

  if (current?.stripeCustomerId) {
    // Lost the race; the customer created above is unused but harmless.
    await stripe.customers.del(customer.id).catch(() => undefined);
    return current.stripeCustomerId;
  }

  return customer.id;
}
