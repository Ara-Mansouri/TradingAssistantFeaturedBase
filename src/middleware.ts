// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { verifyAccessToken } from "@/lib/auth";

// ----- i18n setup -----
const locales = ["en", "fa", "fr"];
const defaultLocale = "en";

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: { mode: "never" },
  localeDetection: true,
  localeCookie: {
    name: "NEXT_LOCALE",
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 180,
  },
});

// ----- middleware function -----
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  console.log("🧩 Middleware path:", pathname);

  // Always run i18n first to attach locale cookie
  let res = intlMiddleware(req);

  // ✅ Ensure we *always* return a valid Response from every branch.

  // Pass through Next.js internals fast
  if (pathname.startsWith("/_next") || pathname.startsWith("/api") || pathname === "/favicon.ico") {
    return res;
  }

  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  // ----- AUTH PAGES -----
  if (pathname.startsWith("/auth")) {
    if (accessToken && verifyAccessToken(accessToken)) {
      // Already logged in → redirect to dashboard
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return res; // ✅ always return something
  }

  // ----- DASHBOARD PAGES -----
  if (pathname.startsWith("/dashboard")) {
    if (!accessToken && !refreshToken) {
      return NextResponse.redirect(new URL("/auth/Login", req.url));
    }
  }

  // ----- REFRESH TOKEN -----
  if (accessToken && !verifyAccessToken(accessToken) && refreshToken) {
    const refreshUrl = req.nextUrl.clone();
    refreshUrl.pathname = "/api/auth/refresh-token";
    return NextResponse.rewrite(refreshUrl);
  }

  // ✅ Default: continue as normal
  return res;
}

// ----- matcher -----
export const config = {
  matcher: ["/((?!_next|favicon\\.ico).*)"],
};
