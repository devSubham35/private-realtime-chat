import "./globals.css";
import type { Metadata, Viewport } from "next";
import Providers from "@/components/Providers";
import { JetBrains_Mono } from "next/font/google";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Realtime Chat",
    template: "%s | Realtime Chat",
  },
  description:
    "A fast, private realtime chat application for one-on-one and group conversations powered by Upstash Realtime and Next.js.",
  applicationName: "Realtime Chat",
  keywords: [
    "realtime chat",
    "private chat",
    "instant messaging",
    "Next.js",
    "Upstash",
    "websockets",
    "chat app",
  ],
  authors: [{ name: "devSubham35" }],
  creator: "devSubham35",
  publisher: "devSubham35",
  category: "communication",
  metadataBase: new URL("https://private-chat-shh.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Realtime Chat",
    title: "Realtime Chat",
    description:
      "A fast, private realtime chat application for one-on-one and group conversations.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Realtime Chat",
    description:
      "A fast, private realtime chat application for one-on-one and group conversations.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  interactiveWidget: "resizes-content",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
