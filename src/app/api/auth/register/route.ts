import { NextResponse } from "next/server";



export async function POST(req: Request) 
{
    try 
    {
     const localeCookie=  req.headers.get("accept-language")
     const locale = localeCookie ? localeCookie : "en";
      const body = await req.json();
      const Results = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/register`,
      {
      method: "POST",
      headers: { "Content-Type": "application/json" ,"Accept-Language": locale },
      body: JSON.stringify(body),
     
      });

      if(Results.status == 201)
        {
          return new NextResponse(null , {status : 201});
        }

    if (!Results.ok) 
    {
      const data = await Results.json().catch(()=>({}));
        return NextResponse.json({ title: data?.title ?? "" },{ status: Results.status });
     
    }

    } 
   catch (err) 
   {
    return NextResponse.json({ title: "" }, { status: 500 });
   }
}