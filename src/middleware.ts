
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAccessToken } from "@/lib/auth";


const locales = ["en", "fa", "fr"];
const defaultLocale = "en";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  console.log("🌐 Middleware:", pathname);


  const cookieLocale = req.cookies.get("NEXT_LOCALE")?.value || defaultLocale;


  const res = NextResponse.next();
  res.headers.set("x-next-intl-locale", cookieLocale);

  
  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;


  if (pathname.startsWith("/auth")) {
    if (accessToken && verifyAccessToken(accessToken)) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return res;
  }


  if (pathname.startsWith("/dashboard")) {
    if (!accessToken && !refreshToken) {
      return NextResponse.redirect(new URL("/auth/Login", req.url));
    }
  }


  if (!verifyAccessToken(accessToken) && refreshToken) {
    const refreshUrl = req.nextUrl.clone();
    refreshUrl.pathname = "/api/auth/refresh-token";
    return NextResponse.rewrite(refreshUrl);
  }


  return res;
}

export const config = {
  matcher: [
    "/",            
    "/auth/:path*", 
    "/dashboard/:path*", 
  ],
};
