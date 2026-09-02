import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lembaga Bahasa Universitas Widyatama",
  description: "Platform ujian bahasa Inggris berbasis komputer",
};

import { Providers } from "./providers";
import { I18nProvider } from "@/lib/i18n/I18nProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <I18nProvider>
          <Providers>
            <ThemeProvider>{children}</ThemeProvider>
          </Providers>
        </I18nProvider>
      </body>
    </html>
  );
}
