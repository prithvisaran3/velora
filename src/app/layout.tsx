import type { Metadata } from "next";
import { Bodoni_Moda, Archivo, Anek_Tamil } from "next/font/google";
import "./globals.css";
import { Header } from "@/view/layout/Header";
import { Footer } from "@/view/layout/Footer";
import { WhatsAppFab } from "@/view/layout/WhatsAppFab";
import { VelLoader } from "@/view/motion/VelLoader";
import { CartProvider } from "@/viewmodel/client/useCart";
import { PageTransition } from "@/view/motion/PageTransition";
import { Analytics } from "@vercel/analytics/react";

const bodoniModa = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-bodoni-moda",
  display: "swap",
});

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

const anekTamil = Anek_Tamil({
  subsets: ["tamil", "latin"],
  variable: "--font-anek-tamil",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Velora · Handpicked Silk Sarees from Erode",
  description:
    "Handpicked pure silk sarees, curated in Erode by Priya Mahadevan. India-only free shipping.",
  openGraph: {
    title: "Velora · Handpicked Silk Sarees from Erode",
    description: "Handpicked pure silk sarees, curated in Erode by Priya Mahadevan. India-only free shipping.",
    url: "https://velora-saree.vercel.app",
    siteName: "Velora",
    images: [
      {
        url: "https://velora-saree.vercel.app/brand/png/icon-flat-512.png",
        width: 512,
        height: 512,
        alt: "Velora Silk Logo",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bodoniModa.variable} ${archivo.variable} ${anekTamil.variable}`}
    >
      <body className="antialiased bg-cream text-ink min-h-screen flex flex-col justify-between">
        <CartProvider>
          <VelLoader />
          <Header />
          <PageTransition>
            <main className="flex-grow">{children}</main>
          </PageTransition>
          <Footer />
          <WhatsAppFab />
          <Analytics />
        </CartProvider>
      </body>
    </html>
  );
}
