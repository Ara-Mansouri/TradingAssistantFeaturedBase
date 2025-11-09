"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";

export default function ChatInputBar() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("Dashboard");
  const goToWave = () => {
    router.push("/dashboard/voice");
  };

  const [text, setText] = useState("");
  const fullText = t("welcome");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) clearInterval(interval);
    }, 60);

    return () => clearInterval(interval);
  }, [fullText]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-black/80 backdrop-blur-md z-40" dir={locale === "fa" ? "rtl" : "ltr"}>

<div
  aria-hidden
  className="
    pointer-events-none absolute -z-10
    top-1/3 left-1/2 -translate-x-1/2
    w-[200%] h-52
    bg-gradient-to-r from-red-800/25 via-red-600/15 to-transparent
    blur-3xl opacity-70
    rotate-[-25deg]

    sm:w-[250%] sm:h-64
    md:w-[300%] md:h-72 md:rotate-[-30deg] md:top-1/4
  "
/>

      <h1 className="text-center text-2xl text-white font-medium mb-10 tracking-wider">
        {text}
      </h1>

      <div
        className="
          w-full px-4 py-6
          fixed bottom-0 left-0
          md:static md:px-0
        "
      >
        <div
          className="
            max-w-3xl mx-auto flex items-center gap-3 p-2 rounded-4xl
            bg-[#1E1E1E] border border-[#3f3d3d]
            shadow-[0_0_30px_rgba(255,255,255,0.08)]
          "
        >
          <input
            type="text"
            placeholder="…"
            className="flex-1 bg-transparent outline-none text-gray-300 placeholder-gray-500 ps-4"
          />
          <button  
           className="w-10 h-10 flex items-center justify-center rounded-full transition-all hover:bg-gray-800 hover:shadow-lg"
          >
          <svg width="22" 
              height="22" 
              viewBox="0 0 24 24" 
              className="text-white opacity-80">
          <path fill="white"
          d="M12 14a3 3 0 0 0 3-3V7a3 3 0 0 0-6 0v4a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 14 0h-2zm-5 7c-1.1 0-2 .9-2 2h4a2 2 0 0 0-2-2z"/>
         </svg>
         </button>
          <button
            onClick={goToWave}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 transition-all shadow-lg"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white"
            >
              <rect x="6" y="8" width="2" height="8" rx="1" fill="white" fillOpacity="0.95" />
              <rect x="11" y="6" width="2" height="12" rx="1" fill="white" fillOpacity="0.95" />
              <rect x="16" y="8" width="2" height="8" rx="1" fill="white" fillOpacity="0.95" />
            </svg>
          </button>

        </div>
      </div>
    </div>
  );
}
