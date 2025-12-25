import { NextRequest, NextResponse } from "next/server";


type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

function getLocale(req: NextRequest) 
{
  return req.headers.get("accept-language") ?? "en";
}

function getAccessToken(req: NextRequest) 
{

  return req.cookies.get("accessToken")?.value;
}

export async function proxyToBackend(args: {
  req: NextRequest;
  method: HttpMethod;
  backendPath: string;
  body?: any;
  auth?: boolean;
}) {
  const { req, method, backendPath, body, auth = true } = args;
  console.log(backendPath);
  const headers: Record<string, string> = {
    Accept: "application/json",
    "Accept-Language": getLocale(req),
  };

  if (body !== undefined) 
  {
    headers["Content-Type"] = "application/json";
  }

  if (auth) 
  {
    const token = getAccessToken(req);
    if (!token) 
    {
      return NextResponse.json({ title: "" }, { status: 401 });
    }
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${backendPath}`,
  {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });


  if (res.status === 204) {
    return new NextResponse(null, { status: 204 });
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    return NextResponse.json({ title: (data as any)?.title ?? "" }, { status: res.status });
  }

  return NextResponse.json(data, { status: res.status });
}
