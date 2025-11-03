"use client";
import { useState } from "react";
import { useForgotPassword } from "../hooks/useForgotPassword";
import { useTranslations } from "next-intl";

export default function ForgotPasswordForm() {
 const t = useTranslations("auth.forgot");
  const generic = useTranslations("errors");
  const [email, setEmail] = useState("");
  const { mutate, isPending, isError, error } = useForgotPassword();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(email);
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

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6" noValidate>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-200">
            {t("emailLabel")}
          </label>
          <input
            type="text"
            name="forgetpassemail"
            placeholder= {t("emailPlaceholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-black
                     placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 
                     focus:border-red-500/50 transition-all duration-300
                     hover:bg-gray-50 hover:border-gray-400"
            // required
          />
        </div>

        {isError && (
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

      </form>
    </div>
  );
}
