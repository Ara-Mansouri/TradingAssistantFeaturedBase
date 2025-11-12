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
    <div className="w-full h-full flex flex-col items-center justify-center z-40 px-4" dir={locale === "fa" ? "rtl" : "ltr"}>

      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl text-white font-bold mb-2 tracking-tight">
<div
  aria-hidden
  className="
    pointer-events-none absolute -z-10
    left-1/2 -translate-x-1/2
    top-[45%]
    w-full             
    max-w-[45rem]      
    h-[5rem]          


    rounded-full
    bg-gradient-to-r from-red-800/25 via-red-600/15 to-transparent
    blur-[50px] opacity-100
    rotate-[-24deg]

    md:top-[22%]
    md:max-w-[55rem]  
    md:h-[15rem]
    md:opacity-60
    md:rotate-[-26deg]
  "
/>

       
        {text}
          <span className="inline-block w-0.5 h-6 sm:h-8 bg-white ml-1.5 animate-pulse" />
        </h1>
      </div>
      <div className="w-full max-w-3xl mx-auto">
        <div
          className="
            w-full flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-2xl sm:rounded-3xl
            bg-white/5 backdrop-blur-md border border-white/10
            shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_32px_rgba(185,28,28,0.2)]
            transition-all duration-300 hover:border-red-500/30
          "
        >
          <input
            type="text"
            placeholder="..."
            className="flex-1 bg-transparent outline-none text-white placeholder-gray-400 
                     px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base
                     focus:placeholder-gray-500"
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
className="
  w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center 
  rounded-full sm:rounded-full bg-[#771313]
  
  hover:from-[#7c0909] hover:via-[#4a0303]
  border border-[#5c0505]/40
  hover:shadow-red-900/40
  transition-all duration-300
  transform hover:scale-105 active:scale-95
  group
"
            aria-label="Voice input"
          >
            <svg
              width="21"
              height="21"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white group-hover:text-red-100 transition-colors"
            >
              <rect x="6" y="8" width="2" height="8" rx="1" />
              <rect x="11" y="6" width="2" height="12" rx="1" />
              <rect x="16" y="8" width="2" height="8" rx="1" />
            </svg>
          </button>

        </div>
      </div>
    </div>
  );
}
