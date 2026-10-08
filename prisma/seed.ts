import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const plans = [
  {
    name: "Essentials",
    stripeProductId: "prod_VMTE80JZsvsT8W",
    stripePriceId: "price_1ULkI5Hk7R1EnJ3FYJs3wakt",
    treatmentLimit: 4,
    hyperbaricLimit: 2,
    breathworkLimit: 1,
    guestPassLimit: 1,
  },
  {
    name: "Perform",
    stripeProductId: "prod_VMTFG1GPaUXEs1",
    stripePriceId: "price_1ULkJPHk7R1EnJ3FWRQBddaX",
    treatmentLimit: 8,
    hyperbaricLimit: 4,
    breathworkLimit: 2,
    guestPassLimit: 2,
  },
  {
    name: "Unlimited",
    stripeProductId: "prod_VMTINKqAHkRYfe",
    stripePriceId: "price_1ULkLhHk7R1EnJ3FFt9Jt81b",
    treatmentLimit: null,
    hyperbaricLimit: 8,
    breathworkLimit: 3,
    guestPassLimit: 3,
  },
];

async function main() {
  for (const plan of plans) {
    await prisma.membershipPlan.upsert({
      where: { name: plan.name },
      update: plan,
      create: { ...plan, vipEventAccess: true, isActive: true },
    });
    console.log(`Seeded plan: ${plan.name}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
