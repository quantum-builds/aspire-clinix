// Sends a signed Dentally appointment webhook to the LOCAL dev server, for
// testing refunds and credit restore (REFUND_PLAN.md V4-V7, V14).
//
// It only POSTs to http://localhost:3000; it never calls Dentally or the DB
// itself. The dev server it hits uses whatever DATABASE_URL it was started
// with, so only pass IDs of test appointments you created.
//
// Usage:
//   node scripts/stripe-local/send-dentally-event.cjs <appointmentId> <patientDentallyId> [options]
// Options:
//   --state <s>      appointment state (default "Cancelled"; e.g. "Did not attend", "Confirmed")
//   --event <e>      appointment.updated (default) | appointment.deleted
//   --start <iso>    start_time in the payload (default: tomorrow 10:00Z)
//   --repeat <n>     send the same payload n times (duplicate delivery), default 1
//   --bad-signature  send with a wrong signature (expect 401)
const fs = require("fs");
const crypto = require("crypto");
const R = require("path").resolve(__dirname, "../..");

for (const file of [R + "/.env", R + "/.env.local"]) {
  if (!fs.existsSync(file)) continue;
  for (const line of fs.readFileSync(file, "utf8").split("\n")) {
    const m = line.match(/^\s*([\w.-]+)\s*=\s*(.*)$/); if (!m) continue;
    let v = m[2].trim(); if (/^(["']).*\1$/.test(v)) v = v.slice(1, -1);
    process.env[m[1]] = v;
  }
}

const args = process.argv.slice(2);
const [appointmentId, patientId] = args;
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? fallback : args[i + 1];
};

if (!appointmentId || !patientId) {
  console.error("Usage: send-dentally-event.cjs <appointmentId> <patientDentallyId> [--state s] [--event e] [--start iso] [--repeat n] [--bad-signature]");
  process.exit(1);
}

const SECRET = process.env.DENTALLY_WEBHOOK_SECRET;
if (!SECRET) throw new Error("DENTALLY_WEBHOOK_SECRET is not set");

const event = opt("event", "appointment.updated");
const state = opt("state", "Cancelled");
const start = new Date(opt("start", new Date(Date.now() + 86400000).toISOString().slice(0, 10) + "T10:00:00Z"));
const repeat = Number(opt("repeat", "1"));

const payload = JSON.stringify({
  event,
  data: {
    id: Number(appointmentId),
    patient_id: Number(patientId),
    state,
    start_time: start.toISOString(),
    finish_time: new Date(start.getTime() + 3600000).toISOString(),
    cancelled_at: state === "Cancelled" ? new Date().toISOString() : null,
    reason: "Local refund test",
  },
});

const signature = args.includes("--bad-signature")
  ? "0".repeat(64)
  : crypto.createHmac("sha256", SECRET).update(payload, "utf8").digest("hex");

(async () => {
  for (let i = 1; i <= repeat; i++) {
    const res = await fetch("http://localhost:3000/api/webhooks/dentally", {
      method: "POST",
      headers: { "content-type": "application/json", "X-Dentally-Signature": signature },
      body: payload,
    });
    console.log(`#${i} ${event} state=${state} -> ${res.status}`, await res.text());
  }
})();
