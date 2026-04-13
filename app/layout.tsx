import React from "react";

import { Jersey_10, Inter } from "next/font/google";

import "./globals.css";

import SideBar from "@/components/Sidebar";

const jersey10 = Jersey_10({
  weight: "400",
  variable: "--font-jersey",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "Wynncraft Explorer",
  description: "A professional and high-aesthetic data portal for Wynncraft.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (

    <html lang="en" className={`${jersey10.variable} ${inter.variable} antialiased`}>

      <body className="min-h-screen bg-slate-50 flex flex-col md:flex-row h-screen overflow-hidden">

        <SideBar />

        <main className="flex-1 overflow-y-auto">

          {children}

        </main>

      </body>

    </html>

  );

}