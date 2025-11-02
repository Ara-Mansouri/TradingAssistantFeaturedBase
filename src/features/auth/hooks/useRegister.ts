"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";   
import { registerApi, RegisterPayload } from "../services/auth.api";
import { useLocale } from "next-intl"; 

export function useRegister() {
  const router = useRouter();
  const locale = useLocale();

  const mutation = useMutation({
    mutationFn: (payload: RegisterPayload) => registerApi(payload),

    onSuccess: () => {
  
      router.push(`/${locale}/auth/verify-email`);
    },

    // onError: (err: any) => {
    //   console.error("Register failed", err?.message);
    // },
  });

  return mutation;
}
