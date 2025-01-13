import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/db";
import { ReferralForm } from "@prisma/client";
import { getAccessTokenFromCookies, verifyToken } from "@/utils/tokenManager";

type ResponseData = {
  message: string;
  data: ReferralForm;
};
type ResponseMessage = {
  message: string;
};

function verifyUserAccess(userId: string, updatedReferralForm: ReferralForm) {
  if (userId === updatedReferralForm.id) {
    return true;
  } else {
    return false;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData | ResponseMessage>
) {
  try {
    const { referralFormId } = req.query;
    if (typeof referralFormId !== "string") {
      return res.status(400).json({ message: "Invalid referral form id" });
    }

    if (req.method === "GET") {
      const referralForm = await prisma.referralForm.findUnique({
        where: { id: referralFormId },
      });
      if (!referralForm) {
        return res
          .status(404)
          .json({ message: "Referral form does not exist" });
      }
      return res.status(200).json({
        message: "Referral form fetched successfully",
        data: referralForm,
      });
    } else if (req.method === "PUT") {
      //   const accessToken = getAccessTokenFromCookies(req);
      //   if (!accessToken) {
      //     return res
      //       .status(401)
      //       .json({ message: "You are not authorized to perform this action" });
      //   }

      //   const userId = verifyToken(accessToken);
      //   if (!userId) {
      //     return res.status(401).json({
      //       message: "You are not authorized to perform this action",
      //     });
      //   }

      //   const updatedReferralForm: ReferralForm = req.body;
      //   if (verifyUserAccess(userId as string, updatedReferralForm)) {
      //     await prisma.referralForm.update({
      //       where: { id: referralFormId },
      //       data: updatedReferralForm,
      //     });
      //     return res
      //       .status(200)
      //       .json({ message: "Referral form updated succcessfully" });
      //   } else {
      //     return res.status(401).json({
      //       message: "You are not authorized to perform this action",
      //     });
      //   }

      const updatedReferralForm: ReferralForm = req.body;
      await prisma.referralForm.update({
        where: { id: referralFormId },
        data: updatedReferralForm,
      });
      return res
        .status(200)
        .json({ message: "Referral form updated succcessfully" });
    } else {
      return res.status(405).json({ message: "Method Not Allowed" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
}
