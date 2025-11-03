"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";

interface LocaleOption {
  code: "en" | "fa" | "fr";
  label: string;
  countryCode: string;
}

const locales: LocaleOption[] = [
  { code: "en", label: "English", countryCode: "gb" },
  { code: "fa", label: "فارسی", countryCode: "ir" },
  { code: "fr", label: "Français", countryCode: "fr" },
];

export default function LanguageSwitcher() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

 
  const [currentLocale, setCurrentLocale] = useState<"en" | "fa" | "fr">("en");

  useEffect(() => {
    const match = document.cookie.match(/NEXT_LOCALE=([^;]+)/);
    if (match && ["en", "fa", "fr"].includes(match[1])) {
      setCurrentLocale(match[1] as "en" | "fa" | "fr");
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


  const changeLocale = async (code: "en" | "fa" | "fr") => {
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
    <div ref={dropdownRef} className="absolute top-4 right-4 z-50">
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center justify-between px-3 py-2 w-36 rounded-md 
                      bg-gray-900/80 text-gray-100 text-sm font-semibold 
                      border border-gray-700 hover:border-red-600
                      hover:bg-gray-800 transition-all duration-200 shadow-md ${
                        isPending ? "opacity-60 cursor-not-allowed" : ""
                      }`}
          disabled={isPending}
        >
          <span className="flex items-center gap-2">
            <span className={`fi fi-${activeLocale.countryCode} fis mr-1`}></span>
            {activeLocale.label.toUpperCase()}
          </span>
          <span className="ml-2 text-gray-400">{isOpen ? "▲" : "▼"}</span>
        </button>

        {isOpen && (
          <div
            className="absolute right-0 mt-2 w-32 bg-gray-950 border border-gray-700 rounded-lg 
                       shadow-lg overflow-hidden backdrop-blur-md animate-fade-in"
          >
            {locales
              .filter((loc) => loc.code !== activeLocale.code)
              .map((loc) => (
                <button
                  key={loc.code}
                  onClick={() => changeLocale(loc.code)}
                  className="flex items-center gap-2 w-full px-3 py-2 text-left text-sm 
                             text-gray-300 hover:bg-red-700/20 hover:text-white 
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
