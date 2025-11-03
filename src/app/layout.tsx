// src/app/layout.tsx
import './globals.css';
import Providers from '@/lib/providers';
import {Geist, Geist_Mono} from 'next/font/google';
import {NextIntlClientProvider} from 'next-intl';
import {getLocale, getMessages} from 'next-intl/server';

const geistSans = Geist({variable: '--font-geist-sans', subsets: ['latin']});
const geistMono = Geist_Mono({variable: '--font-geist-mono', subsets: ['latin']});

export const metadata = {
  title: 'Trading Assistant',
  description: 'AI-powered trading assistant'
};

export default async function RootLayout({children}: {children: React.ReactNode}) {
  // Read from middleware-provided request
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0b0b0b] text-white`}>
        {/* Keep your app-wide Providers OUTSIDE NextIntlClientProvider if they don't depend on locale,
            so they aren't remounted on language switch (Context/state is preserved). */}
        <Providers>
          <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  );
}
