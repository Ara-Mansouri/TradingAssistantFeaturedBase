"use client";
import { useState } from "react";
// import { useForgotPassword } from "../hooks/useForgotPassword";

export default function VerifyEmailForm() {


  return (
    <div className="w-full flex flex-col items-center justify-center px-4 sm:px-0 min-h-[70vh] animate-fade-in text-center">
      <div className="max-w-md bg-black/50 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
        <h1 className="text-2xl sm:text-3xl lg:text-3xl font-bold mb-4 text-white">
          Verify Your Email
        </h1>
        <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-8">
          We’ve sent a verification link to your email address.
          <br />
          Please check your inbox and click the link to activate your account.
        </p>
      </div>
    </div>
  )
}