
import { handleApiError } from "@/utils/handleApiError";

export  interface ResetPasswordPayload
 {
  email: string;
  verificationCode: string;
  newPassword: string;
}

export interface LoginPayload 
{
  email: string;
  password: string;
}
export interface RegisterPayload 
{
  email: string;
  password: string;
  firstName : string ;
  lastName : string ;
}

export async function loginApi(payload: LoginPayload) 
{
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json"},
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      const message = handleApiError(data);
      throw new Error(message);
  }

 
  return { ok: true };
}

export async function forgotPasswordApi(email: string) 
{
  const res = await fetch("/api/auth/forgot-password",
  { method : "POST",
    headers :{"Content-Type": "application/json"},
    body    : JSON.stringify({email}),

  });

  if(!res.ok)
  {
      const data = await res.json().catch(() => ({}));
      const message = handleApiError(data);
      throw new Error(message);

  }
  return {ok : true};
}

export async function resetPasswordApi(payload: ResetPasswordPayload)
 {
  const res = await fetch("/api/auth/reset-password", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
if(res.status == 204)

  {
    return {ok : true};
  }
  if(!res.ok)
  {
      const data = await res.json().catch(() => ({}));
      const message = handleApiError(data);
      throw new Error(message);
    }
    return { ok: true };
  }

export async function registerApi(payload: RegisterPayload)
 {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    
      const data = await res.json().catch(() => ({}));
      const message = handleApiError(data);
      throw new Error(message);
  }

 
  return { ok: true };

  }

export async function verifyemailstatusApi(code: string) 
{
 
  const res = await fetch("/api/auth/verify-emailstatus",
  { method : "POST",
    headers :{"Content-Type": "application/json"},
    body    : JSON.stringify({code}),

  });

  if(!res.ok)
  {
      const data = await res.json().catch(() => ({}));
      const message = handleApiError(data);
      throw new Error(message);

  }
  return {ok : true};
}
