"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";   // ✅ حتماً ایمپورت کن
import { loginApi } from "../services/auth.api";

export function useLogin() {
  const router = useRouter();   // ✅ اینو اضافه کن
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await loginApi({ email, password });
      console.log("✅ Login success:", result);

      // ✅ بعد از لاگین موفق برو به صفحه welcome
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
