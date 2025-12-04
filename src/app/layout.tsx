import "./globals.css";
import Providers from "@/lib/providers";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { headers } from "next/headers";
import AndroidBackHandler from "@/utils/AndroidBackHandler";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export async function generateMetadata() {
  const locale = (await headers()).get("x-next-intl-locale") || "en";
  const messages = (await import(`../i18n/messages/${locale}.json`)).default;
  const title = messages.metadata?.title || "Trading Assistant";
  const description = messages.metadata?.description || "AI-powered trading assistant";

  return { title, description };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = (await headers()).get("x-next-intl-locale") || "en";
  const messages = (await import(`../i18n/messages/${locale}.json`)).default;

  return (
    <html lang={locale}>
      <head>

        <link rel="manifest" href="/manifest.json" />

        {/* <link rel="apple-touch-icon" href="/icons/icon-192.png" /> */}
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-icon-180.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/apple-icon-152.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/icons/apple-icon-167.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/icons/apple-icon-120.png" />
        <link rel="icon" href="/icons/icon-192.png" />


        <meta name="apple-mobile-web-app-title" content="Trading Assistant" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

        <meta name="theme-color" content="#ff0000" />

    
        <link rel="preload" as="image" href="/images/login-bg.jpg" />
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0b0b0b] text-white h-screen`}
      >
        <Providers>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <AndroidBackHandler />
            {children}
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  );
}
