"use client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { resetPasswordApi, ResetPasswordPayload } from "../services/auth.api";
import { useAuthContext } from "@/features/auth/context/AuthContext";
import { useLocale } from "next-intl"; 

interface UseResetPasswordOptions 
{
  onError?: (err: any) => void;
}


export function useResetPassword(options?: UseResetPasswordOptions) {
  const router = useRouter();
  const locale = useLocale(); 
  const { clearEmail } = useAuthContext();

  const mutation = useMutation({
    mutationFn: (payload: ResetPasswordPayload) => resetPasswordApi(payload),

    onSuccess: () => {
     
      router.replace("/auth/Login");
      clearEmail();
    },
      onError: (err) => {
      if (options?.onError) options.onError(err); 
    },


  });

  return {
    mutate: mutation.mutate,
    isPending: mutation.isPending
  };
}
