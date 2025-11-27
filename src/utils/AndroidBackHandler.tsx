"use client";

import { App } from "@capacitor/app";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function AndroidBackHandler() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let handler: any;

    const setup = async () => {
      handler = await App.addListener("backButton", ({ canGoBack }) => {

        if (pathname === "/auth/Login") {
          App.exitApp();
          return;
        }

        if (pathname === "/dashboard") {
          return;
        }

        if (canGoBack) {
          router.back();
          return;
        }

        App.exitApp();
      });
    };

    setup();

    return () => {
      handler?.remove();
    };
  }, [pathname, router]);

  return null;
}
