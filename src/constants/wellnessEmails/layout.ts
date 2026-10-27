import { wrapHtml } from "@/constants/referralEmailTemplates";

/**
 * Shared building blocks for Aspire Wellness emails. Each treatment email
 * composes these so the styling stays consistent across all of them.
 */

const P = "font-size:15px;line-height:1.6;";
const H3 = "margin:20px 0 10px;color:#B7A58D;";
const LIST = "font-size:15px;line-height:1.6;margin:0 0 12px 0;padding-left:22px;";

export function wellnessEmailLayout(title: string, body: string): string {
  return wrapHtml(title, body, "Aspire Wellness");
}

export function greeting(firstName?: string): string {
  return paragraph(`Dear ${firstName || "Client"},`);
}

export function paragraph(text: string): string {
  return `<p style="${P}">${text}</p>`;
}

export function sectionHeading(text: string): string {
  return `<h3 style="${H3}">${text}</h3>`;
}

export function bulletList(items: string[]): string {
  return `<ul style="${LIST}">${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;
}

export function numberedList(items: { title: string; text: string }[]): string {
  return `<ol style="${LIST}">${items
    .map(
      ({ title, text }) =>
        `<li style="margin-bottom:6px;"><strong>${title}</strong> ${text}</li>`,
    )
    .join("")}</ol>`;
}

export function bookingDetails({
  treatment,
  date,
  time,
  allow,
}: {
  treatment: string;
  date: string;
  time: string;
  allow: string;
}): string {
  return bookingRows([
    { label: "Treatment", value: treatment },
    { label: "Date and time", value: `${date} at ${time}` },
    { label: "Please allow", value: allow },
  ]);
}

export function bookingRows(rows: { label: string; value: string }[]): string {
  return (
    sectionHeading("Your Booking") +
    bulletList(rows.map(({ label, value }) => `<strong>${label}:</strong> ${value}`))
  );
}

export function changeBooking(): string {
  return (
    sectionHeading("Need to Change Your Booking?") +
    paragraph(
      "Please call us on <strong>020 8081 9958</strong> and we will be happy to help.",
    )
  );
}

export function signOff(): string {
  return (
    paragraph("Warm regards,<br/><strong>The Aspire Wellness Team</strong>") +
    paragraph(
      `29 to 35 Mortimer Street, London W1T 3JG<br/>
      020 8081 9958 | <a href="https://theaspireclinic.com" style="color:#B7A58D;">theaspireclinic.com</a>`,
    )
  );
}
