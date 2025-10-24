// src/app/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const access = req.cookies.get("accessToken")?.value;
  const { pathname } = req.nextUrl;
  const lowerPath = pathname.toLowerCase(); 
 console.log("🔥 MIDDLEWARE FIRED:", req.nextUrl.pathname);
  if (!access && lowerPath.startsWith("/dashboard")) {
    const url = new URL("/auth/login", req.url);
    return NextResponse.redirect(url);
  }

  if (
    access &&
    (lowerPath.startsWith("/auth/login") || lowerPath.startsWith("/auth/register"))
  ) {
    const url = new URL("/dashboard", req.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/auth/:path*",
  ],
};
