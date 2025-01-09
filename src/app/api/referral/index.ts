import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/db";

type ResponseData = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    const { referralForm } = req.body;
    await prisma.referralForm.create({
      data: referralForm,
    });
    return res.status(201).json({ message: "Referral form created" });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
