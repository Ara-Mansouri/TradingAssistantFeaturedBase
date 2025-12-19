"use client";

import LanguageSwitcher from "@/features/common/LanguageSwitcher";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";

export default function ConversationLayout(props: {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}) {
  const { children, sidebar } = props;

  return (
    <SidebarProvider defaultOpen>
      {sidebar}

      <SidebarInset>
        <div className="relative h-screen max-h-screen overflow-hidden bg-black text-white flex flex-col">
          <header className="relative w-full z-20 flex-shrink-0 border-b border-white/10">
            <div className="flex items-center justify-between px-4 py-3 sm:py-4">

              <SidebarTrigger className="p-2 rounded-md hover:bg-white/5 border border-white/10" />

              <div className="flex-1" />

              <LanguageSwitcher />
            </div>
          </header>

          <div className="flex-1 min-h-0 overflow-hidden">{children}</div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
