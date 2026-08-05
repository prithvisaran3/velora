import type { Metadata } from "next";
import { Bodoni_Moda, Archivo, Anek_Tamil } from "next/font/google";
import "./globals.css";
import { Header } from "@/view/layout/Header";
import { Footer } from "@/view/layout/Footer";
import { WhatsAppFab } from "@/view/layout/WhatsAppFab";
import { CartProvider } from "@/viewmodel/client/useCart";
import { CanvasProvider } from "@/three/CanvasProvider";
import { BagFlight } from "@/view/motion/BagFlight";
import { ThreadIntro } from "@/view/thread/ThreadIntro";
import { ThreadTransition } from "@/view/thread/ThreadTransition";
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
    description:
      "Handpicked pure silk sarees, curated in Erode by Priya Mahadevan. India-only free shipping.",
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
      {/* No background on <body>: the ground is `--page-bg` on <html>, which is
          what the thread's colour change animates. An opaque body hid it. */}
      <body className="flex min-h-screen flex-col justify-between text-ink antialiased">
        <CartProvider>
          <CanvasProvider>
            <ThreadIntro />
            <Header />
            <ThreadTransition>
              <main className="flex-grow">{children}</main>
            </ThreadTransition>
            <Footer />
            <WhatsAppFab />
            <BagFlight />
          </CanvasProvider>
          <Analytics />
        </CartProvider>
      </body>
    </html>
  );
}
