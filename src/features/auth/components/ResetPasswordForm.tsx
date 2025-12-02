"use client";

import { useResetPassword } from "../hooks/useResetPassword";
import { useAuthContext } from "@/features/auth/context/AuthContext";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetpasswordSchema } from "../validation/resetpassword.schema.";
import { z } from "zod";
import ErrorBox from "./ErrorBox";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

type resetpasswordFormData = z.infer<typeof resetpasswordSchema>;

export default function ResetPasswordForm() {
  const pathname = usePathname();
  const t = useTranslations("auth.reset");
  const tErr = useTranslations("errors");

  const {
    register,
    setError,
    clearErrors,
    reset,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<resetpasswordFormData>({
    resolver: zodResolver(resetpasswordSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const { mutate: handleReset, isPending } = useResetPassword({
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

  useEffect(() => {
    reset();
    clearErrors();
  }, [pathname, reset, clearErrors]);

  const { email } = useAuthContext();

  const onSubmit = async () => {
    clearErrors();

    const valid = await trigger();
    if (!valid) return;

    const data = getValues();

    handleReset({
      email: email.trim().toLowerCase(),
      verificationCode: data.code,
      newPassword: data.newPassword,
    });
  };

  return (
    <div className="w-full px-4 sm:px-0 animate-fade-in">
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 text-gray-700">
          {t("title")}
        </h1>
        <p className="text-white text-sm lg:text-base">{t("description")}</p>
      </div>

      <div key={pathname} className="space-y-4 sm:space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {t("codeLabel")}
          </label>
          <input
            type="text"
            {...register("code")}
            autoComplete="one-time-code"
            placeholder={t("codePlaceholder")}
            className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900
                     placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#8b4d9a]/50 
                     focus:border-[#8b4d9a]/50 transition-all duration-300
                     hover:bg-gray-50 hover:border-[#9b5daa]/40 shadow-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {t("newPasswordLabel")}
          </label>
          <input
            type="password"
            {...register("newPassword")}
            autoComplete="newPassword"
            placeholder={t("newPasswordPlaceholder")}
            className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900
                     placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#8b4d9a]/50 
                     focus:border-[#8b4d9a]/50 transition-all duration-300
                     hover:bg-gray-50 hover:border-[#9b5daa]/40 shadow-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {t("confirmPasswordLabel")}
          </label>
          <input
            type="password"
            {...register("confirmPassword")}
            autoComplete="confirmPassword"
            placeholder={t("confirmPasswordPlaceholder")}
            className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900
                     placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#8b4d9a]/50 
                     focus:border-[#8b4d9a]/50 transition-all duration-300
                     hover:bg-gray-50 hover:border-[#9b5daa]/40 shadow-sm"
          />
        </div>

        <ErrorBox errors={errors} tErr={tErr} tLabels={t} />

        <button
          onClick={onSubmit}
          disabled={isPending}
          className="w-full py-3 px-4 rounded-xl font-semibold text-white
                   bg-gradient-to-r from-[#8b4d9a] to-[#7a3d8a] hover:from-[#9b5daa] hover:to-[#8b4d9a]
                   focus:outline-none focus:ring-2 focus:ring-[#8b4d9a]/60 focus:ring-offset-2 focus:ring-offset-white
                   disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300
                   shadow-lg hover:shadow-xl hover:shadow-[#8b4d9a]/25 transform hover:-translate-y-0.5"
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
          <Link
            href="/auth/Login"
            className="text-white hover:text-[#9b5daa] transition-colors duration-200 underline-offset-4 hover:underline text-sm font-medium"
          >
            {t("backToLogin")}
          </Link>
        </div>
      </div>
    </div>
  );
}
