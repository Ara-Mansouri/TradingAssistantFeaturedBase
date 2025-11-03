"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import type { AppLocale } from "@/i18n/config";
import { localeCookieMaxAge, localeCookieName } from "@/i18n/config";

export default function LanguageSwitcher() {
  const router = useRouter();
  const currentLocale = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languageOptions: Array<{ code: AppLocale; label: string; countryCode: string }> = [
    { code: "en", label: "English", countryCode: "gb" },
    { code: "fa", label: "فارسی", countryCode: "ir" },
    { code: "fr", label: "Français", countryCode: "fr" },
  ];

  // 🔹 بستن منو با کلیک بیرون
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🔹 تغییر زبان با تغییر مسیر
  const handleChangeLocale = (newLocale: AppLocale) => {
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${localeCookieName}=${newLocale}; path=/; max-age=${localeCookieMaxAge}; SameSite=Lax${secure}`;
    router.refresh();
    setIsOpen(false);
  };


  const activeLocale =
    languageOptions.find((option) => option.code === currentLocale) ?? languageOptions[0];

  return (
    <div ref={dropdownRef} className="absolute top-4 right-4 z-50">

      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between px-3 py-2 w-33 rounded-md 
                     bg-gray-900/80 text-gray-100 text-sm font-semibold 
                     border border-gray-700 hover:border-red-600
                     hover:bg-gray-800 transition-all duration-200 shadow-md"
        >
          <span className="flex items-center gap-2">
            <span className={`fi fi-${activeLocale.countryCode} fis mr-1`}></span>
            {activeLocale.label.toUpperCase()}
          </span>
          <span className="ml-2 text-gray-400">{isOpen ? "▲" : "▼"}</span>
        </button>


        {isOpen && (
          <div
            className="absolute right-0 mt-2 w-28 bg-gray-950 border border-gray-700 rounded-lg 
                       shadow-lg overflow-hidden backdrop-blur-md animate-fade-in"
          >
            {languageOptions
              .filter((option) => option.code !== activeLocale.code)
              .map((option) => (
                <button
                  key={option.code}
                  onClick={() => handleChangeLocale(option.code)}
                  className="flex items-center gap-2 w-full px-3 py-2 text-left text-sm
                             text-gray-300 hover:bg-red-700/20 hover:text-white
                             transition-all duration-150"
                >
                  <span className={`fi fi-${option.countryCode}  mr-1`}></span>
                  {option.label}
                </button>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}