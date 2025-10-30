import jwt from "jsonwebtoken";

interface TokenPayload {
  userId: string;
  exp: number;
}

export function verifyAccessToken(token?: string): boolean 
{
  if (!token) return false;
  try 
  {
    const decoded : any = jwt.decode(token);
    const exp = decoded?.exp;
    if (!exp || exp * 1000 < Date.now())
    {
      return false;
    }
   else
      return true;
  } 
  catch 
  {
    return false;
  }
}

// export async function refreshTokens(refreshToken?: string) {
//   if (!refreshToken) return null;


//   const response = await fetch("/api/auth/refresh-token",
//  {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ refreshToken }),
//   });

//   if (!response.ok) return null;
//   const data = await response.json();
//   return { accessToken: data.accessToken, refreshToken: data.refreshToken };
// }
