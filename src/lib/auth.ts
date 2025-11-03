import jwt from "jsonwebtoken";


interface TokenPayload {
  exp?: number;
  [key: string]: unknown; 
}

export function verifyAccessToken(token?: string): boolean {
  if (!token) return false;

  try {
   
    const decoded = jwt.decode(token) as TokenPayload | null;

    if (!decoded?.exp) return false; 

   
    return decoded.exp * 1000 >= Date.now();
  } catch {
    return false;
  }
}
