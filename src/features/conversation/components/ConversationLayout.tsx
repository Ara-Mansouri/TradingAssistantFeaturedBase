"use client";

import UserMenu from "@/features/dashboard/components/UserMenu";
import LanguageSwitcher from "@/features/common/LanguageSwitcher";
import ModeSwitcher from "@/features/conversation/components/ModeSwitcher";
import { useConversation } from "@/features/conversation/context/useConversation";

export default function ConversationLayout({ children }: { children: React.ReactNode }) {
  const { mode } = useConversation();

  return (
    <div className="relative h-screen max-h-screen overflow-hidden bg-black text-white flex flex-col">

      <header className="relative w-full z-20 flex-shrink-0">

        <div className="flex items-center justify-between px-4 py-3 sm:py-4">

          <div className="flex-shrink-0">
            <UserMenu />
          </div>

          <div className="hidden md:flex absolute left-1/2 -translate-x-1/2">
            <ModeSwitcher />
          </div>

          <div className="flex-shrink-0">
            <LanguageSwitcher />
          </div>
        </div>

        <div className="md:hidden flex justify-center px-4 pb-2">
          <ModeSwitcher />
        </div>
      </header>

      <div className="flex-1 min-h-0 overflow-hidden">
        {children}
      </div>
    </div>
  );
}
