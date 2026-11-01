const { stripe, prisma, sendEvent, authed, check, summary } = require("./harness.cjs");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const plans = Object.fromEntries((await prisma.membershipPlan.findMany()).map((p) => [p.name, p]));
  const patient = await prisma.patient.findUnique({ where: { dentallyId: 777001 } });
  await prisma.patientMembership.deleteMany({ where: { patientId: patient.id } });

  const now = Math.floor(Date.now() / 1000);
  const clock = await stripe.testHelpers.testClocks.create({ frozen_time: now, name: "aspire-clinix local membership test" });
  console.log("test clock:", clock.id);
  const customer = await stripe.customers.create({ test_clock: clock.id, email: patient.email, name: patient.name,
    payment_method: "pm_card_visa", invoice_settings: { default_payment_method: "pm_card_visa" }, metadata: { app: "aspire-clinix-local-test" } });
  const pm = customer.invoice_settings.default_payment_method;
  await prisma.patient.update({ where: { id: patient.id }, data: { stripeCustomerId: customer.id } });

  const advance = async (to) => {
    await stripe.testHelpers.testClocks.advance(clock.id, { frozen_time: to });
    for (let i = 0; i < 90; i++) { const c = await stripe.testHelpers.testClocks.retrieve(clock.id); if (c.status === "ready") return; await sleep(2000); }
    throw new Error("test clock did not settle");
  };
  const newSub = (price) => stripe.subscriptions.create({ customer: customer.id, items: [{ price }], default_payment_method: pm, metadata: { app: "aspire-clinix-local-test" } });
  const checkoutEvent = (sub, plan) => sendEvent("checkout.session.completed", { id: "cs_m_" + sub.id, object: "checkout.session", mode: "subscription",
    payment_status: "paid", subscription: sub.id, customer: customer.id, metadata: { payment_for: "membership", planId: plan.id, patientId: "777001" } });
  const row = () => prisma.patientMembership.findUnique({ where: { patientId: patient.id } });

  // checkout route reuses the stored customer
  let res = await authed("/api/stripe/membership/checkout", { body: { planId: "Essentials" } });
  check("membership checkout session created", res.status === 200 && res.json?.data?.sessionId, res);
  if (res.json?.data?.sessionId) {
    const cs = await stripe.checkout.sessions.retrieve(res.json.data.sessionId);
    check("membership checkout uses the patient's existing customer", cs.customer === customer.id, cs.customer);
    await stripe.checkout.sessions.expire(cs.id);
  }

  // purchase
  const sub1 = await newSub(plans.Essentials.stripePriceId);
  let r = await checkoutEvent(sub1, plans.Essentials);
  let m = await row();
  check("purchase -> membership created", r.status === 200 && m?.status === "ACTIVE" && m.planId === plans.Essentials.id && m.stripeSubscriptionId === sub1.id, { r, m });
  check("period synced from Stripe", m && Math.abs(m.currentPeriodEnd.getTime() / 1000 - (now + 28 * 864e2)) < 4 * 864e2, m?.currentPeriodEnd);

  res = await authed("/api/stripe/membership/checkout", { body: { planId: "Perform" } });
  check("second purchase blocked while active", res.status === 400, res);

  await prisma.patientMembership.update({ where: { id: m.id }, data: { usedTreatments: 2, usedBreathwork: 1 } });

  // plan change at renewal
  res = await authed("/api/stripe/membership/upgrade", { body: { newPlanId: "Perform" } });
  m = await row();
  let s = await stripe.subscriptions.retrieve(sub1.id);
  check("upgrade -> pendingPlanId set, planId unchanged", res.status === 200 && m.pendingPlanId === plans.Perform.id && m.planId === plans.Essentials.id, { res: res.json, m });
  check("upgrade -> Stripe price swapped", s.items.data[0].price.id === plans.Perform.stripePriceId);
  const invoicesAfterUpgrade = await stripe.invoices.list({ subscription: sub1.id });
  check("upgrade -> no immediate charge", invoicesAfterUpgrade.data.length === 1, invoicesAfterUpgrade.data.length);

  res = await authed("/api/stripe/membership/cancel-upgrade");
  m = await row(); s = await stripe.subscriptions.retrieve(sub1.id);
  check("cancel-upgrade -> pending cleared, price restored", res.status === 200 && !m.pendingPlanId && s.items.data[0].price.id === plans.Essentials.stripePriceId, res.json);

  res = await authed("/api/stripe/membership/upgrade", { body: { newPlanId: "Perform" } });
  check("downgrade/upgrade can be scheduled again", res.status === 200, res.json);

  r = await sendEvent("customer.subscription.updated", await stripe.subscriptions.retrieve(sub1.id));
  m = await row();
  check("subscription.updated mid-period -> plan and usage untouched", r.status === 200 && m.planId === plans.Essentials.id && m.usedTreatments === 2, { r, m });

  // renewal
  const periodEnd = s.current_period_end;
  await advance(periodEnd + 3600);
  s = await stripe.subscriptions.retrieve(sub1.id, { expand: ["latest_invoice"] });
  check("renewal invoice paid in Stripe", s.latest_invoice.status === "paid" && s.latest_invoice.id !== invoicesAfterUpgrade.data[0].id, s.latest_invoice.status);
  check("renewal billed the new plan's price", s.latest_invoice.lines.data[0]?.price?.id === plans.Perform.stripePriceId, s.latest_invoice.lines.data[0]?.price?.id);
  r = await sendEvent("invoice.paid", s.latest_invoice);
  m = await row();
  check("invoice.paid at renewal -> pending plan promoted", r.status === 200 && m.planId === plans.Perform.id && !m.pendingPlanId, { r, m });
  check("invoice.paid at renewal -> usage reset", m.usedTreatments === 0 && m.usedBreathwork === 0, m);
  check("invoice.paid at renewal -> new period stored", m.currentPeriodStart.getTime() / 1000 === s.current_period_start, { db: m.currentPeriodStart, stripe: s.current_period_start });

  r = await sendEvent("invoice.paid", s.latest_invoice);
  check("second invoice.paid (new event id) is a no-op", r.status === 200 && (await row()).planId === plans.Perform.id);

  r = await sendEvent("invoice.payment_failed", { ...s.latest_invoice, status: "open", attempt_count: 1, next_payment_attempt: now + 3 * 864e2 });
  m = await row();
  check("invoice.payment_failed -> logged, access kept", r.status === 200 && m.status === "ACTIVE", { r, status: m.status });

  // cancel / reactivate
  res = await authed("/api/stripe/membership/cancel");
  m = await row(); s = await stripe.subscriptions.retrieve(sub1.id);
  check("cancel -> cancel_at_period_end in Stripe and DB, still ACTIVE", res.status === 200 && s.cancel_at_period_end && m.cancelAtPeriodEnd && m.status === "ACTIVE", res.json);
  res = await authed("/api/stripe/membership/checkout", { body: { planId: "Essentials" } });
  check("buying while cancel is pending -> told to reactivate", res.status === 400 && /Reactivate/.test(res.json?.message), res.json);
  res = await authed("/api/stripe/membership/reactivate");
  m = await row(); s = await stripe.subscriptions.retrieve(sub1.id);
  check("reactivate -> both flags cleared", res.status === 200 && !s.cancel_at_period_end && !m.cancelAtPeriodEnd, res.json);

  // duplicate purchase race (guard bypassed, e.g. two tabs)
  const dup = await newSub(plans.Essentials.stripePriceId);
  r = await checkoutEvent(dup, plans.Essentials);
  m = await row();
  const dupAfter = await stripe.subscriptions.retrieve(dup.id, { expand: ["latest_invoice"] });
  const dupRefunds = await stripe.refunds.list({ payment_intent: dupAfter.latest_invoice.payment_intent });
  check("duplicate subscription -> cancelled in Stripe", r.status === 200 && dupAfter.status === "canceled", { r, status: dupAfter.status });
  check("duplicate subscription -> first payment refunded", dupRefunds.data.length === 1, dupRefunds.data.length);
  check("duplicate subscription -> membership still on the original", m.stripeSubscriptionId === sub1.id);
  r = await sendEvent("customer.subscription.deleted", dupAfter);
  check("deleted event for the duplicate leaves membership ACTIVE", (await row()).status === "ACTIVE", r);

  // membership ends, then patient buys again
  await stripe.subscriptions.cancel(sub1.id);
  r = await sendEvent("customer.subscription.deleted", await stripe.subscriptions.retrieve(sub1.id));
  m = await row();
  check("subscription.deleted -> CANCELLED", r.status === 200 && m.status === "CANCELLED" && !m.pendingPlanId, { r, m });
  await prisma.patientMembership.update({ where: { id: m.id }, data: { usedTreatments: 3, usedHyperbaric: 1 } });
  const oldRowId = m.id;

  res = await authed("/api/stripe/membership/checkout", { body: { planId: "Unlimited" } });
  check("checkout allowed after membership ended", res.status === 200, res.json);
  if (res.json?.data?.sessionId) await stripe.checkout.sessions.expire(res.json.data.sessionId);

  const sub3 = await newSub(plans.Unlimited.stripePriceId);
  r = await checkoutEvent(sub3, plans.Unlimited);
  m = await row();
  check("re-purchase -> same row reused", r.status === 200 && /restarted/.test(r.message) && m.id === oldRowId, { r, id: m.id });
  check("re-purchase -> ACTIVE on new plan and subscription", m.status === "ACTIVE" && m.planId === plans.Unlimited.id && m.stripeSubscriptionId === sub3.id && !m.cancelAtPeriodEnd && !m.cancelledAt);
  check("re-purchase -> usage reset", m.usedTreatments === 0 && m.usedHyperbaric === 0, m);

  // cleanup: deleting the clock deletes its customer and subscriptions
  await stripe.testHelpers.testClocks.del(clock.id);
  await prisma.patient.update({ where: { id: patient.id }, data: { stripeCustomerId: null } });
  console.log("cleaned up test clock", clock.id);

  summary();
  await prisma.$disconnect();
})().catch((e) => { console.error(e); process.exit(1); });
