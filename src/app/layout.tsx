import type { Metadata } from "next";
import { Bodoni_Moda, Archivo, Anek_Tamil } from "next/font/google";
import "./globals.css";
import { Header } from "@/view/layout/Header";
import { Footer } from "@/view/layout/Footer";
import { WhatsAppFab } from "@/view/layout/WhatsAppFab";
import { VelLoader } from "@/view/motion/VelLoader";
import { CartProvider } from "@/viewmodel/client/useCart";

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
  title: "Velora by Bharani Pattu · Handpicked Silk Sarees",
  description:
    "Handpicked pure silk sarees. Family silk house in Erode, Tamil Nadu since 1978. India-only free shipping.",
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
      <body className="antialiased bg-[#FDF4E4] text-[#241F1C] min-h-screen flex flex-col justify-between">
        <CartProvider>
          <VelLoader />
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
          <WhatsAppFab />
        </CartProvider>
      </body>
    </html>
  );
}
