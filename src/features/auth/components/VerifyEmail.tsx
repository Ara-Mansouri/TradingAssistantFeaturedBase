"use client";

import { useTranslations } from "next-intl";


export default function VerifyEmailForm() {

 const t = useTranslations("auth.verify");
  return (
    <div className="w-full flex flex-col items-center justify-center px-4 sm:px-0 min-h-[70vh] animate-fade-in text-center">
      <div className="max-w-md bg-black/50 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
        <h1 className="text-2xl sm:text-3xl lg:text-3xl font-bold mb-4 text-white">
          {t("title")}
        </h1>
        <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-8">
       {t("description")}
          <br />
          {t("descriptionbr")}
        </p>
      </div>
    </div>
  )
}