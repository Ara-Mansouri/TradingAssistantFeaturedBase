"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";   
import { loginApi , LoginPayload } from "../services/auth.api";


interface UseLoginOptions {
  onError?: (err: any) => void;
}

export function useLogin(options?: UseLoginOptions) {
  const router = useRouter();


  return useMutation({
    mutationFn: (payload: LoginPayload) => loginApi(payload),

    onSuccess: () => {
      router.push("/c");
    },

    onError: (err) => {
      if (options?.onError) options.onError(err); 
    },
  });
}
