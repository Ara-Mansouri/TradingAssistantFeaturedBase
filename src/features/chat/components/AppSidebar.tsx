"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ChatSummaryDto } from "@/features/chat/types/chatApi";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  useSidebar,
} from "@/utils/ui/sidebar";

import { Button } from "@/utils/ui/button";
import { ChatSidebarItem } from "@/features/chat/components/ChatSidebarItem";

export default function AppSidebar(props: {
  chats: ChatSummaryDto[];
  selectedChatId: string | null;
  isLoading: boolean;
  onSelect: (chatId: string) => Promise<void>;
  onNewChat: () => Promise<void>;
  onRename: (chatId: string, title: string) => Promise<void>;
}) {
  const { chats, selectedChatId, isLoading, onSelect, onNewChat, onRename } = props;

  const router = useRouter();
  const { setOpenMobile } = useSidebar();
  const closeMobile = () => setOpenMobile(false);
  const handleNewChat = () => 
     {router.push("/c")
    closeMobile();
  };

  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [isRenaming, setIsRenaming] = useState(false);

  const openRename = (chatId: string, currentTitle: string) => {
    setRenamingId(chatId);
    setDraft(currentTitle);
  };

  const cancelRename = () => {
    setRenamingId(null);
    setDraft("");
  };

  const submitRename = async () => {
    if (!renamingId) return;
    const t = draft.trim();
    if (!t) return;
    setIsRenaming(true);
    await onRename(renamingId, t);
    setIsRenaming(false);
    cancelRename();
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/auth/Login");
  };

  return (
    <Sidebar className=" text-white border-r border-white/10">
      <SidebarHeader className="gap-2">
        <div className="flex items-center justify-between px-2">
          <div className="px-2 font-semibold">Chats</div>
          <Button
            variant="ghost"
            className="h-9 px-2 hover:bg-white/5"
            // onClick={async () => {
            //   await onNewChat();
            //   closeMobile();
            // }}
            onClick={handleNewChat
              
            }
            type="button"
          >
            + New
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        {isLoading && (
          <div className="text-sm text-muted-foreground px-2 py-2">Loading…</div>
        )}

        <SidebarMenu>
        {[...chats]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .map((c) => (
        <ChatSidebarItem
        key={c.id}
        chat={c}
        isActive={c.id === selectedChatId}
        onSelect={onSelect}
        onRenameRequest={openRename}
        closeMobile={closeMobile}
      />
       ))}
        </SidebarMenu>

        {renamingId && (
          <div className="fixed inset-0 z-[60]">
            <div className="absolute inset-0 bg-black/60" onClick={cancelRename} />
            <div className="absolute left-1/2 top-1/2 w-[92%] max-w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-black border border-white/10 p-4">
              <div className="text-white font-semibold mb-3">Rename chat</div>
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none"
                autoFocus
              />
              <div className="mt-4 flex justify-end gap-2">
                <Button variant="ghost" className="hover:bg-white/5" onClick={cancelRename}>
                  Cancel
                </Button>
                <Button 
                className="bg-white/10 hover:bg-white/15" 
                onClick={submitRename}
                disabled={isRenaming}>
                {isRenaming ? "Renaming.." : "Save" }
                </Button>
              </div>
            </div>
          </div>
        )}
      </SidebarContent>

      <SidebarFooter className="p-2">
        <Button
          variant="ghost"
          className="w-full justify-start rounded-xl bg-red-700/10 border border-red-500/20 hover:bg-red-700/20 text-red-200"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
