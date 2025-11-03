import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { verifyAccessToken } from "@/lib/auth";
import {
  defaultLocale,
  localeCookieMaxAge,
  localeCookieName,
  locales,
} from "@/i18n/config";

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localeDetection: true,
  localePrefix: {
    mode: "never",
  },
  localeCookie: {
    name: localeCookieName,
    sameSite: "lax",
    path: "/",
    maxAge: localeCookieMaxAge,
  },
});

function applyIntlCookies(target: NextResponse, source: NextResponse) {
  source.cookies.getAll().forEach((cookie) => {
    target.cookies.set(cookie);
  });
  return target;
}

function applyIntlState(target: NextResponse, source: NextResponse) {
  source.headers.forEach((value, key) => {
    if (key === "x-middleware-rewrite" || key === "location" || key === "set-cookie") {
      return;
    }
    target.headers.set(key, value);
  });

  return applyIntlCookies(target, source);
}

export async function middleware(req: NextRequest) {
  const intlResponse = intlMiddleware(req);

  const withIntl = (response: NextResponse = NextResponse.next()) =>
    applyIntlState(response, intlResponse);

  // if (
  //   intlResponse.headers.has("location") ||
  //   intlResponse.headers.has("x-middleware-rewrite")
  // ) {
  //   return intlResponse;
  // }

  const { pathname } = req.nextUrl;

  if (
    !(
      pathname.startsWith("/auth") ||
      pathname.startsWith("/dashboard") ||
      pathname === "/"
    )
  ) {
    return withIntl();
  }

  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  if (pathname.startsWith("/auth")) {
    if (accessToken && verifyAccessToken(accessToken)) {
      const redirectResponse = NextResponse.redirect(new URL("/dashboard", req.url));
      return applyIntlState(redirectResponse, intlResponse);
    }
    return withIntl();
  }

  if (pathname.startsWith("/dashboard")) {
    if (!accessToken && !refreshToken) {
      const redirectResponse = NextResponse.redirect(new URL("/auth/Login", req.url));
      return applyIntlState(redirectResponse, intlResponse);
    }
  }

  if (refreshToken && !verifyAccessToken(accessToken)) {
    const refreshUrl = req.nextUrl.clone();
    refreshUrl.pathname = "/api/auth/refresh-token";
    const rewriteResponse = NextResponse.rewrite(refreshUrl);
    return applyIntlState(rewriteResponse, intlResponse);
  }

  return withIntl();
}

export const config = {
  matcher: ["/((?!api|_next|favicon\\.ico).*)"],
};