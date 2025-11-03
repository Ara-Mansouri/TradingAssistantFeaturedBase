"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";   
import { registerApi, RegisterPayload } from "../services/auth.api";

export function useRegister() {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: (payload: RegisterPayload) => registerApi(payload),

    onSuccess: () => {
      router.push("/auth/verify-email");
    },

  });

  return mutation;
}