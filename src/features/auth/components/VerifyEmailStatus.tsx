"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useVerifyEmailStatus } from "../hooks/useVerifyEmailStatus";

export default function VerifyEmailStatusForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code") || "";

  const { mutateAsync } = useVerifyEmailStatus();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!code) {
      setErrorMsg("Missing token in URL.");
      setStatus("error");
      return;
    }

    const verify = async () => {
      try {
        await mutateAsync(code);
        setStatus("success");
        setTimeout(() => router.push("/auth/login"), 2500);
      } catch (err: any) {
        setErrorMsg(err.message || "Verification failed.");
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
            <h1 className="text-2xl font-bold text-white mb-3">
              Verifying your email...
            </h1>
            <p className="text-gray-400 text-sm">
              Please wait while we confirm your account.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <h1 className="text-2xl font-bold text-green-400 mb-3">
              Email verified successfully!
            </h1>
            <p className="text-gray-300 text-sm">
              You’ll be redirected to the login page shortly.
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <h1 className="text-2xl font-bold text-red-500 mb-3">
               {errorMsg}
            </h1>
            {/* <p className="text-gray-300 text-sm">{errorMsg}</p> */}
          </>
        )}
      </div>
    </div>
  );
}
