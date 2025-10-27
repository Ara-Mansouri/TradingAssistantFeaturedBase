import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAccessToken, refreshTokens } from "@/lib/auth";

export async function middleware(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;
  const { pathname } = req.nextUrl;

 if ( pathname.startsWith("/auth")) 
  {
    if(accessToken  && verifyAccessToken(accessToken))
    return NextResponse.redirect(new URL("/dashboard", req.url));
  else
     return NextResponse.next();
  }
if(pathname.startsWith("/dashboard"))
{
  if(!accessToken && !refreshToken)
  {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }
}

 if(!verifyAccessToken(accessToken) && refreshToken) 
 {
    const refreshUrl = req.nextUrl.clone();
    refreshUrl.pathname = "/api/auth/refresh-token";
    return NextResponse.rewrite(refreshUrl);
 }
  
 

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*"],
};
