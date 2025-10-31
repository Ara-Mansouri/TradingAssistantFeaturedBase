import React from "react";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import "../../app/globals.css";


export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "fa" }, { locale: "fr" }];
}


export const metadata = {
  title: "Trading Assistant",
  description: "AI-powered trading assistant",
};


interface LocaleLayoutProps {
  children: React.ReactNode;
  params: {
    locale: "en" | "fa" | "fr";
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = params;

  let messages;
  try {
    messages = (await import(`../../i18n/messages/${locale}.json`)).default;
  } catch {
    notFound();
  }

  return (
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
  );
}
