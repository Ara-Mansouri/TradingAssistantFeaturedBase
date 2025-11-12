"use client";
import { useResetPassword } from "../hooks/useResetPassword";
import {useState } from "react";
import { useAuthContext  } from "@/context/AuthContext";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";


export default function ResetPasswordForm() {
 const t = useTranslations("auth.reset");
 const tErrors = useTranslations("errors");
 const generic = useTranslations("errors");
 //const locale = useLocale();

  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const {mutate: handleReset, isPending, isError, error } = useResetPassword();
  const { email } = useAuthContext();
  const onSubmit = (e: React.FormEvent) => 
    {
    e.preventDefault();
      if (newPassword !== confirmPassword) {
        setLocalError(tErrors("unmatchPassword")); 
      return;
    }
    setLocalError(null);
    handleReset({ email: email.trim().toLowerCase(), verificationCode, newPassword }); 
  };
  return (
    <div className="w-full px-4 sm:px-0 animate-fade-in">
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 text-white">
         {t("title")}
        </h1>
        <p className="text-gray-400 text-sm lg:text-base">
           {t("description")}
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4 sm:space-y-6" noValidate>


        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-200">
              {t("codeLabel")}
          </label>
          <input
            type="text"
            name="verificationCode"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder= {t("codePlaceholder")}
            className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-black
                     placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 
                     focus:border-red-500/50 transition-all duration-300
                     hover:bg-gray-50 hover:border-gray-400"
            // required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-200">
            {t("newPasswordLabel")}
          </label>
          <input
            type="password"
            name="newPasswordLabel"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder={t("newPasswordPlaceholder")}
            className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-black
                     placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 
                     focus:border-red-500/50 transition-all duration-300
                     hover:bg-gray-50 hover:border-gray-400"
            // required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-200">
           {t("confirmPasswordLabel")}
          </label>
          <input
            type="password"
            name="confirmPasswordLabel"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder={t("confirmPasswordPlaceholder")}
            className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-black
                     placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 
                     focus:border-red-500/50 transition-all duration-300
                     hover:bg-gray-50 hover:border-gray-400"
            // required
          />
        </div>
           {localError && (
          <div className="p-3 rounded-lg bg-red-500/15 border border-red-500/30 animate-fade-in">
            <p className="text-red-400 text-sm">{localError}</p>
          </div>
        )}

          {isError && !localError && (
          <div className="p-3 rounded-lg bg-red-500/15 border border-red-500/30 animate-fade-in">
            <p className="text-red-400 text-sm">
              {error?.message === "UNEXPECTED_ERROR"? generic("generic"): error?.message}
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
               {t("loading")}
            </div>
          ) : (
             t("submit")
          )}
        </button>

        <div className="text-center">
          <a 
             href={"/auth/Login"} 
            className="text-red-400 hover:text-red-300 transition-colors duration-200 underline-offset-4 hover:underline text-sm"
          >
            {t("backToLogin")}
          </a>
        </div>
      </form>
    </div>
  );
}
