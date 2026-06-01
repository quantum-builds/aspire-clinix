import { TokenRoles } from "@/constants/UserRoles";
import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";

const compactCredentials = <T extends Record<string, unknown>>(values: T) => {
  return Object.fromEntries(
    Object.entries(values).filter(
      ([, value]) => value !== undefined && value !== null && value !== "",
    ),
  ) as Partial<T>;
};

export const loginMutation = () => {
  return useMutation({
    mutationFn: async ({
      patientId,
      email,
      familyMemberId,
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
      familyMemberId?: string;
      otp?: string;
      password?: string;
      firstName?: string;
      lastName?: string;
      mobilePhone?: string;
      dateOfBirth?: string;
      role?: TokenRoles;
    }) => {
      const result = await signIn(
        "credentials",
        compactCredentials({
          redirect: false,
          patientId,
          email,
          otp,
          password,
          familyMemberId,
          firstName,
          lastName,
          mobilePhone,
          dateOfBirth,
          role,
        }),
      );

      if (!result || !result.ok) {
        throw new Error(
          result?.error
            ? result?.error?.includes("prisma")
              ? "Something went wrong"
              : result?.error
            : "Something went wrong",
        );
      }
      await new Promise((resolve) => setTimeout(resolve, 100));

      return result;
    },
  });
};
