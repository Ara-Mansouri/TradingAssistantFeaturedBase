import { NextResponse } from "next/server";


export async function  POST (req: Request)
{
  try 
  {
    const body = await req.json();
    const {email} = body;
    const res = await fetch (`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/forgot-password`,{
        method:"POST",
        headers:{"Content-Type": "application/json"},
        body :JSON.stringify({email}),

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
      {title : (data as any).title || "Forget Password Failed"},
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