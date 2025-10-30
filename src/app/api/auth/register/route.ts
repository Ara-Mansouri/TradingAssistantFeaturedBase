import { NextResponse } from "next/server";



export async function POST(req: Request) 
{
    try 
    {
      const body = await req.json();
      const Results = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/register`,
      {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
     
      });

    const data = await Results.json();
    if (!Results.ok) 
    {
        return NextResponse.json({ title: data?.title ?? "" },{ status: Results.status });
     
    }

    
    } 
   catch (err) 
   {
    return NextResponse.json({ title: "Unexpected error" }, { status: 500 });
   }
}