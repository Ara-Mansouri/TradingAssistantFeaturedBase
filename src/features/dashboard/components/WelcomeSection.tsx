"use client";

import { useTranslations } from "next-intl";
import LanguageSwitcher from "@/features/common/LanguageSwitcher";
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

        <button
          onClick={handleLogout}
          className="px-6 py-3 bg-gradient-to-r from-red-700 to-red-900 rounded-xl font-semibold
                     hover:from-red-800 hover:to-red-950 transition-all duration-300
                     shadow-lg hover:shadow-xl"
        >
          {t("logout")}
        </button>

  );
}
