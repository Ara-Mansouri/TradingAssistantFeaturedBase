"use client";

import { useEffect } from "react";

export default function NoBackForwardCache() 
{
  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => 
    {
      const navigationEntry = performance.getEntriesByType("navigation")[0] as
        | PerformanceNavigationTiming
        | undefined;
      const isBackForward = event.persisted || navigationEntry?.type === "back_forward";

      if (isBackForward) 
      {
        window.location.reload();
      }
    };

    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  return null;
}