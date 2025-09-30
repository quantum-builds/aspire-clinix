import { useMutation } from "@tanstack/react-query";
import { signOut } from "next-auth/react";

export const signOutMutation = () => {
  return useMutation({
    mutationFn: async () => {
      await signOut();
    },
  });
};
