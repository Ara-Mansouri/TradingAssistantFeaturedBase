"use client";
import { useResetPassword } from "../hooks/useResetPassword";
import { useState } from "react";
export default function ResetPasswordForm() {

  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { email, mutate: handleReset, isPending, isError, error } = useResetPassword();

 if (!email) /// nabayd dakhel middleware handle beshe????
  {
    // اگه کاربر مستقیم اومد بدون مرحله قبل، برگرد به forgot password
    if (typeof window !== "undefined") window.location.href = "/auth/forgot-password";
    return null;
  }
  const onSubmit = (e: React.FormEvent) => 
    {
    e.preventDefault();

    handleReset({ email, verificationCode, newPassword });
  };
  return (
    <div className="w-full px-4 sm:px-0 animate-fade-in">
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 text-white">
          Reset Password
        </h1>
        <p className="text-gray-400 text-sm lg:text-base">
          Enter the verification code and your new password
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4 sm:space-y-6">


        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-200">
            Verification Code
          </label>
          <input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder="Enter verification code"
            className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-black
                     placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 
                     focus:border-red-500/50 transition-all duration-300
                     hover:bg-gray-50 hover:border-gray-400"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-200">
            New Password
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-black
                     placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 
                     focus:border-red-500/50 transition-all duration-300
                     hover:bg-gray-50 hover:border-gray-400"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-200">
            Confirm New Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-black
                     placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 
                     focus:border-red-500/50 transition-all duration-300
                     hover:bg-gray-50 hover:border-gray-400"
            required
          />
        </div>

          {isError && (
          <div className="p-3 rounded-lg bg-red-500/15 border border-red-500/30 animate-fade-in">
            <p className="text-red-400 text-sm">
              {error?.message ?? "Reset PassWord Failed"}
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-3 px-4 rounded-xl font-semibold text-white
                   bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900
                   focus:outline-none focus:ring-2 focus:ring-red-500/60 focus:ring-offset-2 focus:ring-offset-transparent
                   disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300
                   shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          {isPending ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Resetting Password...
            </div>
          ) : (
            "Reset Password"
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
