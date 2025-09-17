import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist( {
  variable: "--font-geist-sans",
  subsets: [ "latin" ],
} );

const geistMono = Geist_Mono( {
  variable: "--font-geist-mono",
  subsets: [ "latin" ],
} );

export const metadata: Metadata = {
  title: "Health tracker",
  description: "Track your health metrics locally and privately.",
};

export default function RootLayout( {
  children,
}: Readonly<{
  children: React.ReactNode;
}> ) {
  return (
    <html lang="en">
      <body
        className={ `${geistSans.variable} ${geistMono.variable} antialiased` }
      >
        <div className="min-h-screen">
          { children }
        </div>
        <footer className="m-4 text-center text-white/60">Made for <a href="https://github.com/deependujha" target="_blank" className="hover:underline hover:text-white">Deependu</a>. local, private, and tweakable.</footer>
      </body>
    </html>
  );
}
