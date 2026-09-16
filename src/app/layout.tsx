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
    "Build ATS-friendly, beautifully designed resumes in minutes. Reorder sections with drag-and-drop, export high-fidelity PDFs, and share your work.",
  keywords: ["resume builder", "ats resume", "software engineer cv", "free resume maker"],
  authors: [{ name: "Resuma" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Resuma — Lightweight Production Resume Builder",
    description:
      "Build ATS-friendly, beautifully designed resumes in minutes. Reorder sections with drag-and-drop, export high-fidelity PDFs, and share your work.",
    url: "/",
    siteName: "Resuma",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Resuma — Production Resume Builder",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Resuma — Lightweight Production Resume Builder",
    description:
      "Build ATS-friendly, beautifully designed resumes in minutes. Reorder sections with drag-and-drop, export high-fidelity PDFs, and share your work.",
    images: ["/og.png"],
  },
};

import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.className} min-h-screen bg-[#09090b] text-[#fafafa] antialiased selection:bg-red-600/30 selection:text-white overflow-x-hidden w-full relative`}>
        {children}
      </body>
    </html>
  );
}
