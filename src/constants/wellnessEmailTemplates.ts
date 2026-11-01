import { wrapHtml } from "@/constants/referralEmailTemplates";

export const WELLNESS_MEMBERSHIPS_SUBJECT =
  "Your guide to Aspire Wellness memberships";

const P = "font-size:15px;line-height:1.6;";
const H3 = "margin:20px 0 10px;color:#B7A58D;";
const UL = "font-size:15px;line-height:1.6;margin:0 0 12px 0;padding-left:22px;";

const tier = (
  heading: string,
  items: string[],
  idealFor: string,
) => `
      <h3 style="${H3}">${heading}</h3>
      <p style="${P}margin-bottom:4px;"><strong>What is included:</strong></p>
      <ul style="${UL}">
        ${items.map((item) => `<li>${item}</li>`).join("")}
      </ul>
      <p style="${P}"><em>${idealFor}</em></p>
`;

export function wellnessMembershipsEmail(firstName?: string): string {
  return wrapHtml(
    "Aspire Wellness Memberships",
    `
      <p style="${P}">
        Dear ${firstName || "Client"},
      </p>

      <p style="${P}">
        Thank you for choosing Aspire Wellness. Many of our clients find the greatest benefit comes from
        regular recovery rather than an occasional visit, so we have created three memberships to make that
        simple.
      </p>

      <p style="${P}">
        Below is everything you need to know, laid out tier by tier.
      </p>

      <h3 style="${H3}">At a Glance</h3>
      <ul style="${UL}">
        <li><strong>Essentials:</strong> £275 per month, 4 treatments per month</li>
        <li><strong>Perform:</strong> £445 per month, 8 treatments per month</li>
        <li><strong>Unlimited:</strong> £785 per month, unlimited treatments</li>
      </ul>
      <p style="${P}">All prices include VAT.</p>
      ${tier(
        "Essentials: £275 per month",
        [
          "Any 4 treatments per month, including up to 2 Hyperbaric Oxygen sessions",
          "VIP access to our special events",
          "1 guest pass",
          "1 breathwork session",
        ],
        "Ideal if you want a steady monthly rhythm of recovery.",
      )}
      ${tier(
        "Perform: £445 per month",
        [
          "Any 8 treatments per month, including up to 4 Hyperbaric Oxygen sessions",
          "VIP access to our special events",
          "2 guest passes",
          "2 breathwork sessions",
        ],
        "Ideal if you train regularly or want to visit around twice a week.",
      )}
      ${tier(
        "Unlimited: £785 per month",
        [
          "Unlimited treatments, including up to 8 Hyperbaric Oxygen sessions per month",
          "VIP access to our special events",
          "3 guest passes",
          "3 breathwork sessions",
        ],
        "Ideal if recovery is a central part of your week.",
      )}
      <h3 style="${H3}">Treatments You Can Use With Your Membership</h3>
      <ul style="${UL}">
        <li>Whole Body Cryotherapy</li>
        <li>Sunlighten&reg; Infrared Sauna</li>
        <li>Hyperbaric Oxygen Therapy</li>
        <li>Red Light Therapy</li>
        <li>Ice Bath</li>
        <li>Contrast Session (Cryotherapy or Ice Bath, followed by Infrared Sauna). This counts as two treatments.</li>
      </ul>

      <h3 style="${H3}">How to Join</h3>
      <p style="${P}">
        Simply reply to this email, speak to any member of our team at reception, or call us on
        <strong>020 8081 9958</strong>, and we will set up your membership and book your first sessions.
      </p>

      <p style="${P}">
        We look forward to welcoming you back.
      </p>

      <p style="${P}">
        Warm regards,<br/>
        <strong>The Aspire Wellness Team</strong>
      </p>

      <p style="${P}">
        29 to 35 Mortimer Street, London W1T 3JG<br/>
        020 8081 9958 | <a href="https://theaspireclinic.com" style="color:#B7A58D;">theaspireclinic.com</a>
      </p>
    `,
    "Aspire Wellness",
  );
}
