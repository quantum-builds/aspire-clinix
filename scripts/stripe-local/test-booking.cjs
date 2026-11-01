const fs = require("fs");
const { stripe, prisma, sendEvent, authed, check, summary, evtId } = require("./harness.cjs");
const FAIL_FLAG = __dirname + "/dentally-fail";

(async () => {
  const treatment = await prisma.treatment.findFirst({ where: { name: "Breathwork" } });
  const patient = await prisma.patient.findUnique({ where: { dentallyId: 777001 } });
  const slotDate = treatment.availabilities[0].date;
  const remaining = async (i) => (await prisma.treatment.findUnique({ where: { id: treatment.id } })).availabilities[i].remainingLimit;

  // --- dispatcher basics ---
  let r = await sendEvent("checkout.session.completed", { id: "cs_x", object: "checkout.session", metadata: {} }, evtId(), { sign: false });
  check("unsigned event rejected 400", r.status === 400, r);

  r = await sendEvent("checkout.session.completed", { id: "cs_other_app", object: "checkout.session", mode: "payment", payment_status: "paid", metadata: { course: "x" } });
  check("other app's checkout ignored with 200", r.status === 200 && /ignored/.test(r.message), r);

  r = await sendEvent("checkout.session.completed", { id: "cs_product", object: "checkout.session", payment_status: "paid", metadata: { payment_for: "product" } });
  check("product store checkout ignored with 200", r.status === 200, r);

  r = await sendEvent("customer.subscription.updated", { id: "sub_not_ours", object: "subscription", status: "active", items: { data: [] } });
  check("unknown subscription ignored with 200", r.status === 200 && /ignored/.test(r.message), r);

  r = await sendEvent("charge.succeeded", { id: "ch_x" });
  check("unsubscribed event type ignored", r.status === 200, r);

  // --- treatment session ---
  const before = await remaining(0);
  const tsSession = (pi) => ({ id: "cs_ts_" + Date.now(), object: "checkout.session", mode: "payment", payment_status: "paid", payment_intent: pi,
    metadata: { payment_for: "treatment_session", treatment_id: treatment.id, patient_id: "777001", date: slotDate, start_time: "10:00" } });

  const ts = tsSession("pi_unused");
  const firstId = evtId();
  r = await sendEvent("checkout.session.completed", ts, firstId);
  check("treatment session paid -> 200 created", r.status === 200 && /created/.test(r.message), r);
  check("slot remainingLimit decremented", (await remaining(0)) === before - 1, { before, after: await remaining(0) });
  check("one Session row", (await prisma.session.count({ where: { treatmentId: treatment.id, patientId: 777001 } })) === 1);

  r = await sendEvent("checkout.session.completed", ts, firstId);
  check("same event id resent -> duplicate 200", r.status === 200 && /duplicate/.test(r.message), r);

  r = await sendEvent("checkout.session.completed", ts);
  check("same checkout, new event id -> already exists", r.status === 200 && /already exists/.test(r.message), r);
  check("still one Session row and no extra decrement",
    (await prisma.session.count({ where: { treatmentId: treatment.id, patientId: 777001 } })) === 1 && (await remaining(0)) === before - 1);

  r = await sendEvent("checkout.session.completed", { ...ts, id: "cs_unpaid", payment_status: "unpaid" });
  check("unpaid checkout -> 200, nothing booked", r.status === 200 && /not yet paid/.test(r.message), r);

  r = await sendEvent("checkout.session.completed", { ...ts, metadata: { payment_for: "treatment_session" } });
  check("missing metadata -> 400 rejected", r.status === 400, r);
  const rejectedEvt = await prisma.stripeWebhookEvent.findUnique({ where: { id: r.id } });
  check("rejected event marked processed (no retry storm)", !!rejectedEvt?.processedAt);

  // full slot -> refund (needs a real test-mode payment)
  const pi = await stripe.paymentIntents.create({ amount: 5500, currency: "gbp", payment_method: "pm_card_visa", confirm: true,
    automatic_payment_methods: { enabled: true, allow_redirects: "never" }, metadata: { app: "aspire-clinix-local-test" } });
  const full = { ...tsSession(pi.id), metadata: { ...tsSession(pi.id).metadata, start_time: "12:00" } };
  r = await sendEvent("checkout.session.completed", full);
  check("full slot -> refunded, 200", r.status === 200 && /refunded/.test(r.message), r);
  const refunds = await stripe.refunds.list({ payment_intent: pi.id });
  check("exactly one refund in Stripe", refunds.data.length === 1, refunds.data.length);
  r = await sendEvent("checkout.session.completed", full);
  check("resent full-slot event does not refund twice", (await stripe.refunds.list({ payment_intent: pi.id })).data.length === 1, r);

  // --- treatment session checkout creation (customer helper) ---
  const sres = await authed("/api/sessions", { body: { treatmentId: treatment.id, date: slotDate, startTime: "10:00", payWithStripe: true } });
  // Patient already booked 10:00 above, so expect 409. Use a fresh slot check via a fake second patient-less path instead:
  check("booking an already-booked slot -> 409", sres.status === 409, sres);

  // --- wellness appointment (Dentally mocked) ---
  const start = new Date(Date.now() + 5 * 864e5); const finish = new Date(start.getTime() + 30 * 60e3);
  const wa = { id: "cs_wa_" + Date.now(), object: "checkout.session", mode: "payment", payment_status: "paid",
    metadata: { payment_for: "wellness_appointment", treatment_id: "1367621", practitioner_id: "123", patient_id: "777001",
      start_time: start.toISOString(), finish_time: finish.toISOString(), reason: "Wellness Appointment" } };

  fs.writeFileSync(FAIL_FLAG, "1");
  const waId = evtId();
  r = await sendEvent("checkout.session.completed", wa, waId);
  check("Dentally outage -> 500 so Stripe retries", r.status === 500, r);
  check("claim released after failure", !(await prisma.stripeWebhookEvent.findUnique({ where: { id: waId } })));

  fs.unlinkSync(FAIL_FLAG);
  r = await sendEvent("checkout.session.completed", wa, waId);
  check("retry after outage -> 200 created", r.status === 200 && /created/.test(r.message), r);
  r = await sendEvent("checkout.session.completed", wa, waId);
  check("further retry -> duplicate, Dentally not called again", r.status === 200 && /duplicate/.test(r.message), r);

  // --- /api/checkout uses token patient, sets customer ---
  const cres = await authed("/api/checkout", { body: { treatmentId: 1367621, practitionerId: "123", startTime: start.toISOString(), finishTime: finish.toISOString(), patientId: "999999" } });
  check("/api/checkout creates session", cres.status === 200 && cres.json?.data?.sessionId, cres);
  if (cres.json?.data?.sessionId) {
    const cs = await stripe.checkout.sessions.retrieve(cres.json.data.sessionId);
    const p2 = await prisma.patient.findUnique({ where: { dentallyId: 777001 } });
    check("checkout metadata uses token patient, not body", cs.metadata.patient_id === "777001", cs.metadata);
    check("checkout has the patient's customer", cs.customer && cs.customer === p2.stripeCustomerId, { cs: cs.customer, db: p2.stripeCustomerId });
    check("success_url uses NEXT_PUBLIC_APP_URL", cs.success_url.startsWith("http://localhost:3000/"), cs.success_url);
    await stripe.checkout.sessions.expire(cs.id);
  }

  summary();
  await prisma.$disconnect();
})().catch((e) => { console.error(e); process.exit(1); });
