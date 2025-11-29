import "./globals.css";
import Providers from "@/lib/providers";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { headers } from "next/headers";
import AndroidBackHandler from "@/utils/AndroidBackHandler"
import { usePathname } from "next/navigation";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });


export async function generateMetadata() {
  const locale = (await headers()).get("x-next-intl-locale") || "en";
  const messages = (await import(`../i18n/messages/${locale}.json`)).default;
  const title = messages.metadata?.title || "Trading Assistant";
  const description = messages.metadata?.description || "AI-powered trading assistant";

  return {
    title,
    description,
  };
}

export default async function RootLayout({children,}: {  children: React.ReactNode;}) {
  const locale = (await headers()).get("x-next-intl-locale") || "en";
  const messages = (await import(`../i18n/messages/${locale}.json`)).default;
    const  pathname  = usePathname();
  return (
    <html lang={locale} >
      <head>
  {pathname.startsWith("/auth") && (
    <link rel="prefetch" href="/images/login-bg.jpg" as="image" />
  )}
</head>
      <body 
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0b0b0b] text-white h-screen `}
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
