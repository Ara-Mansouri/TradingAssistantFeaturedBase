"use client";
import { useResetPassword } from "../hooks/useResetPassword";
import {useState } from "react";
import { useAuthContext  } from "@/context/AuthContext";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetpasswordSchema } from "@/validation/resetpassword.schema.";
import { z } from "zod";
import ErrorBox from "./ErrorBox";

type resetpasswordFormData = z.infer<typeof resetpasswordSchema>;
export default function ResetPasswordForm() {
 const t = useTranslations("auth.reset");
 const tErr = useTranslations("errors");

 //const locale = useLocale();

  const {mutate: handleReset, isPending } = useResetPassword({
    onError: (err: any) => {
      setError("server", {
        type: "server",
        message:
          err?.message === "UNEXPECTED_ERROR"
            ? tErr("generic")
            : err?.message ?? tErr("generic"),
      });
    },
  });
  
     const {
        register,
        handleSubmit,
        setError,
        clearErrors,
        formState: { errors },
      } = useForm<resetpasswordFormData>({
        resolver: zodResolver(resetpasswordSchema),
        mode: "onSubmit",
        reValidateMode: "onSubmit",
      });
    
  
  const { email } = useAuthContext();
  const onSubmit = (data: resetpasswordFormData) => 
    {
    clearErrors();
    handleReset({ email: email.trim().toLowerCase(), verificationCode :data.code, newPassword : data.newPassword}); 
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6" noValidate>


        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-200">
              {t("codeLabel")}
          </label>
          <input
            type="text"
            {...register("code")}
            autoComplete="one-time-code"
            placeholder= {t("codePlaceholder")}
            className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-black
                     placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 
                     focus:border-red-500/50 transition-all duration-300
                     hover:bg-gray-50 hover:border-gray-400"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-200">
            {t("newPasswordLabel")}
          </label>
          <input
            type="password"
          {...register("newPassword")}
          autoComplete="newPassword"
            placeholder={t("newPasswordPlaceholder")}
            className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-black
                     placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 
                     focus:border-red-500/50 transition-all duration-300
                     hover:bg-gray-50 hover:border-gray-400"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-200">
           {t("confirmPasswordLabel")}
          </label>
          <input
            type="password"
           {...register("confirmPassword")}
            autoComplete="confirmPassword"
            placeholder={t("confirmPasswordPlaceholder")}
            className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-black
                     placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 
                     focus:border-red-500/50 transition-all duration-300
                     hover:bg-gray-50 hover:border-gray-400"
          />
        </div>
        <ErrorBox errors={errors} tErr={tErr} tLabels={t} />

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
