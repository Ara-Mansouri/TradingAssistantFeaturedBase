"use client";
import { useState } from "react";
import { useForgotPassword } from "../hooks/useForgotPassword";

export default function ForgotPasswordForm() {
  const { email, setEmail, handleSubmit, loading, error } = useForgotPassword();

  return (
    <div className="w-full px-4 sm:px-0 animate-fade-in">
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 text-white">
          Forgot Password
        </h1>
        <p className="text-gray-400 text-sm lg:text-base">
          Enter your email to receive a reset link
        </p>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-4 sm:space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-200">
            Email Address
          </label>
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-black
                     placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 
                     focus:border-red-500/50 transition-all duration-300
                     hover:bg-gray-50 hover:border-gray-400"
            required
          />
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-500/15 border border-red-500/30 animate-fade-in">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 rounded-xl font-semibold text-white
                   bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900
                   focus:outline-none focus:ring-2 focus:ring-red-500/60 focus:ring-offset-2 focus:ring-offset-transparent
                   disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300
                   shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Sending Reset Link...
            </div>
          ) : (
            "Send Reset Link"
          )}
        </button>

        <div className="text-center">
          <a 
            href="/auth/Login" 
            className="text-red-400 hover:text-red-300 transition-colors duration-200 underline-offset-4 hover:underline text-sm"
          >
            Back to Sign In
          </a>
        </div>
      </form>
    </div>
  );
}
