import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import "./android.css";
import { Header } from "@/components/Header";
import { PromoTicker } from "@/components/home/PromoTicker";
import { CartDrawer } from "@/components/CartDrawer";
import { SiteFooter } from "@/components/SiteFooter";
import { AndroidInstallHint } from "@/components/AndroidInstallHint";
import { OrderFab } from "@/components/OrderFab";

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const body = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Virasat Sarees | Luxury Indian Ethnic Wear & Sarees",
  description:
    "Discover handpicked sarees — Kanjeevaram, Banarasi, Organza & more. Free shipping on orders over ₹600.",
  applicationName: "Virasat Sarees",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Virasat Sarees",
  },
  formatDetection: {
    telephone: true,
    email: false,
    address: false,
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#5c1d2a" },
    { media: "(prefers-color-scheme: dark)", color: "#5c1d2a" },
  ],
  viewportFit: "cover",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${display.variable} ${body.variable} h-full`}
    >
      <body className="flex min-h-full min-h-[100dvh] flex-col overflow-x-hidden bg-cream text-charcoal antialiased">
        <PromoTicker />
        <Header />
        <main className="w-full min-w-0 flex-1 pb-20">{children}</main>
        <CartDrawer />
        <SiteFooter />
        <OrderFab />
        <AndroidInstallHint />
      </body>
    </html>
  );
}
