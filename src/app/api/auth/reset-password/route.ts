import { NextResponse } from "next/server";

export async function PUT(req: Request)
 {

  try 
  {
    const body = await req.json();
      const Results = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/reset-password`,
        { method : "PUT" ,
           headers:{"Content-Type": "application/json"},
           body :JSON.stringify(body),


        });
        if(Results.status == 204)
        {
          return new NextResponse(null , {status : 204});
        }
        if (!Results.ok)
        {
          const data = await Results.json().catch(()=>({}));
          return  NextResponse.json(data?.title||"Reset PassWord Failed" , {status : Results.status})// chera hamishe bayad status bargarde?
        }
        return new NextResponse(null , {status : 500});


  }
  catch(error)
  {
    console.error("Reset Password Error:" , error);
    return  NextResponse.json(
      {title :"Unexpected Error"},
      {status : 500}


    )

  }


}