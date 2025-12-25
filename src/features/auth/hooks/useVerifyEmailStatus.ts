"use client";

import { useMutation } from "@tanstack/react-query";
import { verifyemailstatusApi } from "../services/auth.api";


export function useVerifyEmailStatus() {
  return useMutation({
    mutationFn: verifyemailstatusApi,
        onSuccess: () =>
      {
     
             },
 
  });
}
