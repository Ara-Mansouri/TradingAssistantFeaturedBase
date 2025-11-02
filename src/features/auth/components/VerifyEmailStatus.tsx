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

  useEffect(() => {
    const verify = async () => {
      try {
        await mutateAsync(code);
        setStatus("success");
        setTimeout(() => router.push("/auth/Login"), 2500);
      } 
      catch (err: any) {
        setErrorMsg(err?.message === "UNEXPECTED_ERROR"? generic("generic"): err?.message);
        setStatus("error");
      }
    };

    verify();
  }, [code, mutateAsync, router]);

  return (
    <div className="w-full flex flex-col items-center justify-center px-4 sm:px-0 min-h-[70vh] animate-fade-in text-center">
      <div className="max-w-md bg-black/50 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
        {status === "loading" && (
          <>
            <h1 className="text-2xl font-bold text-white mb-3">{t("verifyingTitle")}</h1>
            <p className="text-gray-400 text-sm">{t("verifyingDescription")}</p>
          </>
        )}
        {status === "success" && (
          <>
            <h1 className="text-2xl font-bold text-white-400 mb-3">{t("successTitle")}</h1>
            <p className="text-gray-300 text-sm">{t("successDescription")}</p>
          </>
        )}
        {status === "error" && (
          <h1 className="text-2xl font-bold text-white-500 mb-3">{errorMsg}</h1>
        )}
      </div>
    </div>
  );
}
