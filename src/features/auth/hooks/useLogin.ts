"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";   
import { loginApi , LoginPayload } from "../services/auth.api";
import { useLocale } from "next-intl";

export function useLogin(){
  const router = useRouter()
  const locale = useLocale();
  const mutation = useMutation({
    mutationFn :(payload : LoginPayload) => loginApi(payload, locale),
    onSuccess: () =>
      {
       router.push(`/${locale}/dashboard`);
             },
  // onError :(err : any) =>
  // {
  //   console.error("Login failed", err?.message) // inja chetoori bayad handle beshe
  // },

    });
    return mutation;
    
  }
