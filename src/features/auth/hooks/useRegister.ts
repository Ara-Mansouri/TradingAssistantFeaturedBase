"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";   
import { registerApi, RegisterPayload } from "../services/auth.api";
import { useLocale } from "next-intl"; 


interface UseRegisterOptions 
{
  onError?: (err: any) => void;
}
export function useRegister(options?: UseRegisterOptions)
 {
  const router = useRouter();
  const locale = useLocale();

  const mutation = useMutation({
    mutationFn: (payload: RegisterPayload) => registerApi(payload),

    onSuccess: () => {
  
      router.push("/auth/verify-email");
    },
    onError: (err) => {
      if (options?.onError) options.onError(err); 
    },

  });

  return mutation;
}
