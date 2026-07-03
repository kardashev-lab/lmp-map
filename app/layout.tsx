import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://lmp-map.kardashevlabs.org";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Nodal LMP Price Map | Kardashev Labs",
  description:
    "Interactive map of live electricity prices at every pricing node across US ISOs. NYISO, ERCOT, MISO, SPP, and CAISO. Prices update every 60 seconds.",
  keywords: [
    "LMP map", "locational marginal price map", "nodal electricity prices",
    "real-time electricity prices", "NYISO LMP", "ERCOT LMP", "MISO LMP",
    "CAISO LMP", "SPP LMP", "wholesale electricity prices", "energy price map",
    "Kardashev Labs",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Nodal LMP Price Map | Kardashev Labs",
    description: "Live electricity prices at every pricing node across US ISOs, updated every 60 seconds.",
    url: siteUrl,
    siteName: "Kardashev Labs",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nodal LMP Price Map | Kardashev Labs",
    description: "Live electricity prices at every pricing node across US ISOs, updated every 60 seconds.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
