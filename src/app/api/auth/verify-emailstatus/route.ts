import { NextResponse } from "next/server";


export async function  POST (req: Request)
{
  try 
  {
    console.log("🔍 [API] verify-emailstatus called");
    const body = await req.json();
    const {Code} = body;
    const res = await fetch (`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/verify-email`,{
        method:"POST",
        headers:{"Content-Type": "application/json"},
        body :JSON.stringify({code :Code}),

    });

    if(!res.ok)
    {
      let data = {};
      try 
      {
        data=await res.json();
      }
      catch
      {
        //No Body
      }
      return NextResponse.json(
      {title : (data as any).title || "Verify Email Failed"},
      {status : res.status}

      );
    }
     if(res.status == 204)
        {
          return new NextResponse(null , {status : 204});
        }
  }
  catch (error)
  {
     return NextResponse.json({title : "Unexpected Error"} , {status:500});
  }
 


}