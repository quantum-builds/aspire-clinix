import { UserRoles } from "@/types/common";
import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";

export const loginMutation = () => {
  return useMutation({
    mutationFn: async ({
      email,
      password,
      phoneNumber,
      role,
    }: {
      email: string;
      password: string;
      phoneNumber: string;
      role: UserRoles;
    }) => {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
        phoneNumber,
        role,
      });

      console.log("response is ", result);
      if (!result || !result.ok) {
        throw new Error(result?.error || "Invalid credentials");
      }
      await new Promise((resolve) => setTimeout(resolve, 100));

      return result;
    },
  });
};
