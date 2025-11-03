import { NextResponse } from "next/server";
import { setAuthCookies } from "@/lib/cookies";
import { AppLocale, defaultLocale, localeCookieName, locales } from "@/i18n/config";

function resolveLocale(cookieHeader: string | null): AppLocale {
  if (!cookieHeader) {
    return defaultLocale;
  }

  const cookies = cookieHeader.split(";").map((cookie) => cookie.trim());
  const localeCookie = cookies
    .find((cookie) => cookie.startsWith(`${localeCookieName}=`))
    ?.split("=")[1];

  if (!localeCookie) {
    return defaultLocale;
  }

  const decodedLocale = decodeURIComponent(localeCookie);
  return locales.includes(decodedLocale as AppLocale)
    ? (decodedLocale as AppLocale)
    : defaultLocale;
}

export async function GET(req: Request) {
  const cookieHeader = req.headers.get("cookie");
  const locale = resolveLocale(cookieHeader);

  try {
    let refreshToken = cookieHeader
      ?.split(";")
      .map((cookie) => cookie.trim())
      .find((cookie) => cookie.startsWith("refreshToken="))
      ?.split("=")[1];

    if (refreshToken) {
      refreshToken = decodeURIComponent(refreshToken);
    }

    if (!refreshToken) {
      return NextResponse.redirect(new URL("/auth/Login", req.url));
    }

    const result = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/refresh-token`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: refreshToken }),
      }
    );

    if (!result.ok) {
      return NextResponse.redirect(new URL("/auth/Login", req.url));
    }

    const data = await result.json();

    const res = NextResponse.redirect(new URL("/dashboard", req.url));
    setAuthCookies(res, data.accessToken, data.refreshToken);
    res.headers.set("Content-Language", locale);

    return res;
  } catch (err) {
    return NextResponse.redirect(new URL("/auth/Login", req.url));
  }
}