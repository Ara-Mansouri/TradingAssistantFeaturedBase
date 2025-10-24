 import { apiClient } from "@/app/api/client";

// interface LoginPayload {
//   email: string;
//   password: string;
// }

interface LoginResponse {
  tokenType: string;
  expireIn: number;
  accessToken: string;
  refreshToken: string;
  email: string;
}


interface ResetPasswordPayload {
  email: string;
  verificationCode: string;
  newPassword: string;
}
// src/features/auth/services/auth.api.ts
export interface LoginPayload {
  email: string;
  password: string;
}

export async function loginApi(payload: LoginPayload) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  
  let json: any = null;
  try {
    json = await res.json();
  } catch {
   // yani chi bi seda ???
   console.log("khata servicee");
  }

  if (!res.ok) {
    
    const title = json?.title ?? "Login failed";// gharare i18n piyade sazi beshe chejoori ba vojud in ?
    console.log("maaaannnn")
   
    throw new Error(title);
  }

 
  return { ok: true };
}

export async function forgotPasswordApi(email: string) {
  return apiClient.post("/api/v1/users/forgot-password", { email });
}


export async function resetPasswordApi(payload: ResetPasswordPayload) {
  const response = await apiClient.put("/api/v1/users/reset-password", payload);
  return response;
}