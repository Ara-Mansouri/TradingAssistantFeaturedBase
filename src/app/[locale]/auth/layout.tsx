"use client";

import { useLocale } from "next-intl";
import { AuthProvider } from "@/context/AuthContext";
import LanguageSwitcher from "@/features/auth/components/LanguageSwitcher";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const locale = useLocale();
  const isRTL = locale === "fa";

  return (
    <AuthProvider>
      <main
        className={`relative min-h-screen bg-black text-white flex items-center justify-center p-4 overflow-hidden 
          ${
          isRTL ? "text-right" : "text-left"
        }
        `}
      >
        {/* 🔹 دکمه‌ی انتخاب زبان */}
       <LanguageSwitcher />

        <section
          className="relative w-full max-w-5xl rounded-3xl overflow-hidden bg-black shadow-2xl"
          
        >
           
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px] gap-0">
            {/* 🔸 Image Section */}
            <div className="relative overflow-hidden order-1 lg:order-1 ">
              <img
                src="/images/login-bg.png"
                alt="Trading Assistant"
                className="w-full h-64 lg:h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent lg:bg-gradient-to-r lg:from-black/0 lg:via-black/0 lg:to-black/45" />
            </div>

            {/* 🔸 Form Section */}
            <div className="relative order-2 lg:order-2 flex items-center justify-center p-6 lg:p-12 bg-gradient-to-br from-black via-red-900/18 to-black overflow-hidden">
              <div className="w-full max-w-md" >{children}</div>
            </div>
          </div>

          {/* 🔸 Background Effects */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-red-600/12 via-red-600/8 to-red-600/12 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full -z-10 bg-gradient-radial from-red-600/8 via-red-600/3 to-transparent"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-transparent via-red-500/5 to-transparent"
          />
        </section>
      </main>
    </AuthProvider>
  );
}
