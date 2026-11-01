// Shared helpers for local Stripe webhook tests. Never points at production.
const fs = require("fs");
const R = require("path").resolve(__dirname, "../..");
function loadEnv(file) {
  for (const line of fs.readFileSync(file, "utf8").split("\n")) {
    const m = line.match(/^\s*([\w.-]+)\s*=\s*(.*)$/); if (!m) continue;
    let v = m[2].trim(); if (/^(["']).*\1$/.test(v)) v = v.slice(1, -1);
    process.env[m[1]] = v;
  }
}
loadEnv(R + "/.env"); loadEnv(R + "/.env.local");
if (!process.env.DATABASE_URL.includes("localhost:5433")) throw new Error("refusing: DATABASE_URL is not local");

const Stripe = require(R + "/node_modules/stripe");
const { PrismaClient } = require(R + "/node_modules/@prisma/client");
const { encode } = require(R + "/node_modules/next-auth/jwt");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const prisma = new PrismaClient();
const BASE = "http://localhost:3000";
const SECRET = process.env.STRIPE_SECRET_WEBHOOK_KEY;

let seq = 0;
const evtId = () => `evt_local_${Date.now()}_${++seq}`;

async function sendEvent(type, object, id = evtId(), { sign = true } = {}) {
  const payload = JSON.stringify({ id, object: "event", type, api_version: "2025-02-24.acacia",
    created: Math.floor(Date.now() / 1000), data: { object }, livemode: false, pending_webhooks: 1, request: null });
  const headers = { "content-type": "application/json" };
  if (sign) headers["stripe-signature"] = stripe.webhooks.generateTestHeaderString({ payload, secret: SECRET });
  const res = await fetch(BASE + "/api/webhooks/stripe", { method: "POST", headers, body: payload });
  let body; try { body = await res.json(); } catch { body = null; }
  return { status: res.status, message: body?.message, id };
}

async function authed(path, { method = "POST", body, dentallyId = 777001 } = {}) {
  const token = await encode({ token: { id: String(dentallyId), role: "PATIENT", email: "stripe-local-test@example.com", name: "Local Stripe Test Patient" }, secret: process.env.NEXTAUTH_SECRET });
  const res = await fetch(BASE + path, { method, headers: { "content-type": "application/json", cookie: `next-auth.session-token=${token}` }, body: body ? JSON.stringify(body) : undefined });
  let json; try { json = await res.json(); } catch { json = null; }
  return { status: res.status, json };
}

let pass = 0, fail = 0;
function check(name, cond, extra) {
  if (cond) { pass++; console.log("PASS", name); }
  else { fail++; console.log("FAIL", name, extra !== undefined ? JSON.stringify(extra) : ""); }
}
function summary() { console.log(`\n${pass} passed, ${fail} failed`); }

module.exports = { stripe, prisma, sendEvent, authed, check, summary, evtId };
