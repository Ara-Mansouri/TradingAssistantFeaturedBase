import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAccessToken } from "@/lib/auth";


const defaultLocale = "en"; 

const PUBLIC_STATIC = [
  "/manifest.json",
  "/favicon.ico",
  "/icons",
  "/images",
  "/sw.js",
  "/workbox-",
  "/_next",
];


export async function middleware(req: NextRequest) 
{
  const { pathname } = req.nextUrl;

  const cookieLocale = req.cookies.get("NEXT_LOCALE")?.value || defaultLocale;
  const res = NextResponse.next();
  res.headers.set("x-next-intl-locale", cookieLocale);

  if (PUBLIC_STATIC.some((p) => pathname.startsWith(p))) 
  {
    return res;
  }
  
  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;
  const isValid = accessToken && verifyAccessToken(accessToken);


  if (pathname === "/") 
  {
    if (!isValid) {
      return NextResponse.redirect(new URL("/auth/register", req.url));
    }
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (pathname.startsWith("/auth")) 
  {
    if (isValid)
    {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return res;
  }


  if (pathname.startsWith("/dashboard"))
   {
    if (!isValid && !refreshToken) 
    {
      return NextResponse.redirect(new URL("/auth/Login", req.url));
    }
  }


  if (!verifyAccessToken(accessToken) && refreshToken) 
  {
    const refreshUrl = req.nextUrl.clone();
    refreshUrl.pathname = "/api/auth/refresh-token";
    return NextResponse.rewrite(refreshUrl);
  }

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

  ],
};