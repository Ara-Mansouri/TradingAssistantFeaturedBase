"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { forgotPasswordApi } from "../services/auth.api";

export function useForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

     const result =  await forgotPasswordApi(email);
if (result.status === 204) {
  sessionStorage.setItem("resetEmail", email);
  router.push("/auth/reset-password");
}

    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return { email, setEmail, handleSubmit, loading, error };
}
