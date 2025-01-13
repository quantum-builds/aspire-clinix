import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/db";
import { ReferralForm } from "@prisma/client";

type ResponseData = {
  message: string | ReferralForm[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    const { dentistId } = req.query;

    if (typeof dentistId !== "string") {
      return res.status(400).json({ message: "Invalid referral form id" });
    }
    const referralForms = await prisma.referralForm.findMany({
      where: { referrerDentistId: dentistId },
    });
    if (referralForms.length === 0) {
      return res.status(404).json({ message: "No referrel form exist" });
    } else {
      return res.status(200).json({ message: referralForms });
    }
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
}
