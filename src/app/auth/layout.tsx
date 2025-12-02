"use client";

import { useLocale } from "next-intl";
import { AuthProvider } from "@/features/auth/context/AuthContext";
import LanguageSwitcher from "@/features/common/LanguageSwitcher";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const locale = useLocale();
  const isRTL = locale === "fa";

  return (
    <AuthProvider>
      <main
        className={`
          relative min-h-screen flex items-center justify-center p-6 overflow-hidden
          bg-gradient-to-br from-[#2d1b3d] via-[#3b2350] to-[#1f142d]
          text-white ${isRTL ? "text-right" : "text-left"}
        `}
      >
        {/* Language Switcher */}
        <div className="absolute top-4 right-4 z-50">
          <LanguageSwitcher />
        </div>

        {/* Cloudy Dreamy Background */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{
            backgroundImage: `url('/images/cloudy-bg.png')`,
            filter: "blur(12px)",
          }}
        />

        {/* Centered Glass Form */}
        <div
          className="
            relative z-10 w-full max-w-md p-8 rounded-3xl backdrop-blur-2xl
            bg-white/10 border border-white/20 shadow-2xl
          "
          dir={isRTL ? "rtl" : "ltr"}
        >
          {children}
        </div>

        {/* Glows */}
        <div className="pointer-events-none absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-purple-700/30 rounded-full blur-[120px]" />
        <div className="pointer-events-none absolute -top-20 right-0 w-[400px] h-[400px] bg-pink-600/20 rounded-full blur-[120px]" />
        <div className="pointer-events-none absolute bottom-0 right-1/4 w-[350px] h-[350px] bg-purple-500/25 rounded-full blur-[100px]" />
      </main>
    </AuthProvider>
  );
}
