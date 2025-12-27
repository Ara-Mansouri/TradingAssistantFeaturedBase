"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function NoBackForwardCache() 
{
  const pathname = usePathname();
  const router = useRouter();
  const checkingRef = useRef(false);

  useEffect(() => {
    const handlePageShow = async (event: PageTransitionEvent) => 
    {
      const navigationEntry = performance.getEntriesByType("navigation")[0] as
        | PerformanceNavigationTiming
        | undefined;
      const isBackForward = event.persisted || navigationEntry?.type === "back_forward";

      if (isBackForward && !checkingRef.current) 
      {
        checkingRef.current = true;
        try {
          const response = await fetch("/api/auth/check-auth", {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          });
          
          if (!response.ok)
          {
            window.location.reload();
            return;
          }

          const { authenticated } = await response.json();
          const currentPath = window.location.pathname;
          const isAuthRoute = currentPath.startsWith("/auth");
          const isProtectedRoute = currentPath.startsWith("/c") || currentPath === "/";

          if (authenticated && isAuthRoute) 
          {
            router.replace("/c");
          } 
          else if (!authenticated && isProtectedRoute) 
          {
            
            router.replace("/auth/login");
          }
         
        }
         catch (error)
        {
          console.error("Auth check failed on bfcache restore:", error);
          window.location.reload();
        } 
        finally 
        {
          checkingRef.current = false;
        }
      }
    };

    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, [pathname, router]);

  return null;
}