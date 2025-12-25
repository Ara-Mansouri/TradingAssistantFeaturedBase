"use client";

import ConversationShell from "@/features/conversation/components/ConversationShell";
import { useChatThread } from "@/features/chat/hooks/useChatThread";

export default function PageBody({ chatId }: { chatId: string | null }) {
  const thread = useChatThread({ chatId });

  return <ConversationShell chat={thread} />;
}
