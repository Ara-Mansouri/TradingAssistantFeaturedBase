"use client";

import { useMutation } from "@tanstack/react-query";
import { loginApi , LoginPayload } from "../services/auth.api";


interface UseLoginOptions {
  onError?: (err: any) => void;
}

export function useLogin(options?: UseLoginOptions) {
  return useMutation({
    mutationFn: (payload: LoginPayload) => loginApi(payload),

    onSuccess: () => {
      window.location.replace("/c");
    },

    onError: (err) => {
      if (options?.onError) options.onError(err); 
    },
  });
}
