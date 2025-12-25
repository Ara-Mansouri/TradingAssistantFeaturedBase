import { handleApiError } from "@/utils/handleApiError";
import type {
  GetMyChatsResponseDto,
  CreateChatResponseDto,
  GetConversationsResponseDto,
} from "@/features/chat/types/chatApi";

async function requestJson<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, init);
  console.log(input)
  if (res.status === 204) return null as T;

  const data = await res.json().catch(() => ({}));

  if (!res.ok) 
  {
    const message = handleApiError(data); 
    throw new Error(message);
  }

  return data as T;
}

export const chatService = {
  getMyChats() 
  {
    return requestJson<GetMyChatsResponseDto>("/api/chat/chats", { method: "GET" });
  },

  createChat(title: string) 
  {
    return requestJson<CreateChatResponseDto>("/api/chat/chats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
  },

  sendMessage(chatId: string, text: string) 
  {
    return requestJson<void>(`/api/chat/chats/${chatId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
  },

  getConversations(chatId: string) {
    return requestJson<GetConversationsResponseDto>(`/api/chat/chats/${chatId}/conversations`, {
      method: "GET",
    });
  },

  renameChat(chatId: string, title: string) 
  {

    return requestJson<void>(`/api/chat/chats/${chatId}/rename`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
  },
};
