import React from "react";
import type { Metadata } from "next";
import { Poppins} from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"

const poppins= Poppins({
    variable: "--font-poppins",
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
})

export const metadata: Metadata = {
  title: "StoreIt",
  description: "StoreIt - A simple and secure file storage solution",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body
        className={`${poppins.variable} font-poppins  antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
