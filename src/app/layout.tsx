import type { Metadata } from "next";
import "./globals.css";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL
  ? process.env.NEXT_PUBLIC_APP_URL
  : process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "https://resuma.app";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl.startsWith("http") ? baseUrl : `https://${baseUrl}`),
  title: "Resuma — Lightweight Production Resume Builder",
  description:
    "Build ATS-friendly, beautifully designed resumes in minutes. Reorder sections with drag-and-drop, export high-fidelity PDFs. Developed by Dylan Ramos, Software Engineer.",
  keywords: ["resume builder", "ats resume", "software engineer cv", "free resume maker", "dylan ramos"],
  authors: [{ name: "Dylan Ramos - Software Engineer" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Resuma — Lightweight Production Resume Builder",
    description:
      "Build ATS-friendly, beautifully designed resumes in minutes. Developed by Dylan Ramos, Software Engineer.",
    url: "/",
    siteName: "Resuma",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Resuma — Developed by Dylan Ramos",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Resuma — Lightweight Production Resume Builder",
    description:
      "Build ATS-friendly, beautifully designed resumes in minutes. Developed by Dylan Ramos, Software Engineer.",
    images: ["/og.png"],
  },
};

import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { AppToaster } from "@/components/common/AppToaster";
import { SplashScreen } from "@/components/common/SplashScreen";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body className={`${inter.className} min-h-screen bg-background text-foreground antialiased selection:bg-red-600/30 selection:text-white overflow-x-hidden w-full relative`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SplashScreen />
          {children}
          <AppToaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
