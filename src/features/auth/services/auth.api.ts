import { apiClient } from "@/lib/api/client";

interface LoginPayload {
  email: string;
  password: string;
}

export async function loginApi(payload: LoginPayload) {
  const response = await apiClient.post("/api/v1/users/sign-in-password", payload);
  return response;
}
