import { NextResponse } from "next/server";
import { setAuthCookies } from "@/lib/cookies";
// import { apiClient } from "@/api/client";

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  email?: string;
  expireIn?: number;
}

export async function POST(req: Request) 
{
    try {
      const body = await req.json();
      const Results = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/sign-in-password`,
      {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
     
      });

    const data = await Results.json();

    if (!Results.ok) 
    {
      return NextResponse.json({ title: data?.title ?? "Login failed" },{ status: Results.status });
      console.log("torokhodaa",Results.status);
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