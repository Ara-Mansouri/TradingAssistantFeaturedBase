"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";

interface LocaleOption {
  code: "en" | "fa";
  label: string;
  countryCode: string;
}

const locales: LocaleOption[] = [
  { code: "en", label: "English", countryCode: "gb" },
  { code: "fa", label: "فارسی", countryCode: "ir" },
  //{ code: "fr", label: "Français", countryCode: "fr" },
];

export default function LanguageSwitcher() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

 
  const [currentLocale, setCurrentLocale] = useState<"en" | "fa" >("en");

  useEffect(() => {
    const match = document.cookie.match(/NEXT_LOCALE=([^;]+)/);
    if (match && ["en", "fa"].includes(match[1])) {
      setCurrentLocale(match[1] as "en" | "fa" );
    }
  }, []);


  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  const changeLocale = async (code: "en" | "fa") => {
    await fetch("/api/locale", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locale: code }),
    });

    setCurrentLocale(code);
    setIsOpen(false);
    startTransition(() => router.refresh());
  };

  const activeLocale = locales.find((l) => l.code === currentLocale) ?? locales[0];

  return (
    <div ref={dropdownRef} >
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center justify-between px-3 py-2 w-36 rounded-md 
                      bg-white/10 backdrop-blur-md text-white text-sm font-semibold 
                      border border-white/20 hover:border-[#9b5daa]/50
                      hover:bg-white/15 transition-all duration-200 shadow-lg ${
                        isPending ? "opacity-60 cursor-not-allowed" : ""
                      }`}
          disabled={isPending}
        >
          <span className="flex items-center gap-2">
            <span className={`fi fi-${activeLocale.countryCode} fis mr-1`}></span>
            {activeLocale.label.toUpperCase()}
          </span>
          <span className="ml-2 text-white/70">{isOpen ? "▲" : "▼"}</span>
        </button>

        {isOpen && (
          <div
            className="absolute right-0 mt-2 w-32 bg-white/95 backdrop-blur-xl border border-[#d4a5e5]/50 rounded-lg 
                       shadow-lg overflow-hidden animate-fade-in"
          >
            {locales
              .filter((loc) => loc.code !== activeLocale.code)
              .map((loc) => (
                <button
                  key={loc.code}
                  onClick={() => changeLocale(loc.code)}
                  className="flex items-center gap-2 w-full px-3 py-2 text-left text-sm 
                             text-gray-700 hover:bg-[#f5e8f8] hover:text-[#8b4d9a] 
                             transition-all duration-150"
                >
                  <span className={`fi fi-${loc.countryCode} mr-1`}></span>
                  {loc.label}
                </button>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
