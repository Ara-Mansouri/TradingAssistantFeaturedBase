"use client";

import { useRegister } from "../hooks/useRegister";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../validation/register.schema";
import { z } from "zod";
import ErrorBox from "./ErrorBox";

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterForm() {
   const {
      register,
      handleSubmit,
      setError,
      clearErrors,
      formState: { errors },
    } = useForm<RegisterFormData>({
      resolver: zodResolver(registerSchema),
      mode: "onSubmit",
      reValidateMode: "onSubmit",
    });
  const { mutate: handleRegister, isPending } = useRegister({
    onError: (err: any) => {
    setError("server", {
    type: "server",
     message:
          err?.message === "UNEXPECTED_ERROR"
            ? tErr("generic")
            : err?.message ?? tErr("generic"),                          
  })
    },
  });

  const t = useTranslations("auth.register");
  const tErr = useTranslations("errors");



  const onSubmit = (data: RegisterFormData) => {
    clearErrors();
     handleRegister({ email: data.email.trim().toLowerCase(), password:data.password ,firstName : data.firstName,lastName :data.lastName});
  };

  return (
    <div className="w-full px-4 sm:px-0 animate-fade-in">
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 text-white">
          {t("title")}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6" noValidate>
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-200">
                {t("firstNameLabel")}
            </label>
            <input
              autoComplete="registerfname"
              {...register("firstName")}
              placeholder={t("RnamePlaceHolder")}
              className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-black
                       placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 
                       focus:border-red-500/50 transition-all duration-300
                       hover:bg-gray-50 hover:border-gray-400"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-200">
              {t("lastNameLabel")}
            </label>
            <input
              autoComplete="registerlname"
              {...register("lastName")}
              placeholder={t("RLnamePlaceHolder")}
               className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-black
           placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 
           focus:border-red-500/50 transition-all duration-300
                       hover:bg-gray-50 hover:border-gray-400"
              
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-200">
             {t("emailLabel")}
          </label>
          <input
            type="text"
            autoComplete="registeremail"
            {...register("email")}
            placeholder={t("RemailPlaceholder")}
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
            {...register("password")}
            placeholder={t("RpasswordPlaceholder")}
            className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-black
                     placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 
                     focus:border-red-500/50 transition-all duration-300
                     hover:bg-gray-50 hover:border-gray-400"
            required
          />
        </div>
        <ErrorBox errors={errors} tErr={tErr} tLabels={t} />
        <div className="flex justify-between items-center text-sm">
          <a
             href={"/auth/Login"} 
            className="text-white hover:text-red-300 transition-colors duration-200 underline-offset-4 hover:underline"
          >
             {t("loginLink")}
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
