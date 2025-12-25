import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/auth";

export async function GET(req: NextRequest) 
{
  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;
  
  const isAuthenticated = accessToken && verifyAccessToken(accessToken);
  const hasRefreshToken = !!refreshToken;
  
  const authenticated = isAuthenticated || hasRefreshToken;
  
  const response = NextResponse.json({ authenticated }, { status: 200 });
  
  response.headers.set(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");
  
  return response;
}

