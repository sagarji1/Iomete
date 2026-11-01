import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IOMETE PROOF — Don't Pitch. Prove.",
  description: "AI-Powered Enterprise Sales Intelligence & Product Experience Platform. Interactive, evidence-backed lakehouse evaluation.",
};

import { Suspense } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} dark`}>
      <body className="bg-[#080B10] text-[#F1F5F9] min-h-screen flex antialiased">
        <Suspense fallback={<div className="w-64 bg-[#0A0F16] shrink-0" />}>
          <Sidebar />
        </Suspense>
        <div className="flex-1 flex flex-col min-w-0 min-h-screen bg-[#080B10]">
          <Header />
          <main className="flex-1 overflow-y-auto p-8">{children}</main>
        </div>
        <Toaster position="bottom-right" richColors theme="dark" />
      </body>
    </html>
  );
}

