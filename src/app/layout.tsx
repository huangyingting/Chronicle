import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "Chronicle — Every great presenter has a secret",
  description:
    "AI-native storytelling and presentation platform. Create board-ready decks, interactive smart widgets, and brand-governed slides in seconds."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#0b0b10] text-[#f4f4f6] selection:bg-violet-500/30 selection:text-violet-200">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
