import { NextResponse } from "next/server";

export async function PUT(req: Request)
 {

  try 
  {
    
     const localeCookie=  req.headers.get("accept-language")
     const locale = localeCookie ? localeCookie : "en";
      const body = await req.json();
      const Results = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/reset-password`,
        { method : "PUT" ,
           headers:{"Content-Type": "application/json" ,  "Accept-Language": locale},
           body :JSON.stringify(body),


        });
        if(Results.status == 204)
        {
          return new NextResponse(null , {status : 204});
        }
        if (!Results.ok)
        {
          const data = await Results.json().catch(()=>({}));
          return  NextResponse.json(data?.title||"" , {status : Results.status})
        }
        return new NextResponse(null , {status : 500});


  }
  catch(error)
  {

    return  NextResponse.json(
      {title :""},
      {status : 500}


    )

  }


}