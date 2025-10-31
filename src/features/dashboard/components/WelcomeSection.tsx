"use client";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "@/features/auth/components/LanguageSwitcher";
export default function WelcomeSection() {
    const t = useTranslations("Dashboard");
  return (
    <section
      className="relative flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/images/welcome-bg.png')" }}
    >
             <LanguageSwitcher />
      {/* <div className="absolute inset-0 bg-black/40" /> */}

    
      <div className="relative z-10 text-center text-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">{t("welcome")}</h1>
      </div>
    </section>
  );
}
