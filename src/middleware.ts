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
  const setNoStoreHeaders = (response: NextResponse) => 
  {
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0"
    );
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
    response.headers.set("Surrogate-Control", "no-store");
    response.headers.set("X-Accel-Expires", "0");
  };
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
      const redirect = NextResponse.redirect(new URL("/auth/Login", req.url));
      setNoStoreHeaders(redirect);
      return redirect;
    }
    const redirect = NextResponse.redirect(new URL("/c", req.url));
    setNoStoreHeaders(redirect);
    return redirect;
  }

  if (pathname.startsWith("/auth")) 
  {
    if (isValid)
    {
      const redirect = NextResponse.redirect(new URL("/c", req.url));
      setNoStoreHeaders(redirect);
      return redirect;
    }
    setNoStoreHeaders(res);
    return res;
  }


  if (pathname.startsWith("/c"))
   {
    if (!isValid && !refreshToken) 
    {
      const redirect = NextResponse.redirect(new URL("/auth/Login", req.url));
      setNoStoreHeaders(redirect);
      return redirect;
    }
  }


  if (!verifyAccessToken(accessToken) && refreshToken) 
  {
    const refreshUrl = req.nextUrl.clone();
    refreshUrl.pathname = "/api/auth/refresh-token";
    const rewrite = NextResponse.rewrite(refreshUrl);
    setNoStoreHeaders(rewrite);
    return rewrite;
  }

   if (!verifyAccessToken(accessToken) && !refreshToken && !pathname.startsWith("/auth")) 

  {
    const redirect = NextResponse.redirect(new URL("/auth/Login", req.url));
    setNoStoreHeaders(redirect);
    return redirect;
  }
 if (pathname.startsWith("/c") || pathname.startsWith("/auth")) {
    setNoStoreHeaders(res);
  }

  return res;
}

export const config = {
  matcher: [
    "/",            
    "/auth/:path*", 
    "/c/:path*", 

  ],
};