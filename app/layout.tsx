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
  alternates: {
    canonical: "/",
  },
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

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Dataset",
      "@id": `${siteUrl}/#dataset`,
      name: "Nodal LMP Price Map",
      description:
        "Interactive map of live locational marginal prices (LMP) at every pricing node across major US ISOs, updated every 60 seconds.",
      url: siteUrl,
      creator: {
        "@type": "Organization",
        name: "Kardashev Labs",
        url: "https://kardashevlabs.org",
      },
      keywords: [
        "LMP map",
        "locational marginal price",
        "nodal electricity prices",
        "wholesale electricity prices",
        "energy price map",
      ],
      license: "https://opensource.org/licenses/MIT",
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Nodal LMP Price Map",
      description:
        "Interactive map of live electricity prices at every pricing node across US ISOs. NYISO, ERCOT, MISO, SPP, PJM, CAISO, and ISO-NE.",
      publisher: {
        "@type": "Organization",
        name: "Kardashev Labs",
        url: "https://kardashevlabs.org",
      },
      inLanguage: "en-US",
    },
  ],
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
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
