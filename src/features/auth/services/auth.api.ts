

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
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  
  let json: any = null;
  try {
    json = await res.json();
  } catch {

  }

  if (!res.ok) {
    
    const title = json?.title ?? "Login failed";// gharare i18n piyade sazi beshe chejoori ba vojud in ?
   
   
    throw new Error(title);
  }

 
  return { ok: true };
}

export async function forgotPasswordApi(email: string) // nemishe baraye darkhasta format headers ro config nevesht ehy tekrar nashe?
{
  const res = await fetch("/api/auth/forgot-password",
  { method : "POST",
    headers :{"Content-Type": "application/json"},
    body    : JSON.stringify({email}),//chera ba format payload mesl Login Ferestade Nemishe

  });

  if(!res.ok)
  {
    const data = await res.json().catch(() => ({}));//age error dad data nabud kkhali bar gardun
    throw new Error(data?.title ||"Failed To Sent Reset Link");

  }
  return {ok : true};//chera khod Result Ro Bar NemiGardunim
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
    let data: any;
  try {
     data = await res.json();
    } 
catch {
  data = await res.text(); // fallback if it’s not JSON
}

const message =
  (typeof data === "string"
    ? data
    : data?.title || data?.detail || JSON.stringify(data)) ||
  "Reset Password Failed.";

throw new Error(message);
  }
  }

export async function registerApi(payload: RegisterPayload)
 {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
let json: any = null;
  try {
    json = await res.json();
  } catch {

  }

  if (!res.ok) {
    
    const title = json?.title ?? "";
   
   
    throw new Error(title);
  }

 
  return { ok: true };

  }

export async function verifyemailstatusApi(code: string) // nemishe baraye darkhasta format headers ro config nevesht ehy tekrar nashe?
{
 
  const res = await fetch("/api/auth/verify-emailstatus",
  { method : "POST",
    headers :{"Content-Type": "application/json"},
    body    : JSON.stringify({code}),//chera ba format payload mesl Login Ferestade Nemishe

  });

  if(!res.ok)
  {
    const data = await res.json().catch(() => ({}));//age error dad data nabud kkhali bar gardun
    throw new Error(data?.title ||"");

  }
  return {ok : true};//chera khod Result Ro Bar NemiGardunim
}
