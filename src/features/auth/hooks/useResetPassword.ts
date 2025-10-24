"use client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { resetPasswordApi, ResetPasswordPayload } from "../services/auth.api";



export function useResetPassword() 
{
  const router = useRouter();
  const email = sessionStorage.getItem("resetEmail")

  const mutation = useMutation({
    mutationFn :(payload : ResetPasswordPayload) => resetPasswordApi(payload),
    onSuccess : () =>{
      // sessionStorage.removeItem("resetEmail");
      router.push("/auth/Login")
    },
    onError :(error : any) =>{
      console.error("Reset Password Error" , error)
    }
  });
 return {
   email :email,
    mutate: mutation.mutate,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
    
  

}
