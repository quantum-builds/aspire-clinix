import { useMutation } from "@tanstack/react-query";
import { signOut } from "next-auth/react";

export const signOutMutation = () => {
  return useMutation({
    mutationFn: async () => {
      try {
        await fetch("/api/access", { method: "DELETE" });
      } catch (error) {
        console.error("Failed to clear access cookie:", error);
      }

      await signOut();
    },
  });
};