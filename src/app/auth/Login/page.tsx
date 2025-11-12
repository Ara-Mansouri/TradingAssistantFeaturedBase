"use client";

import LoginForm from "@/features/auth/components/LoginForm";
import { useEffect } from "react";

export default function LoginPage() {

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
  return <LoginForm />;
}
