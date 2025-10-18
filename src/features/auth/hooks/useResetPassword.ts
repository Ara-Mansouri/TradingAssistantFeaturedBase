"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { resetPasswordApi } from "../services/auth.api";

export function useResetPassword() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedEmail = sessionStorage.getItem("resetEmail");
    if (!savedEmail) {
      router.push("/auth/forgot-password");
    } else {
      setEmail(savedEmail);
    }
  }, [router]);


  const handleSubmit = async () => {
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      setError(null);

     const result= await resetPasswordApi({
        email,
        verificationCode,
        newPassword,
      });
 if (result.status === 204) {
       sessionStorage.removeItem("resetEmail");
       console.log(result.status)
       console.log(result.data)
        router.push("/auth/Login");
        }
        else
        {
           console.log(result.status)
           console.log(result.data)

        }
    
     
    } catch (err: any) {
      setError(err.response?.data?.message || "Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    verificationCode,
    setVerificationCode,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    handleSubmit,
    loading,
    error,
  };
}
