import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trailblaze Construction",
  description: "Built on experience. Driven by integrity.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
