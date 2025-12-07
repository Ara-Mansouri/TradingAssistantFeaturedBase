"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function UserMenu() {
  const router = useRouter();
  const t = useTranslations("Dashboard");

  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.refresh();
    router.replace("/auth/Login");
  };

  return (
    <div  ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-md hover:bg-gray-800 transition"
      >
        
        <div className="space-y-1">
          <span className="block w-6 h-0.5 bg-white"></span>
          <span className="block w-6 h-0.5 bg-white"></span>
          <span className="block w-6 h-0.5 bg-white"></span>
        </div>
      </button>

      
      {open && (
        <div
          className="absolute left-0 mt-2  bg-gray-900 border border-gray-700 
                     rounded-lg shadow-lg p-2 animate-fade-in"
        >
          <button
            onClick={handleLogout}
            className="w-full text-left px-1 py-1  rounded-md text-gray-200
                       hover:bg-red-700/20 hover:text-white transition"
          >
            {t("logout")}
          </button>
        </div>
      )}

    </div>
  );
}
