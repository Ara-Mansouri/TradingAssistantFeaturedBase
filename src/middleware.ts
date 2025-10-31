import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAccessToken } from "@/lib/auth";
import createMiddleware from "next-intl/middleware";

const locales = ["en", "fa", "fr"];
const defaultLocale = "en";

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localeDetection: false,
});

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.match(/\.(.*)$/)
  ) 
  {
    return NextResponse.next();
  }

 
  const hasLocale = locales.some(
    (loc) => pathname.startsWith(`/${loc}/`) || pathname === `/${loc}`
  );

  if (!hasLocale) {
    
    return intlMiddleware(req);
  }

  
  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  
  if (pathname.includes("/auth")) {
    if (accessToken && verifyAccessToken(accessToken))
     {
      
      const locale = pathname.split("/")[1] || defaultLocale;
      return NextResponse.redirect(new URL(`/${locale}/dashboard`, req.url));
    }
    return NextResponse.next();
  }

  // Dashboard Logic
  if (pathname.includes("/dashboard")) {
    if (!accessToken && !refreshToken) {
      const locale = pathname.split("/")[1] || defaultLocale;
      return NextResponse.redirect(new URL(`/${locale}/auth/Login`, req.url));
    }
  }

 // Refresh Token Logic
  if ( !verifyAccessToken(accessToken) && refreshToken) {
    const refreshUrl = req.nextUrl.clone();
    refreshUrl.pathname = "/api/auth/refresh-token";
    return NextResponse.rewrite(refreshUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
