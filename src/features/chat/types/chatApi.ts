export type ChatSide = "User" | "assistant";

export interface ChatSummaryDto {
  id: string;
  title: string;
  createdAt: string;
}

export interface GetMyChatsResponseDto {
  chats: ChatSummaryDto[];
}

export interface CreateChatResponseDto {
  chatId: string;
  title: string;
}

export interface ConversationDto {
  text: string;
  registeredAt: string;
  side: ChatSide;
}

export interface GetConversationsResponseDto {
  conversations: ConversationDto[];
}
