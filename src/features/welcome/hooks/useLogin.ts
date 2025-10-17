"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginApi } from "../services/auth.api";

export function useLogin() {
  const router = useRouter();  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
   try {
  setLoading(true);
  const result = await loginApi({ email, password });
  console.log("Login result:", result);

  if (result.status >= 200 && result.status < 300) {
    console.log("Redirecting to welcome...");
    router.push("/welcome");
  } else {
    console.error("Unexpected status:", result.status);
  }

} catch (err) {
  console.error("Login error:", err);
}
  };

  return {
    email,
    password,
    setEmail,
    setPassword,
    handleLogin,
    loading,
    error,
  };
}
