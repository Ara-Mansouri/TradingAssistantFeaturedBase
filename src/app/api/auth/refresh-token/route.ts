import { NextResponse } from "next/server";
import { setAuthCookies } from "@/lib/cookies";

export async function GET(req: Request) {
  try {
  
    const url = new URL(req.url);
    const pathname = url.pathname;


    const pathSegments = pathname.split("/").filter(Boolean);
    const locale = ["fa", "fr", "en"].includes(pathSegments[0])
      ? pathSegments[0]
      : "en"; 

    const cookies = req.headers.get("cookie") || "";
    let refreshToken = cookies
      .split("; ")
      .find((c) => c.startsWith("refreshToken="))
      ?.split("=")[1];

    if (refreshToken) {
      refreshToken = decodeURIComponent(refreshToken);
    }

    if (!refreshToken) {
    
      return NextResponse.redirect(new URL(`/${locale}/auth/Login`, req.url));
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
      return NextResponse.redirect(new URL(`/${locale}/auth/Login`, req.url));
    }


    const data = await result.json();

    const res = NextResponse.redirect(new URL(`/${locale}/dashboard`, req.url));
    setAuthCookies(res, data.accessToken, data.refreshToken);

    return res;
  } catch (err) {

    const url = new URL(req.url);
    const pathname = url.pathname;
    const pathSegments = pathname.split("/").filter(Boolean);
    const locale = ["fa", "fr", "en"].includes(pathSegments[0])
      ? pathSegments[0]
      : "en";

    return NextResponse.redirect(new URL(`/${locale}/auth/Login`, req.url));
  }
}
