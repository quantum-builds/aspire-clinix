import { TokenRoles } from "@/constants/UserRoles";
import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";

type LoginMutationResult =
  | {
      pendingAdmin: true;
      email: string;
    }
  | {
      ok: true;
    };

type LoginMutationVariables = {
  patientId?: string;
  email?: string;
  otp?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  mobilePhone?: string;
  dateOfBirth?: string;
  role?: TokenRoles;
  isPendingAdmin?: boolean;
};

export const loginMutation = () => {
  return useMutation<LoginMutationResult, Error, LoginMutationVariables>({
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
      isPendingAdmin,
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
        isPendingAdmin,
      });

      if (result?.error === "PENDING_ADMIN") {
        return {
          pendingAdmin: true as const,
          email: email ?? "",
        };
      }

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

      return { ok: true };
    },
  });
};
