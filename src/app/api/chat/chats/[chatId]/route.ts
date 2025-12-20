import { NextRequest } from "next/server";
import { proxyToBackend } from "@/app/api/_shared/proxyToBackend";

export async function POST(req: NextRequest, { params }: { params: Promise<{ chatId: string }> }) {
  const { chatId } = await params;
  const body = await req.json().catch(() => ({}));
  return proxyToBackend({
    req,
    method: "POST",
    backendPath: `/api/v1/chats/${chatId}`,
    body,
  });
}
