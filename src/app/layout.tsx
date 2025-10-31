import "./globals.css";
import Providers from "@/lib/providers"; 
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <body
      className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0b0b0b] text-white`}
    >
      <Providers>{children}</Providers>
    </body>
  );
}
