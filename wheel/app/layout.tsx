import type { Metadata } from "next";
import { Cinzel, Great_Vibes } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  weight: ["500", "700"],
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  variable: "--font-great-vibes",
  weight: "400",
});

export const metadata: Metadata = {
  title: "Style Spinner",
  description: "A themed style spinner.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${greatVibes.variable} h-full antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
