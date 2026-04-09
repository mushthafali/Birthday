"use client";

import dynamic from "next/dynamic";
import "./globals.css";

const CurtainEntrance = dynamic(() => import("@/components/ui/curtain-entrance").then(mod => mod.CurtainEntrance), {
  ssr: false,
});

const MusicPlayer = dynamic(() => import("@/components/ui/music-player").then(mod => mod.MusicPlayer), {
  ssr: false,
});

import { Nunito, Varela_Round, Playfair_Display } from "next/font/google";
import { ReactLenis } from "lenis/react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger, Draggable, Flip } from "gsap/all";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger, Draggable, Flip);
}

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "700", "800"],
  display: 'swap',
});

const varelaRound = Varela_Round({
  variable: "--font-varela-round",
  subsets: ["latin"],
  weight: "400",
  display: 'swap',
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: 'swap',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${nunito.variable} ${varelaRound.variable} ${playfairDisplay.variable} antialiased min-h-screen bg-background font-sans`}
        suppressHydrationWarning
      >
        <ReactLenis root>
          <MusicPlayer />
          <CurtainEntrance>
            <div className="flex-1">{children}</div>
          </CurtainEntrance>
        </ReactLenis>
      </body>
    </html>
  );
}
