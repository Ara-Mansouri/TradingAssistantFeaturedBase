"use client";

import { useTranslations } from "next-intl";
import LanguageSwitcher from "@/features/auth/components/LanguageSwitcher";
import { useRouter } from "next/navigation";

export default function WelcomeSection() {
  const t = useTranslations("Dashboard");
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" }); 
      router.replace("/auth/Login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <section
      className="relative flex flex-col items-center justify-center min-h-screen bg-cover bg-center text-white"
      style={{ backgroundImage: "url('/images/welcome-bg.png')" }}
    >
      <LanguageSwitcher />

      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      <div className="relative z-10 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">{t("welcome")}</h1>

        <button
          onClick={handleLogout}
          className="px-6 py-3 bg-gradient-to-r from-red-700 to-red-900 rounded-xl font-semibold
                     hover:from-red-800 hover:to-red-950 transition-all duration-300
                     shadow-lg hover:shadow-xl"
        >
          {t("logout")}
        </button>
          </div>
    </section>
  );
}
