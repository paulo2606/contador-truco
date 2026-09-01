import type { Metadata, Viewport } from "next";
import "./globals.css";

const TITLE = "Contador de Truco";
const DESCRIPTION = "Marcador de Truco Paulista e Mineiro para dupla (2x2) ou individual (1x1).";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/icon-180-apple.png", sizes: "180x180", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Truco",
  },
};

export const viewport: Viewport = {
  themeColor: "#0d4d34",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="relative min-h-full">{children}</body>
    </html>
  );
}
