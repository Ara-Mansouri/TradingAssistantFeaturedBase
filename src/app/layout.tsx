import "./globals.css";
import Providers from "@/lib/providers";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";
import { Geist, Geist_Mono } from "next/font/google";
import { AppLocale, defaultLocale, locales } from "@/i18n/config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

async function loadMessages(locale: string) {
  const normalizedLocale: AppLocale =
    locale && locales.includes(locale as AppLocale)
      ? (locale as AppLocale)
      : defaultLocale;

  try {
    const messages = (await import(`@/i18n/messages/${normalizedLocale}.json`)).default;
    return { locale: normalizedLocale, messages };
  } catch {
    const fallbackMessages = (await import(`@/i18n/messages/${defaultLocale}.json`)).default;
    return { locale: defaultLocale, messages: fallbackMessages };
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const resolvedLocale = await getLocale();
  const { locale, messages } = await loadMessages(resolvedLocale);

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0b0b0b] text-white`}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}