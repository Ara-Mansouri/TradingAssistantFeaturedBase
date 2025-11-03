
import "./globals.css";
import Providers from "@/lib/providers";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { headers } from "next/headers";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata = {
  title: "Trading Assistant",
  description: "AI-powered trading assistant",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {

  const locale = (await headers()).get("x-next-intl-locale") || "en";


  const messages = (await import(`../i18n/messages/${locale}.json`)).default;

  const dir = locale === "fa" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0b0b0b] text-white`}
      >
        <Providers>
          <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  );
}
