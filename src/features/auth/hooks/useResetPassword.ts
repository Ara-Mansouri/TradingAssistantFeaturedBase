"use client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { resetPasswordApi, ResetPasswordPayload } from "../services/auth.api";
import { useAuthContext } from "@/context/AuthContext";


export function useResetPassword() 
{
  const router = useRouter();
  const { clearEmail } = useAuthContext();
  const mutation = useMutation({
    mutationFn :(payload : ResetPasswordPayload) => resetPasswordApi(payload),
    onSuccess : () =>{
      
      router.replace("/auth/Login")
         clearEmail();
    },
    onError :(error : any) =>{
      console.error("Reset Password Error" , error)
    }
  });
 return {
    mutate: mutation.mutate,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
    
  

}
