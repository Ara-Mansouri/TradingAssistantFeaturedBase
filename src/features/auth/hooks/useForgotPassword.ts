"use client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { forgotPasswordApi } from "../services/auth.api";
import { useAuthContext } from "@/features/auth/context/AuthContext";
import { useLocale } from "next-intl"; 

interface UseForgetPasswordOptions 
{
  onError?: (err: any) => void;
}
export function useForgotPassword(options?: UseForgetPasswordOptions) {
  const router = useRouter();
  const locale = useLocale(); 
  const { setEmail } = useAuthContext();

  const mutation = useMutation({
    mutationFn: (email: string) => forgotPasswordApi(email),

    onSuccess: (_data, email) => {
      setEmail(email);

      
      router.push("/auth/reset-password");
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
