import type { Metadata } from "next";
import "./globals.css";
import { poppins } from "@/src/utilities";

export const metadata: Metadata = {
  title: "Portfolio | Sahil Lokhande",
  description: "Software developer based in Pune, india",
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
