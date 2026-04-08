import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "HatSafe - Stop chasing certificates in spreadsheets",
  description: "HatSafe gives construction and trade businesses one simple place to store, track, and manage compliance documents — with automated expiry alerts and AI-assisted document processing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased bg-[#FAFAFA]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
