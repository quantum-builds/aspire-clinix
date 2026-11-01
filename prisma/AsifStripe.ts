import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const rows = [
  {
    // Compression Therapy
    treatmentId: 1367625,
    stripePriceId: "price_1UL38vHk7R1EnJ3FIem32gAK",
    stripeProductId: "prod_VLkeTStm2pl6Cm",
  },
  {
    // Cryotherapy
    treatmentId: 1367621,
    stripePriceId: "price_1UL3A9Hk7R1EnJ3FN26dDWu4",
    stripeProductId: "prod_VLkfVmmsaeIgJQ",
  },
  {
    // Contrast Session (Cryo + Sauna)
    treatmentId: 1367845,
    stripePriceId: "price_1UUo7DHk7R1EnJ3F9Nn0hThx",
    stripeProductId: "prod_VVpm3O0clytdMm",
  },
  {
    // Contrast Session (Ice Bath + Sauna)
    treatmentId: 1526324,
    stripePriceId: "price_1UTjmSHk7R1EnJ3FhscftQCb",
    stripeProductId: "prod_VUjEB2eVWpA0by",
  },
  {
    // Ice Bath
    treatmentId: 1367626,
    stripePriceId: "price_1UL3BKHk7R1EnJ3FeVMp5Hc2",
    stripeProductId: "prod_VLkgV9rlMYiuiz",
  },
  {
    // Hyperbaric Oxygen Chamber
    treatmentId: 1367623,
    stripePriceId: "price_1UL3AhHk7R1EnJ3FfyCTCGS5",
    stripeProductId: "prod_VLkgyk2MuJqCxm",
  },
  {
    // Red Light Therapy
    treatmentId: 1367624,
    stripePriceId: "price_1UL3CTHk7R1EnJ3FLhiUUhFx",
    stripeProductId: "prod_VLkhW6mBLDA0px",
  },
  {
    // Infrared Sauna
    treatmentId: 1367622,
    stripePriceId: "price_1UL3BqHk7R1EnJ3F1aniri5l",
    stripeProductId: "prod_VLkhcwyRrkJfqn",
  },
];

function assertNoDuplicates() {
  const fields = ["treatmentId", "stripePriceId", "stripeProductId"] as const;
  for (const field of fields) {
    const seen = new Set<string | number>();
    for (const row of rows) {
      const value = row[field];
      if (seen.has(value)) {
        throw new Error(
          `Duplicate ${field} in seed data: ${value}. Fix it in prisma/AsifStripe.ts.`
        );
      }
      seen.add(value);
    }
  }
}

async function main() {
  assertNoDuplicates();

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