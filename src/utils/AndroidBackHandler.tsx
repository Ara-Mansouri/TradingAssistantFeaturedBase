"use client";

import { App } from "@capacitor/app";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AndroidBackHandler() {
  const router = useRouter();

  useEffect(() => {
    let handler: any;

    const setup = async () => 
    {
      handler = await App.addListener("backButton", ({ canGoBack }) => 
        {

        if (!canGoBack) 
        {
          App.exitApp();
          return;
        }

        
        router.back();
       });
    };

    setup();

    return () => {
      if (handler) handler.remove();
    };
  }, [router]);

  return null;
}
