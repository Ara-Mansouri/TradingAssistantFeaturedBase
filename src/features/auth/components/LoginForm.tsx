"use client";
import { useState } from "react";
import { useLogin } from "../hooks/useLogin";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";

export default function LoginForm() {
  const t = useTranslations("auth.login");
  const generic = useTranslations("errors");


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { mutate: handleLogin, isPending, isError, error } = useLogin();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin({ email: email.trim().toLowerCase(), password });
  };

  return (
    <div className="w-full px-4 sm:px-0 animate-fade-in">
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 text-white">
          {t("title")}
        </h1>
      </div>

      <form onSubmit={onSubmit} className="space-y-4 sm:space-y-6" noValidate>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-200">
            {t("emailLabel")}
          </label>
          <input
            type="text"
            name="loginemail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("emailPlaceholder")}
            className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-black
                     placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 
                     focus:border-red-500/50 transition-all duration-300
                     hover:bg-gray-50 hover:border-gray-400"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-200">
            {t("passwordLabel")}
          </label>
          <input
            type="password"
            name="loginpassword"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t("passwordPlaceholder")}
            className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-black
                     placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 
                     focus:border-red-500/50 transition-all duration-300
                     hover:bg-gray-50 hover:border-gray-400"
          />
        </div>
        
        {isError && (
          <div className="p-3 rounded-lg bg-red-500/15 border border-red-500/30 animate-fade-in">
            <p className="text-red-400 text-sm">
                   {error?.message === "UNEXPECTED_ERROR"? generic("generic"): error?.message}
            </p>
          </div>
        )}
        <div className="flex flex-row items-center justify-between  sm:flex-row sm:items-center sm:justify-between gap-3 text-sm">
          <a 
              href={"/auth/register"} 
            className="text-white hover:text-red-300 transition-colors duration-200 underline-offset-4 hover:underline"
          >
             {t("registerLink")}
          </a>
          <a 
             href={"/auth/forgot-password"} 
            className="text-white hover:text-red-300 transition-colors duration-200 underline-offset-4 hover:underline"
          >
              {t("forgotPasswordLink")}
          </a>
        </div>

        

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
        
      </form>
    </div>
  );
}
