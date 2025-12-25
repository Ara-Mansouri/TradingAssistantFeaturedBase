import { NextRequest } from "next/server";
import { proxyToBackend } from "@/app/api/_shared/proxyToBackend";

export async function GET(req: NextRequest, { params }: { params: Promise<{ chatId: string }>  }) {
  const { chatId } = await params;
  return proxyToBackend({
    req,
    method: "GET",
    backendPath: `/api/v1/chats/${chatId}/conversations`,
  });
}
