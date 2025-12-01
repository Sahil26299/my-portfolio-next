import type { Metadata } from "next";
import "./globals.css";
import { poppins } from "@/src/utilities";

export const metadata: Metadata = {
  title: "Portfolio | Sahil Lokhande",
  description: "Software developer based in Pune, india.",
  openGraph: {
    title: "Portfolio | Sahil Lokhande",
    description:
      "Software developer based in Pune, india.",
    type: "website",
    locale: "en_US",
    siteName: "Portfolio | Sahil Lokhande",

    // Ideal OG image size: 1200×630
    images: [
      {
        url: "https://my-portfolio-next-mauve.vercel.app/images/appImageBg.png",
        width: 1200,
        height: 630,
        alt: "Portfolio | Sahil Lokhande Background Image",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Portfolio | Sahil Lokhande",
    description:
      "Software developer based in Pune, india.",
    images: ["https://my-portfolio-next-mauve.vercel.app/images/appImageBg.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.className}`}>{children}</body>
    </html>
  );
}
