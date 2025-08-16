import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import KnowledgeGraphModal from "@/components/knowledge/KnowledgeGraphModal";
import ThemeToggle from "@/components/ui/ThemeToggle";
import Footer from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
  preload: false,
});

export const metadata: Metadata = {
  title: "Portfolio Template",
  description: "Modern portfolio website template built with Next.js and TypeScript",
  keywords: "portfolio, template, developer, Next.js, TypeScript, React",
  authors: [{ name: "Portfolio Template" }],
  icons: {
    icon: '/favicon.png',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {children}
          <Footer />
          <KnowledgeGraphModal />
          <ThemeToggle />
        </Providers>
      </body>
    </html>
  );
}
