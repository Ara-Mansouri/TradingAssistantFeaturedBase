import { NextRequest, NextResponse } from "next/server";
import { setAuthCookies } from "@/lib/cookies";

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  email?: string;
  expireIn?: number;
}

export async function POST(req: NextRequest) 
{
   const localeCookie=  req.headers.get("accept-language")
     const locale = localeCookie ? localeCookie : "en";
    try {
      const body = await req.json();
      const Results = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/sign-in-password`,
      {
      method: "POST",
      headers: { 
        "Content-Type": "application/json" , 
        "Accept-Language": locale,
               },
      body: JSON.stringify(body),
     
      });

    const data = await Results.json();

    if (!Results.ok) 
    {
      return NextResponse.json({ title: data?.title ?? "Login failed" },{ status: Results.status });
     
    }

    const { accessToken, refreshToken } = data as LoginResponse;
    const res = NextResponse.json({ message: "ok" }, { status: 200 });
    setAuthCookies(res, accessToken, refreshToken);
    return res;
      } 
   catch (err) 
   {
    return NextResponse.json({ title: "Unexpected error" }, { status: 500 });
   }
}