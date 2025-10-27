"use client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { forgotPasswordApi } from "../services/auth.api";
import { useAuthContext  } from "@/context/AuthContext";


export function useForgotPassword() {
  const router = useRouter();
 const { setEmail } = useAuthContext();
  const mutation = useMutation({
    mutationFn: (email: string) => forgotPasswordApi(email),

    onSuccess: (_data, email) => {
       setEmail(email);
      router.push("/auth/reset-password"); 
    },

    onError: (error: any) => {
      console.error("Forgot password error:", error);
    },
  });

  return {
    mutate: mutation.mutate,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
}
