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

export const metadata: Metadata = {
  title: "Codura - Master Technical Interviews",
  description: "Practice coding problems, conduct mock interviews, and compete with peers from your university. Build the skills that land you the job.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
         <link rel="preconnect" href="https://rsms.me/" />
         <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
         <link rel="preconnect" href="https://fonts.bunny.net" />
         <link rel="stylesheet" href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700" />
      </head>
      
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden`}
      >
        {children}
      </body>
    </html>
  );
}