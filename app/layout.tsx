import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import { AuthProvider } from "./Authprovider";
import "./globals.css";

import Navbar from "./_components/Navbar";
import { cn } from "@/lib/utils";
import Footer from "./_components/Footer";
import { ToastProvider } from "./_components/ToastProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Elegant store",
    default: "Elegant store",
  },
  description: "An ecommerce store built with Nextjs, mongoose, mongodb",
  // metadataBase: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", inter.variable)}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <Navbar />
          {children}
          <Footer />
          <ToastProvider />
        </AuthProvider>
      </body>
    </html>
  );
}
