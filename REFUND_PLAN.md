# Refund Setup Plan — aspire-clinix

Handoff document for implementing automatic Stripe refunds on appointment
cancellations. Written so a different model or developer can pick it up with
full context. Companion to `STRIPE_SETUP_PLAN.md`, which this plan assumes is
merged (single Stripe webhook at `/api/webhooks/stripe`, event idempotency,
one Stripe customer per patient).

Status: **plan only, no code written.** See section 8 for progress.

---

## 0. How to use this document

- Read sections 1–4 before touching code. They hold the facts and decisions.
- Work through section 5 in order; each step is small and independently
  committable. Update the progress table in section 8 after each step.
- Anything not covered here goes in section 7 (open questions) or gets
  recorded as a deviation in section 8. Do not silently change a rule from
  section 2 — they come from the client.
- Build on a new branch from `feature/stripe-webhook-setup` (or from
  `updated-wellness-flow` once that PR is merged). Do not touch `main`.

### 0.1 Environment and safety (read before running anything)

- **`.env` points at the production database and the real Dentally API.**
  `DATABASE_URL` in `.env` is prod. Local work must go through `.env.local`,
  which overrides it with the local Postgres (`localhost:5433`, docker
  container `aspire-clinix-pg`), the Dentally mock (`127.0.0.1:4010`) and
  `PLAN_ACCESS_ENABLED=false`.
- On 2026-10-26 `.env.local` was renamed to **`.env.local.disabled`** so the
  membership flows could be tested against prod data in Stripe test mode.
  If it is still named that way, `npm run dev` hits production. Rename it
  back (`mv .env.local.disabled .env.local`) before any local development.
- The local harness (`scripts/stripe-local/harness.cjs`) refuses to run
  unless `DATABASE_URL` is local. Keep that guard; add the same guard to any
  new script that writes.
- Stripe keys in `.env` are **test mode** for the Aspire Wellness account
  (`acct_1Gw5vcBcDsmTVqg6`). Never use the "Default sandbox" profile in the
  Stripe CLI. The account is shared with other apps; every webhook handler
  must ignore objects it does not know with a 200.
- Any wellness booking made while `.env.local` is disabled creates a **real
  appointment in the clinic's Dentally**. Cancel it there afterwards.
- Full background on the Stripe side: `STRIPE_SETUP_PLAN.md` sections 1–4,
  and `scripts/stripe-local/README.md` for how the local harness, Dentally
  mock and `stripe listen` fit together.

---

## 1. Current state (verified 2026-10-28)

### 1.1 How paid bookings happen today

| Flow | Route | What is stored |
|---|---|---|
| Wellness appointment (Dentally) | `POST /api/checkout` → Stripe Checkout → `onWellnessAppointmentPaid` in `src/lib/stripe/webhooks/booking.ts` creates the Dentally appointment | **Nothing.** The Dentally appointment ID and the Stripe PaymentIntent are not linked anywhere. |
| Breathwork / treatment session (not in Dentally) | `POST /api/sessions` → Stripe Checkout → `onTreatmentSessionPaid` creates a `Session` row | `Session` row only; no PaymentIntent on it. |
| Wellness appointment with plan credits | `POST /api/wellness/appointments/book-with-plan` | `MembershipAppointment` row (appointmentId → membership, treatmentId). No payment. |
| Treatment session with plan credits | `POST /api/sessions` (plan path) | `Session` + `MembershipAppointment`. No payment. |

Checkout metadata for wellness payments: `payment_for=wellness_appointment`,
`treatment_id`, `practitioner_id`, `patient_id` (Dentally ID), `start_time`,
`finish_time`, `reason`.

### 1.2 How cancellations happen today

- **Patient, in the app:** the upcoming-appointment cards call
  `PATCH /api/appointments/[id]` with `{ state: "Cancelled" }`
  (`src/services/appointments/appointmentMutation.ts`,
  `useChangeAppointmentState`). The route checks ownership via
  `Patient.appointmentIds`, calls Dentally `editAppointment`, then sends a
  cancellation notification. **No time restriction**: a patient can cancel
  one minute before the appointment.
