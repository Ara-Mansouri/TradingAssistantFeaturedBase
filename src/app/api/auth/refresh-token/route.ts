
import { NextResponse } from "next/server";
import { setAuthCookies } from "@/lib/cookies";

export async function GET(req: Request) {
  try {
   
    const cookieHeader = req.headers.get("cookie") || "";
    const cookies = Object.fromEntries(
      cookieHeader
        .split("; ")
        .map((c) => c.split("="))
        .filter(([k, v]) => k && v)
    );

    const locale = cookies["NEXT_LOCALE"] ?? "en";
    let refreshToken = cookies["refreshToken"];

    if (!refreshToken) {

      return NextResponse.redirect(new URL(`/auth/Login`, req.url));
    }

    refreshToken = decodeURIComponent(refreshToken);


    const apiResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/refresh-token`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: refreshToken }),
      }
    );


    if (!apiResponse.ok) {

      return NextResponse.redirect(new URL(`/auth/Login`, req.url));
    }


    const data = await apiResponse.json();

    const res = NextResponse.redirect(new URL(`/dashboard`, req.url));
    setAuthCookies(res, data.accessToken, data.refreshToken);


    return res;
  } catch (error) {

    return NextResponse.redirect(new URL(`/auth/Login`, req.url));
  }
}
