import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const code = body.code;
    const localeCookie=  req.headers.get("accept-language")
     const locale = localeCookie ? localeCookie : "en";
     const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/verify-email`,
      {
         method: "POST",
        headers: { "Content-Type": "application/json" , "Accept-Language": locale },
        body: JSON.stringify({ code : code }),
      },
    );

    if (!res.ok) 
      {
   
 
       const data = await res.json().catch(() => ({}));
     
        return NextResponse.json(
        { title: (data as any)?.title ?? "" },
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
      { title: "" },
      { status: 500 },
    );
  }
}