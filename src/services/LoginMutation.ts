import { UserRoles } from "@/types/common";
import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";

export const loginMutation = () => {
  return useMutation({
    mutationFn: async ({
      patientId,
      email,
      otp,
      password,
      firstName,
      lastName,
      mobilePhone,
      dateOfBirth,
      role,
    }: {
      patientId?: string;
      email?: string;
      otp?: string;
      password?: string
      firstName?: string
      lastName?: string
      mobilePhone?: string
      dateOfBirth?: string
      role?: UserRoles;
    }) => {
      const result = await signIn("credentials", {
        redirect: false,
        patientId,
        email,
        otp,
        password,
        firstName,
        lastName,
        mobilePhone,
        dateOfBirth,
        role,
      });

      if (!result || !result.ok) {
        throw new Error(
          result?.error
            ? result?.error?.includes("prisma")
              ? "Something went wrong"
              : result?.error
            : "Something went wrong"
        );
      }
      await new Promise((resolve) => setTimeout(resolve, 100));

      return result;
    },
  });
};
