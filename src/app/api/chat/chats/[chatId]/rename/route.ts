import { NextRequest } from "next/server";
import { proxyToBackend } from "@/app/api/_shared/proxyToBackend";

export async function PUT(req: NextRequest, { params }: {  params: Promise<{ chatId: string }> }) 
{
  const { chatId } = await params;
  const body = await req.json().catch(() => ({}));
  console.log("nemiyad")
  return proxyToBackend({
    req,
    method: "PUT",
    backendPath: `/api/v1/chats/${chatId}/rename`,
    body
  });
}
