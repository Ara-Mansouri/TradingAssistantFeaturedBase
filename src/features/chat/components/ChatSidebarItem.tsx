"use client";

import { memo } from "react";
import type { ChatSummaryDto } from "@/features/chat/types/chatApi";
import { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export const ChatSidebarItem = memo(function ChatSidebarItem(props: {
  chat: ChatSummaryDto;
  isActive: boolean;



  onSelect: (chatId: string) => Promise<void>;
  onRenameRequest: (chatId: string, currentTitle: string) => void;


  closeMobile: () => void;
}) {
  const { chat, isActive, onSelect, onRenameRequest, closeMobile } = props;
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <SidebarMenuItem >
      <SidebarMenuButton
        isActive={isActive}
        className="w-full justify-start gap-2 rounded-full px-4 py-5
                    hover:bg-white/5 hover:text-white
                    data-[active=true]:bg-white/10 data-[active=true]:text-white
                    transition-colors"
        onClick={async () => {
          await onSelect(chat.id);
          closeMobile();
        }}
      >
         <span>{chat.title}</span>
      </SidebarMenuButton>


      <DropdownMenu modal={true} open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger asChild>
          <SidebarMenuAction
            showOnHover={!isActive}
             className="mr-0.5 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            aria-label="More actions">
            ⋯
          </SidebarMenuAction>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" side="bottom">
          <DropdownMenuItem
            className="cursor-pointer"
            onSelect={(e) => {
              setMenuOpen(false); 
              e.preventDefault();
               setMenuOpen(false); 
              onRenameRequest(chat.id, chat.title);
            }}
          >
           <span>Rename</span> 
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
});
