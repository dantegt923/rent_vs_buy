import type { Metadata } from "next";
import { IBM_Plex_Serif, Inter } from "next/font/google";
import "./globals.css";

const sans = Inter({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-sans",
});

const serif = IBM_Plex_Serif({
  weight: ["400", "600"],
  subsets: ["latin"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "Rent vs. Buy Calculator",
  description:
    "Compare renting versus buying over a long-term horizon with break-even timing and cost-adjusted outcomes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${sans.variable} ${serif.variable} font-sans tool-surface`}>
        {children}
      </body>
    </html>
  );
}
