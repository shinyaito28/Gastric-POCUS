import type { Metadata, Viewport } from "next";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import "@fontsource/jetbrains-mono/700.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gastric Ultrasound Calculator",
  description: "Point-of-Care Gastric Volume Assessment — Pediatric & Adult",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Gastric US",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#0f172a",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="bg-navy-900 text-slate-200 font-['-apple-system','Helvetica_Neue',sans-serif] antialiased">
        {children}
      </body>
    </html>
  );
}
