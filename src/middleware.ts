import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAccessToken } from "@/lib/auth";

const defaultLocale = "en";

const PUBLIC_PATHS = [
  "/manifest.json",
  "/sw.js",
  "/workbox-",
  "/icons/",
  "/favicon.ico", 
  "/images",
 "/_next", 
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ---------- 1) allow PWA files ----------
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    const res = NextResponse.next();
    const cookieLocale = req.cookies.get("NEXT_LOCALE")?.value || defaultLocale;
    res.headers.set("x-next-intl-locale", cookieLocale);
    return res;
  }

  // ---------- Locale ----------
  const cookieLocale = req.cookies.get("NEXT_LOCALE")?.value || defaultLocale;
  const res = NextResponse.next();
  res.headers.set("x-next-intl-locale", cookieLocale);

  // ---------- Tokens ----------
  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

    if (pathname === "/"  && !verifyAccessToken(accessToken)) 
    {
    return NextResponse.redirect(new URL("/auth/register", req.url));
    }

  // ---------- Auth pages ----------
  if (pathname.startsWith("/auth")) {
    if (accessToken && verifyAccessToken(accessToken)) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return res;
  }

  // ---------- Dashboard ----------
  if (pathname.startsWith("/dashboard")) {
    if (!accessToken && !refreshToken) {
      return NextResponse.redirect(new URL("/auth/Login", req.url));
    }
  }

  // ---------- Refresh ----------
  if (!verifyAccessToken(accessToken) && refreshToken) {
    const refreshUrl = req.nextUrl.clone();
    refreshUrl.pathname = "/api/auth/refresh-token";
    return NextResponse.rewrite(refreshUrl);
  }

  // ---------- Catch-all unauthorized ----------
  if (!verifyAccessToken(accessToken) && !refreshToken && !pathname.startsWith("/auth")) 
  {
    return NextResponse.redirect(new URL("/auth/Login", req.url));
  }

  return res;
}

export const config = {
  matcher: [
    "/",
    "/auth/:path*",
    "/dashboard/:path*",
    "/((?!_next/static|_next/image|favicon.ico).*)"
  ],
};
