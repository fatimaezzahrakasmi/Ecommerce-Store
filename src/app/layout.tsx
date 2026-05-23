import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "../context/CartContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import WhatsAppFloating from "../components/WhatsAppFloating";
import GlobalCartWrapper from "../components/GlobalCartWrapper";

export const metadata: Metadata = {
  title: "BADR | Premium Men's Fashion",
  description: "Minimalist high-fashion menswear based in Morocco.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col justify-between selection:bg-black selection:text-white">
        <CartProvider>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <GlobalCartWrapper />
          <WhatsAppFloating />
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
