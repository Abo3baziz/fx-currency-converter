import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

export const metadata: Metadata = {
  title: "FX Checker — Live Currency Converter",
  description:
    "Real-time currency converter with live ECB/EOD rates, historical charts, pair comparison, favorites, and a conversion log.",
  applicationName: "FX Checker",
  openGraph: {
    title: "FX Checker — Live Currency Converter",
    description:
      "Convert 57 currencies with live ECB/EOD rates, track history, compare pairs, and save favorites.",
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "FX Checker",
    images: [
      {
        url: "/preview.jpg",
        width: 1200,
        height: 630,
        alt: "FX Checker — live currency converter",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FX Checker — Live Currency Converter",
    description:
      "Convert 57 currencies with live ECB/EOD rates, track history, compare pairs, and save favorites.",
    images: ["/preview.jpg"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

const jetbrains_mono = localFont({
  src: "./fonts/jetbrains-mono/JetBrainsMono-Regular.woff2",
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${jetbrains_mono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-black">{children}</body>
    </html>
  );
}
