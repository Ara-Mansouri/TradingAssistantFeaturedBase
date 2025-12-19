import { NextRequest } from "next/server";
import { proxyToBackend } from "@/app/api/_shared/proxyToBackend";

export async function GET(req: NextRequest) {
  return proxyToBackend({ req, method: "GET", backendPath: "/api/v1/chats/me" });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  return proxyToBackend({ req, method: "POST", backendPath: "/api/v1/chats", body });
}
