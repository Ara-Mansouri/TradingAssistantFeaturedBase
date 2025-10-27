
import { NextResponse } from "next/server";
import { setAuthCookies } from "@/lib/cookies";

export async function GET(req: Request) {
  try {
    const cookies = req.headers.get("cookie") || "";
    let  refreshToken = cookies
      .split("; ")
      .find((c) => c.startsWith("refreshToken="))
      ?.split("=")[1];

if (refreshToken) {
  refreshToken = decodeURIComponent(refreshToken);
}

    if (!refreshToken) {
     
      return NextResponse.redirect(new URL("/auth/login", req.url));
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
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    const data = await result.json();
    const res = NextResponse.redirect(new URL("/dashboard", req.url));
    setAuthCookies(res, data.accessToken, data.refreshToken);
    return res;
  } catch (err) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }
}
