# Stripe & Webhook Setup — Implementation Handoff

Last updated: 2026-10-24 (steps 1–13 done; 14–15 with owner)
Owner: Muhammad Bilal
Branch the review was done on: `updated-wellness-flow` (clean, equal to `main` at PR #155)

---

## 0. How to use this document (read first)

This file is the single source of truth for the Stripe setup work on this repo. It was written so that any engineer or AI session can pick it up cold and finish the job without re-asking the questions that have already been answered.

Rules for whoever executes this:

1. Read the whole file before touching anything. All decisions in section 3 are final; do not re-open them.
2. Section 8 (Progress) is the live status. Update it as you go: mark steps done, note deviations, record IDs you created (webhook endpoint ID, migration names, commit hashes).
3. Verify facts before acting. Section 1 gives the commands used to establish each fact. If a command shows something different from what is written here, stop, update this file, then continue.
4. **Never run seeds, migrations with data changes, `stripe trigger`, or test checkouts against the database in `.env`.** It is production. Use the docker-compose Postgres for everything local (section 6).
5. Use `npm`, not pnpm or yarn.
6. Do the work on a new branch off `main`: `feature/stripe-webhook-setup`. Commit per step with a message that names the step number from section 5.
7. Keep every existing business rule in section 2. Do not "improve" membership behaviour toward proration or immediate upgrades.
8. When done, update section 8, run the verification in section 7, and leave this file in the repo.

---

## 1. Current state (verified 2026-10-24)

### 1.1 Stack

- Next.js 14.2 app router, TypeScript, Prisma 6 on Postgres, NextAuth 4 (JWT).
- Server Stripe SDK: `stripe@^17.7.0`. Client: `@stripe/stripe-js`.
- Patients are keyed by their Dentally ID. In NextAuth, `token.id` is the patient's `dentallyId` (a number as string). `Patient.id` is a cuid; `Patient.dentallyId` is unique.
- `next.config.mjs` has `output: 'standalone'` and CORS headers on `/api/:path*`.
- `src/middleware.ts` matcher excludes `api/`, so webhooks are never blocked by auth middleware.
- `.env` is gitignored. `.env.example` only lists `DATABASE_URL` and `NEXTAUTH_SECRET`.

How verified:
```bash
cat package.json next.config.mjs; grep -n matcher src/middleware.ts
```

### 1.2 Environment (`.env`, values redacted)

| Var | Present | Notes |
|---|---|---|
| `DATABASE_URL` | yes | **Production RDS**: `aspire-prod.c4ucnza75oxe.eu-west-2.rds.amazonaws.com/aspire-clinic` |
| `STRIPE_SECRET_KEY` | yes | test key, starts `sk_test_51Gw5vc` |
| `NEXT_PUBLIC_STRIPE_PUBLIC_KEY` | yes | test key `pk_test_...` |
| `STRIPE_SECRET_WEBHOOK_KEY` | yes | has a **leading space** before `whsec_`; belongs to no registered endpoint for this app |
| `NEXT_PUBLIC_APP_URL` | **missing** | used by checkout routes for success/cancel URLs; falls back to `Origin` header |
| `URL` | **missing** | used only by product-store checkout (out of scope) |
| `DENTALLY_*`, `NEXTAUTH_SECRET`, AWS, Resend, Pusher | yes | Pusher keys have trailing spaces |

How verified:
```bash
sed -E 's/=.*//' .env | grep -v '^#' | grep -v '^$'      # names only
grep -rhoE "process\.env\.[A-Z_]+" src | sort | uniq -c   # what code reads
```

### 1.3 Stripe account

- Correct account (confirmed by owner): **Aspire Wellness**, `acct_1Gw5vcBcDsmTVqg6`, GB, GBP. Every object ID from this account contains the token `BcDsmTVqg6` (e.g. `price_1UPSAH` **`BcDsmTVqg6`** `3bRlFPBD`).
- The account is **shared** with two unrelated apps. Registered test-mode webhook endpoints at time of review:

| Endpoint ID | URL | Belongs to | Events |
|---|---|---|---|
| `we_1ULi4gBcDsmTVqg69jnQU7jN` | `https://aspire-vimeo.vercel.app/api/stripe/webhook` | aspire-vimeo | checkout.session.completed, invoice.paid, invoice.payment_failed, customer.subscription.* |
| `we_1Ro2vtBcDsmTVqg6lFsGFQo5` | `https://aspire-academy-psi.vercel.app/api/webhooks/checkout` | aspire-academy | checkout.*, payment_intent.payment_failed, charge.refund.updated |
| `we_1RorcFBcDsmTVqg6xQSJrnna` | same as above, **disabled** | aspire-academy | |

  **None belong to this app.** Do not modify or delete the other apps' endpoints.
- Consequence of sharing: Stripe delivers every subscribed event to every endpoint. Our handler will receive vimeo and academy checkouts; it must ignore them (section 5, step 4). Their handlers will receive ours; nothing we can do about that except keep our `metadata.payment_for` distinct.
- Account default API version: `2026-08-26.dahlia`. The SDK v17 pins `2025-02-24.acacia`. In dahlia, `current_period_start/end` live on the subscription **item**, and `invoice.subscription` moved to `invoice.parent.subscription_details.subscription`. `src/lib/stripe-period.ts` already handles both shapes via `getSubscriptionPeriod()`, `getInvoiceSubscriptionId()`, `mapStripeStatus()`. Keep using these helpers.
- A **second, wrong account** with token `Hk7R1EnJ3F` was used by someone to create membership and Breathwork prices. Those IDs are in the production DB and fail under the real key with "No such price". No key for that account exists in this repo and none is needed.

How verified (script reads `.env`, read-only API calls):
```bash
# scratch script: node, require stripe from node_modules, then
# stripe.accounts.retrieve(); stripe.prices.list({active:true, expand:['data.product']}); stripe.webhookEndpoints.list()
```

### 1.4 Stripe catalogue (test mode, Aspire Wellness) relevant to this app

| Product | Product ID | Price ID | Amount | Type |
|---|---|---|---|---|
| Cryotherapy | `prod_VQIlxD7Y9UxETt` | `price_1UPSAHBcDsmTVqg63bRlFPBD` | £85 | one-time |
| Contrast Session (Cryo + Sauna) | `prod_VQInlA2FBjOVF4` | `price_1UPSBkBcDsmTVqg6GWs32v0p` | £150 | one-time |
| Hyperbaric Oxygen Chamber | `prod_VQIpv3dxfzSWmL` | `price_1UPSDNBcDsmTVqg6MZtaGySk` | £135 | one-time |
| Ice Bath | `prod_VQIqOEbWBhYVvA` | `price_1UPSEbBcDsmTVqg6pmbj6ejn` | £65 | one-time |
| Red Light Therapy | `prod_VQIslMbiINB0DH` | `price_1UPSGJBcDsmTVqg6QN7s4YVl` | £45 | one-time |
| Infrared Sauna | `prod_VQIvOWfq24aXzW` | `price_1UPSJUBcDsmTVqg6tRTgTHsI` | £75 | one-time |
| Contrast Session (Ice Bath + Sauna) | `prod_VUj8cVdcywb3n4` | `price_1UTjgaBcDsmTVqg6i8DX85pP` | £150 | one-time |
| Breathwork | `prod_VTyDQAHQ6JhWdB` | `price_1UT0H9BcDsmTVqg6Q4EFLoNX` | £55 | one-time |
| Essentials | `prod_VQIyS7tZAIW2OJ` | `price_1UPSMkBcDsmTVqg6QBp6qwtp` | £275 | monthly |
| Perform | `prod_VQJ06gZJYbtzmB` | `price_1UPSO9BcDsmTVqg6pwQhESQu` | £445 | monthly |
| Unlimited | `prod_VQJ1r3vSRT1M78` | `price_1UPSPPBcDsmTVqg6dleWw45E` | £785 | monthly |

Other products in the account (Aspire Premium subscription, dental store items, courses) belong to the other apps. Ignore them.

### 1.5 Database state (production, read-only check)

`MembershipPlan` (3 rows, all `isActive=true`):

| name | id | current stripePriceId (WRONG account) | treatmentLimit | hyperbaricLimit | breathworkLimit |
|---|---|---|---|---|---|
| Essentials | `6d93a78b-8238-4606-b4cc-171ef04b12ae` | `price_1ULkI5Hk7R1EnJ3FYJs3wakt` | 4 | 2 | 1 |
| Perform | `b8fa2756-b31c-4f1a-816b-43a8e477b76b` | `price_1ULkJPHk7R1EnJ3FWRQBddaX` | 8 | 4 | 2 |
| Unlimited | `54501427-e6b2-46a3-b668-b5e272566828` | `price_1ULkLhHk7R1EnJ3FFt9Jt81b` | null | 8 | 3 |

`Treatment` (1 row): Breathwork, id `cmvf96i7q0000u0i41gpiooef`, `stripePriceId=price_1USFtiHk7R1EnJ3FY7bQn9or` (WRONG account), `price=150` (owner says the real price is £55 but asked to leave the `price` column alone for now).

`TreatmentStripe` (7 rows): six correct seeded rows (Dentally treatment IDs 1367621, 1367845, 1367623, 1367626, 1367624, 1367622) plus `1526324 -> price_1UTjmSHk7R1EnJ3FhscftQCb` (WRONG account; this is Contrast Session Ice Bath + Sauna, confirmed by owner). Row 1526324 is **not** in `prisma/seed.ts`; the seed does `deleteMany` then `createMany`, so a re-seed would delete it.

`PatientMembership`: 1 row. `Session`: 1 row. Treat both as real data.

How verified: scratch Node script with `@prisma/client` from `node_modules` (run `npx prisma generate` first; the generated client was stale).

### 1.6 Code map

Stripe client (two identical copies):
- `src/config/stripe-config.ts` — `export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)`
- `src/utils/stripe.ts` — same, with the API-version comment. Most routes import this one.

Checkout session creators (all `mode` and `metadata` as listed; `success_url` uses `process.env.NEXT_PUBLIC_APP_URL || req.headers.get("origin")`):

| Route | Auth | Mode | Price source | Metadata |
|---|---|---|---|---|
| `src/app/api/checkout/route.ts` POST | `getToken` | payment | `TreatmentStripe` by Dentally `treatmentId` | `payment_for=wellness_appointment`, `treatment_id`, `practitioner_id`, `patient_id` (**from request body, not token**), `start_time`, `finish_time` (ISO), `reason` |
| `src/app/api/sessions/route.ts` POST | `getToken` | payment | `Treatment.stripePriceId` | `payment_for=treatment_session`, `treatment_id` (cuid), `patient_id` (dentallyId from token), `date` (YYYY-MM-DD), `start_time` (HH:mm). If the patient has an ACTIVE membership and `payWithStripe` is false, books from the plan instead and never reaches Stripe. |
| `src/app/api/stripe/membership/checkout/route.ts` POST | `getToken` | subscription | `MembershipPlan.stripePriceId` (plan looked up **by name**; the frontend sends the name as `planId`) | `payment_for=membership`, `planId` (uuid), `patientId` (dentallyId) |
| `src/app/api/stripe/product/checkout/route.ts` | commented out | payment | `stripe.prices.list` | `payment_for=product`, `products` (JSON). Out of scope. |

Also `GET /api/checkout` and `GET /api/stripe/status` both retrieve a session by `session_id` and report `payment_status`. The upcoming-appointments page calls the status one via `src/services/stripe/stripe.ts`.

Membership management (all `getToken`, look up `Patient` by `dentallyId`, then `PatientMembership` with `status: "ACTIVE"`):
- `upgrade/route.ts`: validates the new price is monthly, swaps the single subscription item's price with `proration_behavior: "none"`, sets `pendingPlanId`. `planId` is only promoted by the webhook at renewal.
- `cancel-upgrade/route.ts`: swaps the item back to the current plan's price, clears `pendingPlanId`.
- `cancel/route.ts`: resets item price to current plan if a change was pending, sets `cancel_at_period_end: true`, stores `cancelledAt = currentPeriodEnd`, clears `pendingPlanId`.
- `reactivate/route.ts`: sets `cancel_at_period_end: false`, clears `cancelledAt`.
- `current/route.ts`: returns latest membership with plan and pendingPlan names.

Webhook routes today (all read raw body with `req.text()`, verify with `stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_SECRET_WEBHOOK_KEY)`):
- `src/app/api/webhooks/stripe/route.ts` — `checkout.session.completed` only. For `wellness_appointment`: validates metadata, requires `payment_status === "paid"`, calls `createAppointment()` from `src/dentallyHelpers/appointment.ts`; 500 on Dentally failure (so Stripe retries); **no duplicate protection**. For `treatment_session`: looks up patient by `dentallyId`, then in a transaction checks for an existing `Session` with same patient/treatment/startTime (dedup), calls `reserveTreatmentSlot(tx, treatmentId, date, startTime)` from `src/lib/treatment-session.ts`, creates `Session`. If the slot is unavailable for a reason other than `SLOT_CONFLICT`, refunds the payment intent and returns 200. `SLOT_CONFLICT` and unknown errors return 500.
- `src/app/api/webhooks/membership/route.ts` — `checkout.session.completed` (`payment_for=membership`: finds patient and plan, retrieves subscription, `prisma.patientMembership.create(...)`), `customer.subscription.updated` and `invoice.paid` (both call local `syncMembershipFromStripe(subscription)` which syncs period, resets usage counters when the period start changed, promotes `pendingPlanId` to `planId` on rollover, maps status via `mapStripeStatus`), `customer.subscription.deleted` (sets `CANCELLED`, `cancelledAt`, clears `pendingPlanId`). Returns 404 when the membership row is missing on `subscription.updated`.
- `src/app/api/webhooks/checkout/route.ts` — product store. Does **not** filter on `payment_for`; swallows errors and returns 200. Out of scope; leave the file, do not register it.
- `src/app/api/webhooks/dentally/route.ts` — Dentally, unrelated, HMAC-verified. Do not touch.

Helpers to reuse:
- `src/lib/stripe-period.ts`: `getSubscriptionPeriod`, `getInvoiceSubscriptionId`, `mapStripeStatus`.
- `src/lib/plan-booking.ts`: `syncMembershipPeriod(prisma, membership)` (lazy period refresh on booking) and `evaluatePlanEligibility`.
- `src/lib/treatment-session.ts`: `findTreatmentSlot`, `reserveTreatmentSlot`, `TreatmentSlotException`, `isBreathworkTreatment`.
- `src/utils/createResponse.ts`: `createResponse(status, message, data)` response envelope used everywhere.
- `src/lib/db.ts`: shared `prisma` instance. (`/api/checkout` and `book-with-plan` instantiate their own `PrismaClient`; switch them to the shared one when touched.)

Prisma models involved (`prisma/schema.prisma`):
- `Patient { id cuid, dentallyId Int @unique, name, email, ... }` — no `stripeCustomerId` yet.
- `MembershipPlan { id uuid, name @unique, stripeProductId @unique, stripePriceId @unique, treatmentLimit Int?, hyperbaricLimit Int?, breathworkLimit Int, guestPassLimit Int, isActive }`
- `PatientMembership { id uuid, patientId @unique, planId, stripeCustomerId, stripeSubscriptionId @unique, status MembershipStatus(ACTIVE|CANCELLED|EXPIRED), currentPeriodStart, currentPeriodEnd, cancelAtPeriodEnd, cancelledAt?, usedTreatments, usedHyperbaric, usedBreathwork, usedGuestPasses, pendingPlanId? }`
- `Treatment { id cuid, name, stripePriceId @unique, stripeProductId @unique, practitionerId?, practitionerName?, price Decimal, availabilities Json?, isActive }`
- `TreatmentStripe { treatmentId Int @id, stripePriceId @unique, stripeProductId @unique }`
- `Session { id cuid, patientId Int, patientName, practitionerId?, practitionerName?, treatmentId, startTime, endTime }`
- Legacy, unused by Stripe flows: `Plan`, `Discount`, `UserSubscribedPlans`, `Subscription`. Leave them.

Frontend entry points (for manual testing):
- Plans: `/patient/plan-selection/plans` → `src/app/(dashboards)/patient/plan-selection/plans/component/plans.tsx` (buy, upgrade, cancel-upgrade, cancel, reactivate). Redirects to `checkoutUrl`. Success URL `/patient/plan-selection/plans?payment=success`.
- Dentally wellness appointment: `/patient/plan-selection/slot-selection` → `SlotSelection.tsx` → `POST /api/checkout`. Success URL `/patient/appointments/upcoming?session_id=...`.
- Treatment session: `/patient/plan-selection/wellness-treatments/[id]/slots` → `TreatmentSlots.tsx` → `POST /api/sessions` with `payWithStripe`. Same success URL.
- `/patient/plan-selection/*` is behind an access-password gate (`PLAN_ACCESS_ENABLED`, `PLAN_ACCESS_PASSWORD`, page `/access`).

### 1.7 Problems found (why the changes in section 5 exist)

| # | Problem | Effect |
|---|---|---|
| P1 | Three webhook routes verify against one `STRIPE_SECRET_WEBHOOK_KEY`; Stripe issues one secret per endpoint; no endpoint registered for this app | No webhook fires today. Even with endpoints registered, at most one route could verify. |
| P2 | Shared Stripe account | Our endpoint will receive other apps' events; handlers must ignore them. |
| P3 | DB rows point at prices from account `Hk7R1EnJ3F` | Buying any plan or booking Breathwork/treatment 1526324 fails with "No such price". |
| P4 | No event-ID idempotency; Dentally appointment creation has no dedup | A Stripe retry (after a 5xx or a duplicate delivery) can double-book a Dentally appointment. |
| P5 | `PatientMembership.patientId` is unique and the webhook does `create` | A patient who re-subscribes after expiry causes a unique-constraint 500; Stripe retries for up to 3 days. |
| P6 | Membership checkout does not check for an existing ACTIVE membership | A patient can hold two subscriptions. |
| P7 | No Stripe Customer linkage; no `customer_email` | New anonymous customer per checkout; patient must type email; no grouping in the dashboard. |
| P8 | `NEXT_PUBLIC_APP_URL` missing | Success URL depends on the `Origin` header. |
| P9 | Webhook routes have no `maxDuration`; Vercel default is 10 s | Dentally + Stripe calls inside a handler can time out, causing retries. |
| P10 | `POST /api/checkout` trusts `patientId` from the body | A logged-in patient could book under another patient's Dentally ID. |
| P11 | Seed lacks row 1526324 | Re-seeding deletes a live mapping. |
| P12 | Stray whitespace in `.env` values | dotenv trims it, but shell sourcing breaks; cosmetic. |

---

## 2. Business rules (confirmed by owner, final)

- A membership is a monthly (30-day) Stripe subscription.
- **Cancel** applies at the next billing date (`cancel_at_period_end`). The patient keeps the plan and its allowances until then, and afterwards has no membership at all.
- **Re-buying within the period** means reactivating the same subscription. Current-period usage is unchanged; Stripe bills again next month. This is the existing `reactivate` route.
- **Upgrade and downgrade** apply at renewal with **no proration**. The patient keeps paying the current plan until then and can cancel the pending change at any time at no cost. The new plan's limits apply only once the renewal invoice is paid.
- **Failed renewal**: keep booking access while Stripe retries the card. Access ends only when Stripe cancels the subscription (`customer.subscription.deleted`). Do not add a PAST_DUE status.
- **After a subscription has fully ended**, a new purchase reuses the patient's `PatientMembership` row (upsert on `patientId`), resets all `used*` counters to 0, sets the new `stripeSubscriptionId`, `stripeCustomerId`, period and `status: ACTIVE`, clears `cancelAtPeriodEnd`, `cancelledAt`, `pendingPlanId`.
- Breathwork counts against `breathworkLimit`, not `treatmentLimit` (see `isBreathworkTreatment`). Hyperbaric counts against both `treatmentLimit` (weighted by `getTreatmentPlanCost`) and `hyperbaricLimit`. Do not change this.

---

## 3. Decisions (final)

| Topic | Decision |
|---|---|
| Hosting | Vercel. Production only; no preview/staging webhooks. |
| Production domain | `https://aspire-clinix.vercel.app` |
| Webhook architecture | **One** endpoint, **one** secret: `https://aspire-clinix.vercel.app/api/webhooks/stripe` |
| Events subscribed | `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.paid`, `invoice.payment_failed` |
| Endpoint API version | Pin to the SDK's `2025-02-24.acacia` |
| Flows in scope | wellness appointments (Dentally), treatment sessions incl. Breathwork, memberships |
| Flows out of scope | product store (`/api/stripe/product/checkout`, `/api/webhooks/checkout`). Leave files as they are. |
| Stripe Customer | One per patient. Add `Patient.stripeCustomerId`. Pass `customer` to every Checkout Session. |
| Failed renewal | Log only; no access change. |
| Breathwork row | Repoint `stripePriceId`/`stripeProductId` to the £55 price. Leave the `price` column at 150 for now. |
| Treatment 1526324 | Map to Contrast Session (Ice Bath + Sauna) £150. |
| Local testing | docker-compose Postgres + Stripe CLI. Never the production DB. |
| Package manager | npm |

---

## 4. Target design

### 4.1 Single webhook route

`src/app/api/webhooks/stripe/route.ts`:

```
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

POST:
  1. sig = header "stripe-signature"; 400 if missing
  2. body = await req.text()
  3. event = stripe.webhooks.constructEvent(body, sig, STRIPE_SECRET_WEBHOOK_KEY); 400 on failure
  4. claimed = await claimEvent(event.id, event.type)      // idempotency, see 4.2
     if not claimed -> 200 { message: "Duplicate event, already processed" }
  5. try:
       switch event.type:
         checkout.session.completed      -> handleCheckoutCompleted(session)
         customer.subscription.updated   -> membership.onSubscriptionUpdated(sub)
         customer.subscription.deleted   -> membership.onSubscriptionDeleted(sub)
         invoice.paid                    -> membership.onInvoicePaid(invoice)
         invoice.payment_failed          -> membership.onInvoicePaymentFailed(invoice)
         default                         -> log, 200
       await markProcessed(event.id)
       return 200
     catch (err):
       await releaseEvent(event.id)       // so a Stripe retry can run it again
       return 500
```

`handleCheckoutCompleted(session)` switches on `session.metadata?.payment_for`:
- `wellness_appointment` → `booking.onWellnessAppointmentPaid(session)`
- `treatment_session` → `booking.onTreatmentSessionPaid(session)`
- `membership` → `membership.onMembershipCheckoutCompleted(session)`
- anything else (including `product`, missing metadata, other apps' sessions) → log at info level, return 200 without error.

Subscription and invoice events from the other apps: `membership.*` handlers look up `PatientMembership` by `stripeSubscriptionId`; when not found, log and return normally (200). Do **not** return 404/500 for "not found", because that is the normal case for events belonging to the other apps.

Exception: during a fresh membership checkout, `customer.subscription.updated`/`invoice.paid` can arrive **before** our `checkout.session.completed` handler has created the row. To cover that race, `onMembershipCheckoutCompleted` must do a full sync (period, status) from a freshly retrieved subscription after the upsert, so missing the earlier events is harmless.

Handlers live in:
- `src/lib/stripe/webhooks/booking.ts` (wellness appointment + treatment session; move code from the current route)
- `src/lib/stripe/webhooks/membership.ts` (move `syncMembershipFromStripe` and the handlers from the current membership route)
- `src/lib/stripe/webhooks/events.ts` (`claimEvent`, `markProcessed`, `releaseEvent`)

Responses: keep the `createResponse(...)` envelope. Status codes: 400 for signature/validation failures that must not be retried, 200 for handled/ignored, 500 only for transient failures that should be retried (Dentally 5xx, DB errors, `SLOT_CONFLICT`).

### 4.2 Idempotency table

```prisma
model StripeWebhookEvent {
  id          String    @id            // Stripe event id, evt_...
  type        String
  receivedAt  DateTime  @default(now())
  processedAt DateTime?
}
```

- `claimEvent(id, type)`: `INSERT` the row; on unique violation, check `processedAt`: if set → duplicate (return false); if null and `receivedAt` older than 5 minutes → stale claim from a crashed run, take it over (update `receivedAt`, return true); else → in-flight, return false (Stripe will retry later).
- `markProcessed(id)`: set `processedAt = now()`.
- `releaseEvent(id)`: delete the row so the retry starts clean.

Migration name: `add_stripe_webhook_event`.

### 4.3 Stripe Customer per patient

```prisma
model Patient {
  ...
  stripeCustomerId String? @unique
}
```
Migration name: `add_patient_stripe_customer_id`.

`src/lib/stripe/customer.ts`:
```
getOrCreateStripeCustomer(patient): string
  if patient.stripeCustomerId: return it
  customer = stripe.customers.create({ email: patient.email, name: patient.name,
             metadata: { patientId: patient.id, dentallyId: String(patient.dentallyId), app: "aspire-clinix" } })
  prisma.patient.update({ where: { id: patient.id }, data: { stripeCustomerId: customer.id } })
  return customer.id
```
Pass `customer: <id>` to all three in-scope `checkout.sessions.create` calls. Remove `customer_email` if present (Stripe forbids both). For subscription checkouts this also makes `session.customer` equal to the patient's customer, which `PatientMembership.stripeCustomerId` stores.

Check `Patient` has `email` and `name` fields before writing this (`grep -n "model Patient" -A 20 prisma/schema.prisma`).

### 4.4 Membership upsert

In `onMembershipCheckoutCompleted`:
```
patient  = prisma.patient.findUnique({ where: { dentallyId: Number(metadata.patientId) } })
plan     = prisma.membershipPlan.findUnique({ where: { id: metadata.planId } })
sub      = stripe.subscriptions.retrieve(session.subscription)
period   = getSubscriptionPeriod(sub)  (fallback: now / now+30d, log error)
prisma.patientMembership.upsert({
  where: { patientId: patient.id },
  create: { ...all fields as today... },
  update: { planId: plan.id, stripeCustomerId, stripeSubscriptionId: sub.id, status: "ACTIVE",
            currentPeriodStart, currentPeriodEnd, cancelAtPeriodEnd: false, cancelledAt: null,
            pendingPlanId: null, usedTreatments: 0, usedHyperbaric: 0, usedBreathwork: 0, usedGuestPasses: 0 }
})
```
If `metadata.payment_for !== "membership"` or `session.mode !== "subscription"`, ignore.

In `src/app/api/stripe/membership/checkout/route.ts`, before creating the session:
```
existing = prisma.patientMembership.findFirst({ where: { patientId: patient.id, status: "ACTIVE" } })
if existing -> 400 "You already have an active membership. Use upgrade or reactivate instead."
```

### 4.5 Other code changes

- `src/lib/stripe/client.ts` becomes the only Stripe client (`export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)`). Make `src/utils/stripe.ts` and `src/config/stripe-config.ts` re-export from it (keeps all imports working), or update imports and delete them.
- `POST /api/checkout`: take `patientId` from `token.id`, ignore the body value. Use shared `prisma` from `@/lib/db`.
- `src/app/api/webhooks/membership/route.ts`: delete after moving its logic.
- `prisma/seed.ts`: add `{ treatmentId: 1526324, stripePriceId: "price_1UTjgaBcDsmTVqg6i8DX85pP", stripeProductId: "prod_VUj8cVdcywb3n4" }`.
- `.env.example`: add `STRIPE_SECRET_KEY=`, `NEXT_PUBLIC_STRIPE_PUBLIC_KEY=`, `STRIPE_SECRET_WEBHOOK_KEY=`, `NEXT_PUBLIC_APP_URL=`.
- `.env`: remove the leading space on `STRIPE_SECRET_WEBHOOK_KEY` and trailing spaces on `PUSHER_*`. Do not change any values.

---

## 5. Implementation steps (in order)

Each step: implement, `npx tsc --noEmit` (or `npm run build`), commit as `stripe-setup: step N – <title>`.

1. **Branch**: `git checkout main && git pull && git checkout -b feature/stripe-webhook-setup`.
2. **Local DB up** (section 6.1). Run `npx prisma migrate deploy` and `npx prisma db seed` against the **local** DB only.
3. **Stripe client consolidation** (4.5).
4. **Schema**: add `StripeWebhookEvent` and `Patient.stripeCustomerId` (4.2, 4.3). `DATABASE_URL=<local> npx prisma migrate dev --name add_stripe_webhook_event_and_customer_id`. Commit the migration folder.
5. **Idempotency helpers** `src/lib/stripe/webhooks/events.ts` (4.2).
6. **Customer helper** `src/lib/stripe/customer.ts` (4.3); wire into the three checkout routes.
7. **Move handlers** into `src/lib/stripe/webhooks/booking.ts` and `membership.ts`. Preserve behaviour exactly except: membership create → upsert; "membership not found" → log + 200; add `onInvoicePaymentFailed` (log subscription id, invoice id, attempt count, next attempt).
8. **Dispatcher** `src/app/api/webhooks/stripe/route.ts` (4.1). Delete `src/app/api/webhooks/membership/route.ts`.
9. **Checkout hardening**: active-membership guard (4.4); `patientId` from token in `/api/checkout`.
10. **Seed + env files** (4.5).
11. **Local verification** (section 7.1).
12. **Production DB repoint** (section 6.3). Requires owner go-ahead at execution time; it is already approved in principle (section 3) but confirm the moment before running.
13. **Register the Stripe endpoint** (section 6.4). Record the endpoint ID and secret handling in section 8.
14. **Vercel env vars** (section 6.5). Owner pastes them; executor provides exact names/values.
15. **Deploy** (merge PR to `main`; Vercel builds). Then production verification (section 7.2).
16. Update section 8 and open the PR with this file linked.

---

## 6. Scripts and commands

### 6.1 Local database

`docker-compose.yml` defines Postgres 15 on port 5432, db `aspire_clinic`, trust auth. If 5432 is taken (it is on the owner's machine), run it on 5433 instead; `scripts/stripe-local/README.md` has the exact commands.
```bash
docker run -d --name aspire-clinix-pg -p 127.0.0.1:5433:5432 -e POSTGRES_DB=aspire_clinic -e POSTGRES_HOST_AUTH_METHOD=trust postgres:15-alpine
export LOCAL_DB="postgresql://postgres@localhost:5433/aspire_clinic"
DATABASE_URL=$LOCAL_DB npx prisma migrate deploy
DATABASE_URL=$LOCAL_DB npx prisma db seed
```
Create `.env.local` (gitignored by `.env*.local`) with `DATABASE_URL=$LOCAL_DB` and the local `STRIPE_SECRET_WEBHOOK_KEY` from `stripe listen`. Next.js loads `.env.local` over `.env`. **Double-check with `echo` or a log line that the dev server is using the local DB before testing.**

Local membership plans: insert the three plans with the **correct** Aspire Wellness IDs from 1.4 (same names and limits as 1.5). Local Breathwork treatment: create via `POST /api/treatments` as admin or insert directly, with the £55 price IDs and at least one future availability slot.

### 6.2 Stripe CLI (installed at `/usr/bin/stripe`)

```bash
stripe login                       # once, browser flow, picks the Aspire Wellness account
stripe listen --forward-to localhost:3000/api/webhooks/stripe
# copy the printed whsec_... into .env.local as STRIPE_SECRET_WEBHOOK_KEY
```
Useful triggers (these produce events with no `payment_for`, which must be ignored with 200):
```bash
stripe trigger checkout.session.completed
stripe trigger customer.subscription.updated
stripe trigger invoice.payment_failed
```
To replay a real event: `stripe events resend evt_...`.

### 6.3 Production DB repoint (run once, after local verification)

Run as a single transaction. Verify row counts before and after. Back up the five rows first (`SELECT ... INTO` a scratch table or just save the output).

```sql
BEGIN;

-- Save current values for rollback
CREATE TABLE IF NOT EXISTS _stripe_repoint_backup AS
  SELECT 'MembershipPlan' AS tbl, id::text AS key, "stripePriceId", "stripeProductId" FROM "MembershipPlan"
  UNION ALL SELECT 'Treatment', id, "stripePriceId", "stripeProductId" FROM "Treatment"
  UNION ALL SELECT 'TreatmentStripe', "treatmentId"::text, "stripePriceId", "stripeProductId" FROM "TreatmentStripe";

UPDATE "MembershipPlan" SET "stripePriceId"='price_1UPSMkBcDsmTVqg6QBp6qwtp', "stripeProductId"='prod_VQIyS7tZAIW2OJ' WHERE id='6d93a78b-8238-4606-b4cc-171ef04b12ae' AND name='Essentials';
UPDATE "MembershipPlan" SET "stripePriceId"='price_1UPSO9BcDsmTVqg6pwQhESQu', "stripeProductId"='prod_VQJ06gZJYbtzmB' WHERE id='b8fa2756-b31c-4f1a-816b-43a8e477b76b' AND name='Perform';
UPDATE "MembershipPlan" SET "stripePriceId"='price_1UPSPPBcDsmTVqg6dleWw45E', "stripeProductId"='prod_VQJ1r3vSRT1M78' WHERE id='54501427-e6b2-46a3-b668-b5e272566828' AND name='Unlimited';

UPDATE "Treatment" SET "stripePriceId"='price_1UT0H9BcDsmTVqg6Q4EFLoNX', "stripeProductId"='prod_VTyDQAHQ6JhWdB' WHERE id='cmvf96i7q0000u0i41gpiooef' AND name='Breathwork';

UPDATE "TreatmentStripe" SET "stripePriceId"='price_1UTjgaBcDsmTVqg6i8DX85pP', "stripeProductId"='prod_VUj8cVdcywb3n4' WHERE "treatmentId"=1526324;

-- Expect: 3, 1, 1 rows updated. Then:
SELECT name, "stripePriceId" FROM "MembershipPlan";
SELECT name, "stripePriceId" FROM "Treatment";
SELECT "treatmentId", "stripePriceId" FROM "TreatmentStripe" ORDER BY "treatmentId";
-- Every stripePriceId must contain 'BcDsmTVqg6'.
COMMIT;
```
Run with `psql "$DATABASE_URL" -f repoint.sql` or via `npx prisma db execute --file repoint.sql`. Afterwards run `npx prisma migrate deploy` against production to apply the two new migrations (schema-only, additive).

### 6.4 Register the webhook endpoint (Node, run from repo root, reads `.env`)

```js
// scratch/register-webhook.cjs
const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY.trim());
(async () => {
  const ep = await stripe.webhookEndpoints.create({
    url: "https://aspire-clinix.vercel.app/api/webhooks/stripe",
    enabled_events: [
      "checkout.session.completed",
      "customer.subscription.updated",
      "customer.subscription.deleted",
      "invoice.paid",
      "invoice.payment_failed",
    ],
    api_version: "2025-02-24.acacia",
    description: "aspire-clinix production (wellness bookings + memberships)",
  });
  console.log("endpoint id:", ep.id);
  console.log("signing secret (shown once):", ep.secret);
})();
```
The `secret` is returned **only on creation**. Hand it to the owner for Vercel immediately and do not commit it. Record only the endpoint ID in section 8. Dashboard alternative: Developers → Webhooks → Add endpoint, same URL/events, and choose the API version under "Show advanced".

### 6.5 Vercel environment variables (Production)

| Name | Value |
|---|---|
| `STRIPE_SECRET_KEY` | test key now; live key at go-live |
| `NEXT_PUBLIC_STRIPE_PUBLIC_KEY` | matching publishable key |
| `STRIPE_SECRET_WEBHOOK_KEY` | the `whsec_` from 6.4 (no surrounding spaces) |
| `NEXT_PUBLIC_APP_URL` | `https://aspire-clinix.vercel.app` |

Redeploy after setting them (env vars are baked in at build for `NEXT_PUBLIC_*`).

---

## 7. Verification

### 7.1 Local (against the local DB, with `stripe listen` running)

1. `stripe trigger checkout.session.completed` → 200, log line "ignored, no payment_for", no DB rows created.
2. Membership purchase via UI (`/patient/plan-selection/plans`, card 4242 4242 4242 4242) → `PatientMembership` row created with `BcDsmTVqg6` price plan, `Patient.stripeCustomerId` set, `StripeWebhookEvent` row with `processedAt`.
3. `stripe events resend <that evt id>` → 200 "Duplicate event", no second row, no error.
4. Upgrade → `pendingPlanId` set, Stripe item price swapped, no invoice created. Cancel-upgrade → reverted.
5. Cancel → `cancel_at_period_end` true in Stripe, `cancelAtPeriodEnd` true in DB. Reactivate → both false.
6. Simulate renewal: in the Stripe dashboard (test mode) use the subscription's "Advance test clock" if a test clock was used, otherwise `stripe trigger invoice.paid` is not tied to our subscription and will be ignored (expected). For a real renewal test, create the subscription under a test clock via the dashboard and advance it one month; verify counters reset and `pendingPlanId` promoted.
7. Treatment session purchase via UI → `Session` row, slot `remainingLimit` decremented. Resend the event → no duplicate.
8. Wellness appointment purchase → Dentally `createAppointment` called once (check logs). Resend event → "Duplicate event", no second Dentally call.
9. Cancelled membership that reached `customer.subscription.deleted` → status CANCELLED; buy again → same row reused, counters 0, status ACTIVE.
10. `npm run build` passes.

### 7.2 Production (after deploy and env vars)

1. Stripe dashboard → Webhooks → the new endpoint → "Send test event" `checkout.session.completed` → 200.
2. One real test-mode membership purchase from the production site → row created; check Vercel function logs for the event id.
3. Stripe dashboard → Webhooks → endpoint → no failed deliveries.

### 7.3 Go-live (later, separate task)

- Create the same 11 products/prices in **live** mode (test and live catalogues are separate; IDs will differ) and repoint the production DB rows to the live IDs (same SQL shape as 6.3).
- Register a **live** endpoint (same URL/events) and set its secret and the live keys on Vercel.
- Make one real low-value purchase, confirm the webhook, refund.

---

## 8. Progress (keep updated)

Branch: `feature/stripe-webhook-setup` (from `updated-wellness-flow`, see deviations).

| Step | Status | Notes / IDs / commits |
|---|---|---|
| 1 Branch | done | `d81b6d7` plan committed first |
| 2 Local DB | done | container `aspire-clinix-pg` on **5433** |
| 3 Client consolidation | done | `a90f699` – `src/lib/stripe/client.ts`; old files re-export |
| 4 Schema + migration | done | `140100b` – `prisma/migrations/20261024150000_add_stripe_webhook_event_and_customer_id` (additive) |
| 5 Idempotency helpers | done | `95656e0` – `src/lib/stripe/webhooks/events.ts` |
| 6 Customer helper | done | `80238a4` – `src/lib/stripe/customer.ts`, wired into 3 checkouts |
| 7 Move handlers | done | `ecdfa77` – `src/lib/stripe/webhooks/{booking,membership,result}.ts` |
| 8 Dispatcher | done | `85aa19a` – `/api/webhooks/membership` deleted |
| 9 Checkout hardening | done | `509c38e` guard; token patient in `80238a4` |
| 10 Seed + env files | done | `9e12059`; `.env` whitespace fixed locally (gitignored, values unchanged) |
| 11 Local verification | done | 26/26 booking + 30/30 membership checks, real `stripe listen` forward, `npm run build` ok. Harness in `scripts/stripe-local/` |
| 12 Prod DB repoint + `migrate deploy` | done 2026-10-24 | 5 rows repointed in one transaction (verified counts 1,1,1,1,1; no `Hk7R1EnJ3F` price IDs left). Backup table `_stripe_repoint_backup_20261024` (dropped 2026-10-27 after the new prices were verified in testing). Migration `20261024150000_…` applied; `migrate status` up to date |
| 13 Register endpoint | done, **disabled** | `we_1UU1yPBcDsmTVqg6akeCdG9Z`, test mode, API `2025-02-24.acacia`, 5 events. Enable after step 15 (Dashboard → Developers → Webhooks, or `stripe.webhookEndpoints.update(id, { disabled: false })`). Secret handed to owner out of band, not in the repo |
| 14 Vercel env vars | **owner to do** | set the 4 vars in 6.5 for Production, then redeploy |
| 15 Deploy + prod verify | not started | |
| 16 PR | branch pushed; **owner opens PR** | `gh` is logged in as an account that is not a collaborator. Compare link: https://github.com/quantum-builds/aspire-clinix/compare/updated-wellness-flow...feature/stripe-webhook-setup?expand=1 |

Deviations from this plan (with reason):

- **Branched from `updated-wellness-flow`, not `main`.** `main` lacks the treatment-session code (`/api/sessions`, `src/lib/stripe-period.ts`, `src/lib/treatment-session.ts`). `updated-wellness-flow` is 11 commits ahead of and 8 behind `origin/main`.
- **Local Postgres on port 5433** via `docker run` (not `docker compose`), because a host Postgres already holds 5432.
- **`prisma migrate dev` refuses non-interactive shells.** Migration SQL was generated with `prisma migrate diff --from-url <local> --to-schema-datamodel prisma/schema.prisma --script` and applied with `migrate deploy`. Drift check after: empty.
- **Rejected events respond 400 and are marked processed.** Stripe retries every non-2xx including 400, so marking them processed stops 3 days of retries while the first failure stays visible in the dashboard. Only thrown errors release the claim (500).
- **An in-progress duplicate delivery gets 409** so Stripe retries later instead of seeing success.
- **If marking an event processed fails after its handler succeeded, the claim is kept**, so a retry cannot repeat a booking or refund (a stale claim can still be taken over after 5 minutes).
- **Duplicate membership purchase** (patient already has a live subscription, e.g. two tabs) cancels the new subscription and refunds its first payment, instead of overwriting the row and orphaning a billing subscription.
- **Customer helper re-validates a stored customer id** and recreates it if missing, so the test-to-live switch and dashboard deletions self-heal.
- **The old `.env` `STRIPE_SECRET_WEBHOOK_KEY` is a `stripe listen` CLI secret**, not a registered endpoint's. It is the same value `stripe listen --print-secret` prints for this machine. Production needs the new endpoint's secret.
- `stripe listen` delivers with API version **2020-03-02** (CLI default). The period helpers handle that shape too; verified with a real forwarded event.

Local environment as left (for the next session):

- `.env.local` (gitignored) overrides `DATABASE_URL` to local, `DENTALLY_ENDPOINT` to the mock, `NEXT_PUBLIC_APP_URL=http://localhost:3000`, `STRIPE_SECRET_WEBHOOK_KEY` to the `stripe listen` secret, `PLAN_ACCESS_ENABLED=false`. **Delete or rename it before running anything that must reach production from this machine.**
- Docker container `aspire-clinix-pg` holds local test data (test patient dentallyId 777001).
- Stripe test mode: the test clock and its subscriptions were deleted; a few refunded test payment intents and one customer (`metadata.app=aspire-clinix`) for the test patient remain, which is harmless.

Follow-ups found during implementation (not in scope, owner to decide):

- A Dentally `invalid_request_error` (e.g. slot taken in Dentally) after payment is retried for 3 days like an outage, then gives up with the patient charged. Same as before this work. Consider refunding on permanent Dentally errors.
- Treatment-session payment for an unknown patient is rejected without a refund. Same as before.
- The Breathwork `Treatment.price` column still says 150 while the Stripe price is £55 (owner chose to leave it).

Open questions:

- **Production has one ACTIVE `PatientMembership`** (`0378c716-0d93-48f7-b149-eaa6224f436a`, plan Unlimited) whose `stripeSubscriptionId` `sub_1UTKVOHk7R1EnJ3Fdv6YDEuD` is in the wrong account (`Hk7R1EnJ3F`). With the Aspire Wellness key, cancel/upgrade/reactivate for that patient fail with "No such subscription", the new checkout guard blocks them from buying, and plan booking fails once its period ends. Likely test data. Owner to decide: delete the row, or mark it `CANCELLED`. Not touched.
