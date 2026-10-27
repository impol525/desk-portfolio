import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "John Ray G. Hermocilla | Developer portfolio",
  description:
    "John Ray G. Hermocilla, 4th-year BSIT student (Web System Technology) at NEUST Atate Campus. Explore his projects, skills and contact details on an interactive 3D desk.",
};

export const viewport: Viewport = {
  themeColor: "#0d1020",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}