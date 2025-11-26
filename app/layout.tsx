import type React from "react";
import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import ProductsProvider from "@/components/ProductsProvider";
import WhatsAppFloating from "@/components/WhatsAppFloating";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Chocotones Artesanais - Delícias Feitas com Amor",
  description:
    "Chocotones artesanais com chocolate belga, massa fofinha e sabor irresistível. Faça seu pedido agora!",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/logo.png",
        sizes: "any",
      },
    ],
    shortcut: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        suppressHydrationWarning
        className={`${inter.variable} ${playfair.variable} font-sans antialiased`}
      >
        <ProductsProvider>{children}</ProductsProvider>
        <WhatsAppFloating
          message={"Olá, gostaria informações sobre os chocotones!"}
        />
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