- **Clinic / practitioner:** cancels directly in Dentally. There is no admin
  cancel UI in the app.
- **Treatment sessions (Breathwork):** no cancel route exists, for patient
  or admin.
- **`DELETE /api/appointments/[id]`:** exists, calls Dentally
  `deleteAppointment`. Not used by the current UI.
  **Security bug:** it deletes in Dentally *before* checking the appointment
  belongs to the caller, so any logged-in patient can delete any appointment
  by ID. Must be fixed or removed regardless of this plan.

### 1.3 Dentally webhook

`src/app/api/webhooks/dentally/route.ts` already exists. It verifies
`X-Dentally-Signature` (HMAC-SHA256 of the raw body with
`DENTALLY_WEBHOOK_SECRET`), and on `appointment.updated` with
`state === "Cancelled"` or `appointment.deleted` it restores plan credits by
deleting the `MembershipAppointment` row and decrementing the membership
counters (Serializable transaction, claim-by-delete to prevent double
restore). Everything else is acknowledged and skipped.

**Not confirmed as registered in production.** `DENTALLY_WEBHOOK_SECRET` is
not in `.env`, so either the webhook was never created in Dentally
Developer Settings or the secret lives only in Vercel. Step 5.1 checks this.

Dentally webhook facts (from the API docs):
- Events: `appointment.created|updated|deleted`, `patient.*`, `payment.*`.
- Payload `data` is the full appointment: `id`, `patient_id`, `state`,
  `start_time`, `finish_time`, `cancelled_at`, `did_not_attend_at`,
  `practitioner_id`, `reason`, … plus a `user` object (the Dentally user that
  triggered the event; API calls arrive as the token's user).
- May arrive **out of order**; retried up to 10 times on non-2xx; endpoint
  auto-disabled after 50 failures. Return 2xx for anything unknown.
- Appointment states (`src/types/appointment.ts`): Pending, Confirmed,
  Arrived, In surgery, Completed, Cancelled, Did not attend.

### 1.4 Stripe

- Refunds are created with `stripe.refunds.create({ payment_intent })`.
  Stripe then sends `refund.created`, `refund.updated` and, rarely,
  `refund.failed`; each carries the Refund object with `id`, `status`,
  `amount`, `created` and `payment_intent`. (`charge.refunded` also fires,
  but on API `2025-02-24.acacia` the Charge no longer embeds its refunds, so
  the `refund.*` events are the ones to use.) Our endpoint is not subscribed
  to any of these yet.
- Stripe **keeps its processing fee** on refunds (standard UK: 1.5% + 20p →
  £150 refund costs the clinic ≈ £2.45, £55 ≈ £1.03). Client has been told.
- One automatic refund already exists in the codebase:
  `onTreatmentSessionPaid` refunds when the slot is no longer available,
  using idempotency key `refund-slot-unavailable-${session.id}`. Reuse the
  same pattern.

---

## 2. Business rules (from the client, 2026-10-28)

| # | Scenario | Rule |
|---|---|---|
| R1 | Patient cancels **within 24 hours of booking** and before the appointment starts (booked 29 Oct 12:00 → can cancel until 30 Oct 12:00, or until the start time if that is earlier). *Changed 2026-10-29 by the owner; was "more than 24 h before the start".* | Full automatic refund through Stripe |
| R2 | Patient wants to cancel **after that window** | App offers **no cancel option** (UI and API). Shows "please contact the clinic". Any resulting cancel is done by staff in Dentally and falls under R3. |
| R3 | Clinic / admin / practitioner cancels (in Dentally or anywhere) | Full automatic refund through Stripe, no time condition |
| R4 | Patient does not show up (`Did not attend`) | **Non-refundable.** No action. |
| R5 | Rescheduling (same Dentally appointment ID, new time) | Payment carries over. No refund. The 24 h window still runs from the **original booking** (Dentally keeps `created_at`); the new start time still ends it early. |
| R6 | Plan-credit bookings (no payment) | Credits are restored on any cancellation (existing behaviour). Not restored on no-show (existing behaviour). Unchanged by this plan. |
| R7 | Refunds are always for the **full** amount paid. No partial refunds. |

Consequence of R2: every patient-initiated cancel that reaches the webhook is
by construction inside the allowed window, so **every cancel of a paid
appointment is refunded**, whoever triggered it. The webhook does not need to
know who cancelled; it only needs to know whether the appointment was paid
and whether it has already been refunded.

---

## 3. Decisions

| # | Decision | Why |
|---|---|---|
| D1 | Refund logic lives in **one place**: the Dentally webhook handler, next to the existing plan-credit restore. | Both patient (via app → Dentally API) and clinic (in Dentally) cancels produce the same `appointment.updated / Cancelled` event. One code path, one set of tests. |
| D2 | The 24 h rule is enforced **in the app**, on `PATCH /api/appointments/[id]` (server) and in the cancel button (UI). Not in the webhook. | R2 says the patient cannot cancel late at all, so the webhook never sees a late patient cancel. Keeps the webhook simple and lets staff make exceptions by cancelling in Dentally. |
| D3 | A new table `AppointmentPayment` links a Dentally appointment ID (and, for treatment sessions, a `Session` ID) to its Stripe PaymentIntent, amount, patient and refund status. | Today nothing links a Dentally appointment to its payment; without this the webhook cannot refund. |
| D4 | Refund idempotency key: `refund-appointment-${dentallyAppointmentId}` / `refund-session-${sessionId}`. Plus a DB status guard (`refundStatus` claim in a transaction) before calling Stripe. | Dentally retries and reorders webhooks; Stripe keys guarantee a second call is a no-op; the DB guard avoids even making the call. |
| D5 | The patient cancel path keeps using **PATCH `state: Cancelled`**, never Dentally `DELETE`. | `appointment.deleted` payloads may lack fields; `updated` carries `cancelled_at`, `start_time`, `patient_id`. The existing webhook handles both anyway. |
| D6 | `DELETE /api/appointments/[id]` is **removed** (or admin-only with ownership check first). | Unused by the UI and currently an open security hole. |
| D7 | Treatment sessions (Breathwork) get their own cancel route (`DELETE /api/sessions/[id]` or `PATCH … cancel`), which applies the same 24 h rule, frees the slot, restores plan credits if booked with a plan, and calls the **same refund helper**. | They are not in Dentally, so no Dentally event will ever fire. |
| D8 | Subscribe the Stripe endpoint to `refund.created`, `refund.updated` and `refund.failed` and record the outcome on `AppointmentPayment` (match on `refund.payment_intent`). | Lets the app show "refunded" to the patient and alerts on a failed refund (rare: e.g. card account closed). Handled as log-only + status update; no retry logic. |
| D9 | No-shows need **no code**: `Did not attend` is not `Cancelled`, so the webhook already skips it. Add a test to prove it. | R4. |
| D10 | Rescheduling needs **no code**: the link is by appointment ID, which Dentally keeps on reschedule. Add a test that an `updated` event with a new `start_time` and unchanged state does nothing. | R5. |

---

## 4. Target design

### 4.1 Schema (additive migration)

```
model AppointmentPayment {
  id                    String   @id @default(cuid())
  kind                  AppointmentPaymentKind      // WELLNESS_APPOINTMENT | TREATMENT_SESSION
  dentallyAppointmentId String?  @unique            // set for WELLNESS_APPOINTMENT (after Dentally create)
  sessionId             String?  @unique            // set for TREATMENT_SESSION
  patientDentallyId     Int                         // always known (checkout metadata)
  patientId             String?                     // Patient.id (cuid), null if no Patient row found
  stripeCheckoutSessionId String @unique
  stripePaymentIntentId String   @unique
  amount                Int                         // minor units (pence), as charged
  currency              String
  refundStatus          RefundStatus @default(NONE) // NONE | PENDING | REFUNDED | FAILED
  stripeRefundId        String?  @unique
  refundReason          String?                     // "patient_cancel" | "clinic_cancel" | "slot_unavailable"
  refundError           String?                     // Stripe error message when FAILED
  refundedAt            DateTime?
  cancelledBy           CancelledBy?                // PATIENT | CLINIC, stamped by the app; null = cancelled in Dentally directly
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
  @@index([patientId])
  @@index([patientDentallyId])
}
```

#### 4.1.1 Where every column comes from

All "session" references below mean the `Stripe.Checkout.Session` passed to
the `checkout.session.completed` handler in `src/lib/stripe/webhooks/booking.ts`.

| Column | Source | Notes |
|---|---|---|
| `kind` | `session.metadata.payment_for` | `wellness_appointment` → `WELLNESS_APPOINTMENT`, `treatment_session` → `TREATMENT_SESSION`. Same switch as `handleCheckoutCompleted` in `route.ts`. |
| `dentallyAppointmentId` | `result.response.id` returned by `createAppointment()` in `onWellnessAppointmentPaid` (the value already logged at "Dentally appointment created") | `String(id)`. Written in a second update *after* the Dentally call succeeds; null until then (see 4.2 retry logic). |
| `sessionId` | `created.id` from `tx.session.create` in `onTreatmentSessionPaid` | Insert the `AppointmentPayment` row inside the same `$transaction`. |
| `patientDentallyId` | `Number(session.metadata.patient_id)` | Always present; both checkout routes set it from `token.id`. |
| `patientId` | `prisma.patient.findUnique({ where: { dentallyId } }).id` | `onTreatmentSessionPaid` already does this lookup (`patient.id`). `onWellnessAppointmentPaid` does **not** look up the Patient row today — add the lookup. If no row exists, store `null` and `console.error`; do not block the booking or the refund. |
| `stripeCheckoutSessionId` | `session.id` | Used to find the row again on a retried event. |
| `stripePaymentIntentId` | `session.payment_intent` | String ID in `checkout.session.completed` for `mode: "payment"`; unwrap with the `idOf` pattern from `membership.ts` in case it is expanded. Always set for paid payment-mode sessions. |
| `amount` | `session.amount_total` | Minor units (pence). This is what was actually charged, so a refund of this amount is always a full refund, regardless of the DB `price` (e.g. Breathwork still stored as 150). |
| `currency` | `session.currency` | `"gbp"`. |
| `refundStatus` | default `NONE`; `PENDING` → `REFUNDED`/`FAILED` set by `refundAppointmentPayment` (4.3) | The slot-unavailable path in `onTreatmentSessionPaid` creates the row directly as `REFUNDED`. |
| `stripeRefundId` | `refund.id` from the `stripe.refunds.create` response, or from a `refund.created` / `refund.updated` event (4.7) | Unique so a dashboard refund matched by webhook cannot be stored twice. |
| `refundReason` | caller of the helper: `cancelledBy === "PATIENT"` → `patient_cancel`, otherwise `clinic_cancel`; `slot_unavailable` from `booking.ts` | Free text by design; also used to pick the email wording. |
| `refundError` | `error.message` from the Stripe error when the refund call fails | Null otherwise. |
| `refundedAt` | `new Date(refund.created * 1000)` | From the same refund object as `stripeRefundId`. |
| `cancelledBy` | `PATCH /api/appointments/[id]` sets `PATIENT` when `token.role === PATIENT`, `CLINIC` for practitioner/admin tokens; the new sessions cancel route does the same; **nothing** sets it when the cancel happens inside Dentally | Stamped *before* the Dentally API call so it is in place when the webhook arrives. Not needed for the refund decision (section 2 consequence), only for reporting and emails. |

### 4.2 Write path (where rows are created)

- `onWellnessAppointmentPaid`: after Dentally returns the new appointment ID,
  create the `AppointmentPayment` row in the same handler. If the DB insert
  fails after the Dentally create succeeded, throw `RetryableWebhookError`
  **only if** the create is idempotent on retry — it is not (Dentally would
  create a second appointment). So: create the row with
  `dentallyAppointmentId = null` *before* calling Dentally, then update it
  with the ID after. On retry, find the existing row by checkout session ID
  and skip the Dentally create if it already has an appointment ID.
  Take `amount` / `currency` from the Checkout Session (`amount_total`,
  `currency`) and the PaymentIntent from `session.payment_intent` (string or
  object; see `idOf` in `membership.ts` for the unwrap pattern).
- `onTreatmentSessionPaid`: create the row in the same transaction as the
  `Session` row. The existing slot-unavailable refund should also write a
  row with `refundStatus = REFUNDED, refundReason = slot_unavailable`.

### 4.3 Refund helper

`src/lib/stripe/refunds.ts` — `refundAppointmentPayment(paymentId, reason)`:

1. In a transaction, `updateMany` the row from `refundStatus = NONE` to
   `PENDING`. If 0 rows updated → already handled, return.
2. `stripe.refunds.create({ payment_intent }, { idempotencyKey })`.
3. On success: set `REFUNDED`, `stripeRefundId`, `refundedAt`, `refundReason`.
4. On Stripe error: set `FAILED` with the error message, log loudly, and
   **do not throw** to the webhook (returning 5xx to Dentally would retry a
   refund that is going to fail again; a human has to look). Exception:
   network / 5xx from Stripe → reset to `NONE` and throw so Dentally retries.

### 4.4 Dentally webhook changes

In `restoreMembershipUsage`'s caller (keep the existing credit restore as is):

- After confirming `isCancellation`, look up `AppointmentPayment` by
  `dentallyAppointmentId`. If found → `refundAppointmentPayment(…,
  cancelledBy ?? "clinic_cancel")`.
- Both branches (credit restore, refund) run for the same event; an
  appointment is either plan-booked or paid, never both, so at most one does
  work.
- Keep returning 200 to Dentally for `Did not attend`, reschedules, and
  unknown appointment IDs.

### 4.5 App-side cancel rules

`PATCH /api/appointments/[id]` when `state === "Cancelled"` and caller is a
PATIENT:

- Fetch the appointment from Dentally (`getAppointment`) to get the
  authoritative `start_time` — do not trust the client.
- If `start_time - now < 24h` → 400 with a message like "Appointments can
  only be cancelled more than 24 hours in advance. Please contact the clinic."
- Else stamp `cancelledBy = PATIENT` on the `AppointmentPayment` row (if one
  exists), then call Dentally as today.
- **Ownership gotcha.** The route checks ownership against
  `Patient.appointmentIds`, which is only filled in when
  `GET /api/appointments` runs (it merges IDs from Dentally into the
  patient row, `src/app/api/appointments/route.ts` ~line 217). A paid
  appointment created by the Stripe webhook is not added there, so a
  patient who pays and then cancels before opening the appointments list
  gets 404 "Appointment not found for the user". Fix: treat an
  `AppointmentPayment` row with `patientId = caller` as proof of ownership
  too (or have `onWellnessAppointmentPaid` append the ID to
  `appointmentIds`). Same applies to the existing `MembershipAppointment`
  path for plan bookings; check `book-with-plan` before assuming it is
  covered.

UI (`UpcomingAppointmentCard`, `FirstUpcomingAppointmentCard`): hide the
"Cancel Appointment" button when `startTime - now < 24h`, show the contact
note instead. Practitioner / admin tokens are not subject to the 24 h rule.

### 4.6 Treatment session cancel (new)

`DELETE /api/sessions/[id]` (patient: own session, > 24h; admin: any):

1. Load `Session` with treatment; check ownership and the 24 h rule.
2. In a transaction: delete the `Session`, release the slot (inverse of
   `reserveTreatmentSlot` in `src/lib/treatment-session.ts` — confirm how
   capacity is tracked before writing this), and if a `MembershipAppointment`
   exists for it, restore credits the same way the Dentally webhook does
   (extract that logic into a shared function).
3. If an `AppointmentPayment` exists → `refundAppointmentPayment`.
4. Add a cancel button to wherever patients see their sessions (the
   upcoming-appointments list already renders sessions via
   `sessionToAppointment`; check which cards they use).

### 4.7 Stripe webhook additions

Add `refund.created`, `refund.updated` and `refund.failed` to the endpoint's
events (dashboard, or `stripe webhook_endpoints update
we_1UU1yPBcDsmTVqg6akeCdG9Z --enabled-events …` listing the existing five
plus these three; the CLI replaces the list, so include all of them).
Handler: `event.data.object` is a `Stripe.Refund`; find `AppointmentPayment`
by `stripePaymentIntentId = idOf(refund.payment_intent)`; set
`stripeRefundId`, `refundedAt`, and `refundStatus` from `refund.status`
(`succeeded` → `REFUNDED`, `failed`/`canceled` → `FAILED` with
`refund.failure_reason` in `refundError`, `pending` → leave `PENDING`).
Ignore unknown payment intents with 200 (shared account). This also catches
refunds staff issue by hand in the dashboard.

### 4.8 Notifications

`notifyAppointmentStatus(id, "Cancelled")` already sends a cancellation
email. Extend the cancelled template with a line "A refund of £X has been
issued to your original payment method and should appear within 5–10
working days" when a refund was made. Clinic-side cancels come via the
webhook, so trigger the patient email from there too (today the email only
fires from the PATCH route).

---

## 5. Steps

Each step = one commit. Run `npm run build` and the local harness before
committing.

| Step | What | Files |
|---|---|---|
| 5.1 | **Verify Dentally webhook registration.** `GET {DENTALLY_ENDPOINT}/webhooks` with the API token (note: `DENTALLY_ENDPOINT` already ends in `/v1/`). If none points at `https://aspire-clinix.vercel.app/api/webhooks/dentally` with `appointment.updated` + `appointment.deleted`, create it with a fresh secret and set `DENTALLY_WEBHOOK_SECRET` in Vercel Production. Record the webhook ID here. | none |
| 5.2 | Fix / remove `DELETE /api/appointments/[id]` (D6). | `src/app/api/appointments/[id]/route.ts` |
| 5.3 | Schema: `AppointmentPayment`, enums; migration via `prisma migrate diff` + `migrate deploy` (same non-interactive approach as the Stripe plan). | `prisma/schema.prisma`, `prisma/migrations/…` |
| 5.4 | Write rows from both paid webhooks (4.2), including the slot-unavailable refund. | `src/lib/stripe/webhooks/booking.ts` |
| 5.5 | Refund helper (4.3). | `src/lib/stripe/refunds.ts` |
| 5.6 | Dentally webhook: refund on cancel (4.4). Extract credit-restore into `src/lib/membership-credits.ts` for reuse in 5.8. | `src/app/api/webhooks/dentally/route.ts` |
| 5.7 | 24 h rule on PATCH + UI (4.5). | `src/app/api/appointments/[id]/route.ts`, upcoming cards |
| 5.8 | Treatment session cancel route + UI (4.6). | `src/app/api/sessions/[id]/route.ts`, `src/lib/treatment-session.ts`, session cards |
| 5.9 | Stripe `refund.created` / `refund.updated` / `refund.failed` handling + endpoint events (4.7). | `src/app/api/webhooks/stripe/route.ts`, new `src/lib/stripe/webhooks/refunds.ts` |
| 5.10 | Refund wording in cancellation email; trigger from webhook for clinic cancels (4.8). | `src/notifications/…` |
| 5.11 | Local harness: `scripts/stripe-local/test-refunds.cjs` covering section 6. Read `scripts/stripe-local/README.md` and `harness.cjs` first: the harness signs Stripe events with the local `whsec_`, mints a NextAuth cookie with `encode` so routes can be called as a patient, and refuses non-local `DATABASE_URL`. `dentally-mock.cjs` currently only answers Dentally API calls; extend it to POST signed `appointment.updated` / `appointment.deleted` payloads (HMAC-SHA256 hex of the raw body with `DENTALLY_WEBHOOK_SECRET`, header `X-Dentally-Signature`) to `/api/webhooks/dentally`, including duplicate and out-of-order deliveries for V5. `local-setup.cjs` seeds plans, the Breathwork treatment and test patient `dentallyId 777001`. | `scripts/stripe-local/` |
| 5.12 | Backfill: any already-paid future appointments have no `AppointmentPayment` row. Script to list Stripe checkout sessions with `payment_for=wellness_appointment` / `treatment_session` since go-live and create rows (match on metadata + Dentally list). Run once on prod after deploy. | `scripts/stripe-local/backfill-appointment-payments.cjs` |
| 5.13 | Update `STRIPE_SETUP_PLAN.md` section 4 (events list) and this file's progress table. Hand over for PR. | docs |

---

## 6. Verification scenarios

Local (harness + `stripe listen` + Dentally mock), then by hand on prod DB
with test mode as was done for memberships.

| # | Scenario | Expected |
|---|---|---|
| V1 | Pay for a wellness appointment | `AppointmentPayment` row with Dentally ID, PI, amount, `NONE` |
| V2 | Patient cancels > 24 h before, in app | PATCH 200 → Dentally cancel event → refund created, row `REFUNDED`, Stripe shows full refund, email mentions refund |
| V3 | Patient tries to cancel < 24 h before | Button hidden; direct PATCH → 400; no Dentally call; no refund |
| V3b | Patient pays, then cancels immediately without ever opening the appointments list | PATCH succeeds (ownership via `AppointmentPayment`), refund issued. Guards the 4.5 ownership gotcha. |
| V4 | Clinic cancels in Dentally at any time (incl. < 24 h) | Webhook → refund, row `REFUNDED`, patient email |
| V5 | Dentally resends the same cancel event 3× / out of order | Exactly one Stripe refund; later deliveries return 200 and do nothing |
| V6 | `Did not attend` | Webhook skips; row stays `NONE`; no refund |
| V7 | Reschedule (updated event, new `start_time`, state unchanged) then cancel after the new time is > 24 h away | No action on reschedule; refund on cancel |
| V8 | Plan-credit appointment cancelled | Credits restored (existing), no refund attempted, no `AppointmentPayment` lookup error |
| V9 | Breathwork paid session cancelled > 24 h | Session deleted, slot count freed, refund, row `REFUNDED` |
| V10 | Breathwork plan session cancelled | Session deleted, slot freed, credit restored, no refund |
| V11 | Stripe refund fails (use a PI from a test card that blocks refunds, or mock) | Row `FAILED`, loud log, Dentally still gets 200 |
| V12 | `refund.created` / `refund.updated` for a refund made by hand in the dashboard | Row updated to `REFUNDED` with the refund ID; a second `refund.updated` for the same refund is a no-op |
| V13 | Events for other apps on the shared account | 200, ignored |
| V14 | Webhook called for an unknown appointment ID | 200, logged, nothing else |
| V15 | Stripe fee check | Refund in dashboard shows full amount to customer; balance transaction shows fee not returned (informational, for the client) |

---

## 7. Open questions

| # | Question | Default if unanswered |
|---|---|---|
| Q1 | Should a patient be able to cancel a **plan-credit** booking inside 24 h, and if so, is the credit lost? | Apply the same 24 h block to all patient cancels (simplest, consistent). Credit always restored when a cancel does happen (existing behaviour). |
| Q2 | Should the admin dashboard get a cancel button for wellness appointments, or does staff always use Dentally? | No admin UI; Dentally is the admin tool for appointments. |
| Q3 | Should patients see refund status in the app ("Refund issued, 5–10 days")? | Yes, on the cancelled-appointment entry, from `refundStatus`. Low effort once D8 is in. |
| Q4 | Is there a "Confirmed by clinic" step that should block patient cancellation? | No. |
| Q5 | Breathwork DB price is still 150, client said it should be 55. Fix before refunds go live so the stored amount is right? | Amount comes from the Stripe PI (what was actually charged), so refunds are correct either way. Fix separately. |

---

## 8. Progress

| Step | Status | Notes |
|---|---|---|
| Plan written | done 2026-10-28 | Rules confirmed by client; 24 h window and "no cancel option inside 24 h" decided by the developer. |
| 5.1 | not started | Owner to check Dentally `GET /webhooks`. `DENTALLY_WEBHOOK_SECRET` *is* in `.env`. |
| 5.2 | code done 2026-10-29 | `DELETE /api/appointments/[id]` removed (nothing called it). |
| 5.3 | schema done 2026-10-29 | `AppointmentPayment` + 3 enums in `schema.prisma`. Migration not generated or applied yet (owner runs it). |
| 5.4 | code done 2026-10-29 | `booking.ts`: row before the Dentally create, retry skips a second create, appointment ID pushed to `Patient.appointmentIds`; session row in the same transaction; slot-unavailable refund recorded. |
| 5.5 | code done 2026-10-29 | `src/lib/stripe/refunds.ts`. |
| 5.6 | code done 2026-10-29 | Dentally webhook refunds after the credit restore. |
| 5.7 | code done 2026-10-29 | Cancel window (24 h after booking, before the start) in PATCH and `UpcomingAppointmentCard`; rule in `src/utils/cancellationPolicy.ts`. |
| 5.8 | code done 2026-10-29 | Session cancel in the PATCH cuid branch via `src/lib/session-cancellation.ts`. |
| 5.9 | code done 2026-10-29 | Handler in place; endpoint events not yet added in Stripe (owner). |
| 5.10 | partly done | New refund email (`constants/wellnessEmails/cancellation.ts`). Refund status in the app (Q3) not done. |
| 5.11 | partly done | `scripts/stripe-local/send-dentally-event.cjs`. No automated test suite. |
| 5.12 | not started | Backfill: only test-mode payments exist so far; needed before live keys. |
| 5.13 | this table | |

Deviations from plan (2026-10-29):
- There is no `.env.local`; `.env` is prod (prod RDS, real Dentally, Stripe **test** keys). The owner runs all commands; Claude only edits files.
- `MembershipAppointment` is now `WellnessAppointment` (`appointmentType` MEMBERSHIP / SINGLE). The existing Dentally credit restore is unchanged.
- D7: treatment sessions are cancelled through the existing `PATCH /api/appointments/[id]` (session status → CANCELLED, row kept), not a new DELETE route. A practitioner cancel there now also frees the slot, restores credits and refunds. Session credit restore lives in `src/lib/membership-credits.ts` (mirrors `POST /api/sessions`: `usedBreathwork` for Breathwork, otherwise one `usedTreatments`); the Dentally restore was not extracted.
- D1: refunds of Dentally appointments also run directly in PATCH after an in-app cancel, not only in the Dentally webhook, so a patient cancel is refunded even if the webhook is not registered. Safe because of the NONE→PENDING claim and the Stripe idempotency key.
- Cancel window changed by the owner: within 24 h of booking (Dentally `created_at` / `Session.createdAt`) and before the start, instead of more than 24 h before the start. Only Pending or Confirmed appointments can be cancelled. If the booking time is missing, the patient cannot cancel (they are told to contact the clinic). The rule lives in `src/utils/cancellationPolicy.ts`.
- The 4.8 email: `notifyAppointmentStatus` only emails for referral appointments (it needs Report rows), so wellness refunds use a new `notifyCancellationRefund` email instead.
- `FirstUpcomingAppointmentCard` already had its cancel button commented out; left as is.
- Known gap: if Stripe is down when a *session* is cancelled, the session is CANCELLED but the refund is not retried automatically (logged as `retry_needed`).
