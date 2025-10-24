"use client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { forgotPasswordApi } from "../services/auth.api";

export function useForgotPassword() {

  const router = useRouter();
  const mutation = useMutation({
    mutationFn : (email : string) => forgotPasswordApi(email),
    onSuccess : (_data , email) =>
    {
      sessionStorage.setItem("resetEmail", email);
      router.push("/auth/reset-password");
    },
    onError : (error : any) =>
       console.error("Forgot password error:", error)
  });
   return {
    mutate: mutation.mutate,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };

  
}
