import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope, Noto_Serif_JP } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { assetPath } from "@/lib/assets";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const notojp = Noto_Serif_JP({
  variable: "--font-notojp",
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SUMI · Maki & Nikkei Bar — Lima",
  description:
    "Makis de autor con técnica japonesa y alma nikkei. Arroz en punto, pescado del día al Callao y salsas de la casa. Delivery en Lima o recógelo en Miraflores.",
  keywords: ["makis", "sushi", "nikkei", "Lima", "delivery", "Miraflores", "comida japonesa"],
  authors: [{ name: "SUMI Maki & Nikkei Bar" }],
  icons: { icon: assetPath("/favicon.svg") },
  openGraph: {
    title: "SUMI · Maki & Nikkei Bar — Lima",
    description: "El arte del maki, alma nikkei. Makis de autor en Miraflores, Lima.",
    siteName: "SUMI",
    type: "website",
    locale: "es_PE",
  },
};

export const viewport: Viewport = {
  themeColor: "#0B0A08",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning className="dark">
      <body
        className={`${cormorant.variable} ${manrope.variable} ${notojp.variable} antialiased bg-background text-foreground grain`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
