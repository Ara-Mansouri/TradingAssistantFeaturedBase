"use client";

import { useMutation } from "@tanstack/react-query";
import { verifyemailstatusApi } from "../services/auth.api";


export function useVerifyEmailStatus() {
  return useMutation({
    mutationFn: verifyemailstatusApi,
        onSuccess: () =>
      {
      // router.push("/dashboard");
             },
  onError :(err : any) =>
  {
    console.error( err?.message) // inja chetoori bayad handle beshe
 
  },
  });
}
