"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";   
import { loginApi , LoginPayload } from "../services/auth.api";
import { useLocale } from "next-intl";

interface UseLoginOptions {
  onError?: (err: any) => void;
}

export function useLogin(options?: UseLoginOptions) {
  const router = useRouter();
  const locale = useLocale();

  return useMutation({
    mutationFn: (payload: LoginPayload) => loginApi(payload, locale),

    onSuccess: () => {
      router.push("/dashboard");
    },

    onError: (err) => {
      if (options?.onError) options.onError(err); 
    },
  });
}
