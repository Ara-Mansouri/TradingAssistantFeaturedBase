import { NextRequest } from "next/server";
import { proxyToBackend } from "@/app/api/_shared/proxyToBackend";

export async function GET(req: NextRequest, { params }: { params: { chatId: string } }) {
  return proxyToBackend({
    req,
    method: "GET",
    backendPath: `/api/v1/chats/${params.chatId}/conversations`,
  });
}
