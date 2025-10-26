"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";   
import { loginApi , LoginPayload } from "../services/auth.api";



export function useLogin(){
  const router = useRouter()
  const mutation = useMutation({
    mutationFn :(payload : LoginPayload) => loginApi(payload),
    onSuccess: () =>
      {
      router.push("/dashboard");
             },
  onError :(err : any) =>
  {
    console.error("Login failed", err?.message) // inja chetoori bayad handle beshe
  },

    });
    return mutation;
    
  }
