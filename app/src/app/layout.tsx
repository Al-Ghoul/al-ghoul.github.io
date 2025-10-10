import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import FluidCanvas from "@/components/FluidCanvas";
import { Navbar } from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import I18NProvider from "@/components/I18NProvider";
import Preloader from "@/components/PreLoader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Abdulrahman AlGhoul",
  description: "A developer's blog that's meant to be creative, inspirational, educational, and to list my portfolio projects.",
};

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
        <I18NProvider>
          <Preloader >
            <Navbar />
            {children}
            <Footer />
          </Preloader>
          <FluidCanvas />
        </I18NProvider>
      </body>
    </html>
  );
}
