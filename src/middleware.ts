import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAccessToken } from "@/lib/auth";
import createMiddleware from "next-intl/middleware";


const intlMiddleware = createMiddleware({
  locales: ["en", "fa", "fr"],
  defaultLocale: "en"
});


export async function middleware(req: NextRequest) {

  const intlResponse = intlMiddleware(req);
  if (intlResponse) return intlResponse;

  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;
  const { pathname } = req.nextUrl;


  if (pathname.includes("/auth")) {
    if (accessToken && verifyAccessToken(accessToken)) {
      return NextResponse.redirect(new URL("/en/dashboard", req.url));
    }
    return NextResponse.next();
  }

  if (pathname.includes("/dashboard")) {
    if (!accessToken && !refreshToken) {
      return NextResponse.redirect(new URL("/en/auth/login", req.url));
    }
  }

  // رفرش توکن
  if (!verifyAccessToken(accessToken) && refreshToken) {
    const refreshUrl = req.nextUrl.clone();
    refreshUrl.pathname = "/api/auth/refresh-token";
    return NextResponse.rewrite(refreshUrl);
  }

  return NextResponse.next();
}


export const config = {
  matcher: [

    "/((?!api|_next|.*\\..*).*)"
  ]
};
