"use client";

import { useForgotPassword } from "../hooks/useForgotPassword";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgetpasswordSchema } from "../validation/forgotpassword.schema";
import { z } from "zod";
import ErrorBox from "./ErrorBox";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

type forgetpasswordFormData = z.infer<typeof forgetpasswordSchema>;

export default function ForgotPasswordForm() {
  const pathname = usePathname();
  const t = useTranslations("auth.forgot");
  const tErr = useTranslations("errors");

  const {
    register,
    setError,
    clearErrors,
    reset,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<forgetpasswordFormData>({
    resolver: zodResolver(forgetpasswordSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const { mutate, isPending } = useForgotPassword({
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

  const onSubmit = async () => {
    clearErrors();

    const valid = await trigger();
    if (!valid) return;

    const data = getValues();
    const safeEmail = data.email.trim().toLowerCase();
    mutate(safeEmail);
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

      <div key={pathname} className="space-y-4 sm:space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-200">
            {t("emailLabel")}
          </label>

          <input
            type="text"
            placeholder={t("emailPlaceholder")}
            {...register("email")}
            autoComplete="forgetemail"
            className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-black
                     placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 
                     focus:border-red-500/50 transition-all duration-300
                     hover:bg-gray-50 hover:border-gray-400"
          />
        </div>

        <ErrorBox errors={errors} tErr={tErr} tLabels={t} />

        <button
          onClick={onSubmit}
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
      </div>
    </div>
  );
}
