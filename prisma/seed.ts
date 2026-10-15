// prisma/seed.ts
// Resets and seeds the TreatmentStripe table.
// Run with:  npx prisma db seed

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const rows = [
  {
    treatmentId: 1367621,
    stripePriceId: "price_1UPSAHBcDsmTVqg63bRlFPBD",
    stripeProductId: "prod_VQIlxD7Y9UxETt",
  },
  {
    treatmentId: 1367845,
    stripePriceId: "price_1UPSBkBcDsmTVqg6GWs32v0p",
    stripeProductId: "prod_VQInlA2FBjOVF4",
  },
  {
    treatmentId: 1367623,
    stripePriceId: "price_1UPSDNBcDsmTVqg6MZtaGySk",
    stripeProductId: "prod_VQIpv3dxfzSWmL",
  },
  {
    treatmentId: 1367626,
    stripePriceId: "price_1UPSEbBcDsmTVqg6pmbj6ejn",
    stripeProductId: "prod_VQIqOEbWBhYVvA",
  },
  {
    treatmentId: 1367624,
    stripePriceId: "price_1UPSGJBcDsmTVqg6QN7s4YVl",
    stripeProductId: "prod_VQIslMbiINB0DH",
  },
  {
    // FIXME: this treatmentId is a duplicate of the 3rd row (1367622).
    // treatmentId is the primary key, so each row needs its own value.
    // Change it to the correct treatment id before running the seed.
    treatmentId: 1367622,
    stripePriceId: "price_1UPSJUBcDsmTVqg6tRTgTHsI",
    stripeProductId: "prod_VQIvOWfq24aXzW",
  },
];

// treatmentId is @id, stripePriceId and stripeProductId are @unique,
// so none of the three may repeat within the list.
function assertNoDuplicates() {
  const fields = ["treatmentId", "stripePriceId", "stripeProductId"] as const;
  for (const field of fields) {
    const seen = new Set<string | number>();
    for (const row of rows) {
      const value = row[field];
      if (seen.has(value)) {
        throw new Error(
          `Duplicate ${field} in seed data: ${value}. Fix it in prisma/seed.ts.`
        );
      }
      seen.add(value);
    }
  }
}

async function main() {
  assertNoDuplicates();

  // Delete and re-insert inside one transaction: if anything fails,
  // nothing is deleted and the table stays as it was.
  await prisma.$transaction([
    prisma.treatmentStripe.deleteMany(),
    prisma.treatmentStripe.createMany({ data: rows }),
  ]);

  console.log(`Seeded ${rows.length} TreatmentStripe rows`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });