"use client";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import LeftRail from "@/components/layout/LeftRail";
import { LayoutProvider, useLayout } from "@/components/context/LayoutContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { isLeftRailCollapsed } = useLayout();

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-20">
        <Header />
      </div>
      <div className="flex pt-11">
        <div className="fixed top-11 left-0 bottom-0 z-10">
          <LeftRail />
        </div>
        <main
          className={`flex-1 overflow-auto min-h-screen transition-all duration-300 ${
            isLeftRailCollapsed ? "ml-10" : "ml-64"
          }`}
        >
          {children}
        </main>
      </div>
    </>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LayoutProvider>
          <LayoutContent>{children}</LayoutContent>
        </LayoutProvider>
      </body>
    </html>
  );
}
