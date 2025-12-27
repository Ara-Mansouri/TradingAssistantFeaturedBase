"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useVerifyEmailStatus } from "../hooks/useVerifyEmailStatus";
import { useTranslations } from "next-intl";

export default function VerifyEmailStatusForm({ code }: { code: string }) {
  const router = useRouter();
  const t = useTranslations("auth.status");
  const generic = useTranslations("errors");
  const { mutateAsync } = useVerifyEmailStatus();

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState("");
  const [progress, setProgress] = useState(100);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const verify = async () => {
      try {
        await mutateAsync(code);
        setStatus("success");
      } catch (err: any) {
        setErrorMsg(
          err?.message === "UNEXPECTED_ERROR" ? generic("generic") : err?.message
        );
        setStatus("error");
      }
    };
    verify();
  }, [code, mutateAsync, generic]);

  useEffect(() => {
    if (status === "success") {
      const totalDuration = 5000;
      const step = 100 / (totalDuration / 100);
      let secondsLeft = 5;

      const countdownInterval = setInterval(() => {
        secondsLeft--;
        setCountdown(secondsLeft);
        if (secondsLeft <= 0) clearInterval(countdownInterval);
      }, 1000);

      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.max(prev - step, 0));
      }, 100);

      const redirectTimeout = setTimeout(() => {
        clearInterval(progressInterval);
        router.push("/auth/login");
      }, totalDuration);

      return () => {
        clearInterval(progressInterval);
        clearInterval(countdownInterval);
        clearTimeout(redirectTimeout);
      };
    }
  }, [status, router]);

  const handleGoToLogin = () => router.push("/auth/login");

  return (
    <div className="w-full flex flex-col items-center justify-center px-4 sm:px-0 min-h-[70vh] animate-fade-in text-center">
      <div className="max-w-md bg-black/50 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)]">
        
        {status === "loading" && (
          <>
            <h1 className="text-2xl font-bold text-white mb-3">
              {t("verifyingTitle")}
            </h1>
            <p className="text-gray-400 text-sm">{t("verifyingDescription")}</p>
          </>
        )}

        {status === "success" && (
          <>
            <h1 className="text-2xl font-bold text-white mb-3">
              {t("successTitle")}
            </h1>
            <p className="text-gray-300 text-sm mb-6">
              {t("successDescription")}
            </p>

            <div className="relative w-full">
              <button
                onClick={handleGoToLogin}
                className="relative bg-gradient-to-r from-[#8c0f0f] via-[#b81414] to-[#8c0f0f] hover:brightness-110 transition-all text-white px-6 py-3 w-full rounded-xl font-semibold overflow-hidden shadow-[0_0_15px_rgba(255,50,50,0.2)] border border-red-900/40"
              >

                <div
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#d82929]/40 via-[#ff3b3b]/30 to-[#d82929]/40"
                  style={{
                    width: `${progress}%`,
                    transition: "width 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
                    filter: "blur(0.5px)",
                  }}
                ></div>

                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                  style={{
                    width: `${progress}%`,
                    opacity: 0.2,
                    transition: "width 0.3s ease-in-out",
                  }}
                ></div>

                <span className="relative z-10 font-medium tracking-wide">
                  {t("backToLogin")}{" "}
                  {countdown > 0 && (
                    <span className="opacity-75">({countdown})</span>
                  )}
                </span>
              </button>
            </div>
          </>
        )}


        {status === "error" && (
          <h1 className="text-2xl font-bold text-white mb-3">{errorMsg}</h1>
        )}
      </div>
    </div>
  );
}
