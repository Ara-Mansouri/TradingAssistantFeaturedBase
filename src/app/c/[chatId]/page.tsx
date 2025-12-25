"use client";
import ConversationShell from "@/features/conversation/components/ConversationShell";
import { useParams } from "next/navigation";
import { useChatThread } from "@/features/chat/hooks/useChatThread";

export default function ChatIdPage() {
  const { chatId } = useParams<{ chatId: string }>();
  const thread = useChatThread({ chatId });
  return <ConversationShell chat={thread} />;
}
