import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
   const code = body.code;

    //  if (!code) {
    //   return NextResponse.json(
    //     { title: "Verification code is required" },
    //     { status: 400 },
    //   );
    // }
     const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/verify-email`,
      {
         method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code : code }),
      },
    );

    if (!res.ok) 
      {
   
 
       const data = await res.json().catch(() => ({}));
     
        return NextResponse.json(
        { title: (data as any)?.title ?? "Unexpected Error" },
        { status: res.status },
      );
       }
     if (res.status === 204) 
      {
      return new NextResponse(null, { status: 204 });
    }
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json(
      { title: "Unexpected Error" },
      { status: 500 },
    );
  }
}