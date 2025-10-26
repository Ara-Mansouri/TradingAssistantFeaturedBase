// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const access = req.cookies.get("accessToken")?.value;
  // const reset  = req.cookies.get("resetEmail")?.value;
  const { pathname } = req.nextUrl;

  
  if (!access && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  
  if (access && pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  
  // if (!reset && pathname.startsWith("/auth/reset-password")) {
  //   return NextResponse.redirect(new URL("/auth/forgot-password", req.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*"],
};
