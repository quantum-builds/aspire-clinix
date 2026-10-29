# Local Stripe webhook tests

End-to-end checks for `/api/webhooks/stripe` against a **local** database,
Stripe **test mode** (Aspire Wellness) and a mocked Dentally. They refuse to
run if `DATABASE_URL` is not local. See `STRIPE_SETUP_PLAN.md` section 7.

```bash
# 1. local Postgres on 5433 (5432 is often taken)
docker run -d --name aspire-clinix-pg -p 127.0.0.1:5433:5432 \
  -e POSTGRES_DB=aspire_clinic -e POSTGRES_HOST_AUTH_METHOD=trust postgres:15-alpine
export L=postgresql://postgres@localhost:5433/aspire_clinic
DATABASE_URL=$L npx prisma migrate deploy && DATABASE_URL=$L npx prisma db seed
node scripts/stripe-local/local-setup.cjs        # plans, Breathwork, test patient

# 2. .env.local (gitignored) — overrides .env so nothing touches production
#    DATABASE_URL=postgresql://postgres@localhost:5433/aspire_clinic
#    DENTALLY_ENDPOINT=http://127.0.0.1:4010/
#    NEXT_PUBLIC_APP_URL=http://localhost:3000
#    STRIPE_SECRET_WEBHOOK_KEY=<any whsec_... for signed tests, or `stripe listen --print-secret`>
#    PLAN_ACCESS_ENABLED=false

# 3. run, each in its own terminal
node scripts/stripe-local/dentally-mock.cjs
npm run dev
node scripts/stripe-local/test-booking.cjs       # dispatcher, sessions, wellness
node scripts/stripe-local/test-membership.cjs    # full membership lifecycle (test clock)
```

The tests sign events with `STRIPE_SECRET_WEBHOOK_KEY` and post them directly,
so other apps on the shared account do not see them. They do create test-mode
objects (payment intents, a test clock with subscriptions) and delete the
test clock at the end. Create `dentally-fail` next to the mock to simulate a
Dentally outage.

Real forwarding check:
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe \
  --events checkout.session.completed,customer.subscription.updated,customer.subscription.deleted,invoice.paid,invoice.payment_failed
stripe trigger checkout.session.completed   # expect 200 "ignored"
```
