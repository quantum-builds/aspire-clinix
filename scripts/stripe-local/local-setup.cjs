process.env.DATABASE_URL = process.env.LOCAL_DATABASE_URL || "postgresql://postgres@localhost:5433/aspire_clinic";
if (!process.env.DATABASE_URL.includes("localhost")) throw new Error("refusing: not a local database");
const { PrismaClient } = require(require("path").resolve(__dirname, "../../node_modules/@prisma/client"));
const p = new PrismaClient();
(async () => {
  const plans = [
    ["Essentials","prod_VQIyS7tZAIW2OJ","price_1UPSMkBcDsmTVqg6QBp6qwtp",4,2,1],
    ["Perform","prod_VQJ06gZJYbtzmB","price_1UPSO9BcDsmTVqg6pwQhESQu",8,4,2],
    ["Unlimited","prod_VQJ1r3vSRT1M78","price_1UPSPPBcDsmTVqg6dleWw45E",null,8,3],
  ];
  for (const [name,prod,price,t,h,b] of plans)
    await p.membershipPlan.upsert({ where:{name}, update:{stripeProductId:prod,stripePriceId:price},
      create:{name,stripeProductId:prod,stripePriceId:price,treatmentLimit:t,hyperbaricLimit:h,breathworkLimit:b,guestPassLimit:0} });
  const d = new Date(Date.now()+3*864e5).toISOString().slice(0,10);
  const tr = await p.treatment.upsert({ where:{stripePriceId:"price_1UT0H9BcDsmTVqg6Q4EFLoNX"}, update:{},
    create:{ name:"Breathwork", stripePriceId:"price_1UT0H9BcDsmTVqg6Q4EFLoNX", stripeProductId:"prod_VTyDQAHQ6JhWdB", price:55,
      practitionerId:"123", practitionerName:"Test Practitioner",
      availabilities:[{date:d,startTime:"10:00",finishTime:"11:00",duration:60,totalLimit:2,remainingLimit:2},
                      {date:d,startTime:"12:00",finishTime:"13:00",duration:60,totalLimit:1,remainingLimit:0}] } });
  const pt = await p.patient.upsert({ where:{dentallyId:777001}, update:{},
    create:{ uuid:"local-test-uuid-1", mobileNumber:"07000000000", dateOfBirth:"1990-01-01", email:"stripe-local-test@example.com",
      name:"Local Stripe Test Patient", dentallyId:777001 } });
  console.log(JSON.stringify({treatmentId:tr.id, slotDate:d, patientId:pt.id, dentallyId:pt.dentallyId, plans:(await p.membershipPlan.findMany({select:{id:true,name:true}}))}));
  await p.$disconnect();
})();
