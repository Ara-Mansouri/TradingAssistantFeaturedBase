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
      setError(null);

      const result = await loginApi({ email, password });

      console.log("Login success:", result);

      if (result.status === 200) {
        router.push("/welcome");
      }

    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
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
