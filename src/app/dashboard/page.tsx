"use client";

import { useEffect } from "react";
import WelcomeSection from "@/features/dashboard/components/WelcomeSection";

export default function WelcomePage() {
  useEffect(() => {
    
    window.history.pushState(null, "", window.location.href);

    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  return <WelcomeSection />;
}
