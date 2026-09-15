import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Resuma — Lightweight Production Resume Builder",
  description:
    "Build ATS-friendly, beautifully designed resumes in minutes. Reorder sections with drag-and-drop, export high-fidelity PDFs, and share your work.",
  keywords: ["resume builder", "ats resume", "software engineer cv", "free resume maker"],
  authors: [{ name: "Resuma" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="min-h-screen bg-[#09090b] text-[#fafafa] antialiased selection:bg-red-600/30 selection:text-white">
        {children}
      </body>
    </html>
  );
}
