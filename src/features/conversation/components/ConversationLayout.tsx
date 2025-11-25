"use client";

import UserMenu from "@/features/dashboard/components/UserMenu";
import LanguageSwitcher from "@/features/common/LanguageSwitcher";


export default function ConversationLayout({ children }: { children: React.ReactNode }) 
{

  return (
    <div className="relative h-screen max-h-screen overflow-hidden bg-black text-white flex flex-col">

      <header className="relative w-full z-20 flex-shrink-0">

        <div className="flex items-center justify-between px-4 py-3 sm:py-4">

          <div className="flex-shrink-0">
            <UserMenu />
          </div>

          <div className="flex-shrink-0">
            <LanguageSwitcher />
          </div>
        </div>

      </header>

      <div className="flex-1 min-h-0 overflow-hidden">
        {children}
      </div>
    </div>
  );
}
