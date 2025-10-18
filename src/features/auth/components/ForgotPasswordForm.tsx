"use client";
import { useState } from "react";
import { useForgotPassword } from "../hooks/useForgotPassword";

export default function ForgotPasswordForm() {
  const { email, setEmail, handleSubmit, loading, error } = useForgotPassword();

  return (
    <div className="bg-[#0f1115] p-6 rounded-xl w-full max-w-md">
      <h1 className="text-2xl mb-4 text-white">Forgot Password</h1>

      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 mb-3 rounded bg-black text-white"
      />

      {error && <p className="text-red-400 text-sm mb-2">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-red-600 hover:bg-red-700 py-2 rounded text-white"
      >
        {loading ? "Sending..." : "Send Reset Link"}
      </button>
    </div>
  );
}
