import { apiClient } from "@/lib/api/client";

interface LoginPayload {
  email: string;
  password: string;
}

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


export async function loginApi(payload: LoginPayload) {
  const response = await apiClient.post<LoginResponse>("/api/v1/users/sign-in-password", payload);
  return response;
}
export async function forgotPasswordApi(email: string) {
  return apiClient.post("/api/v1/users/forgot-password", { email });
}


export async function resetPasswordApi(payload: ResetPasswordPayload) {
  const response = await apiClient.put("/api/v1/users/reset-password", payload);
  return response;
}