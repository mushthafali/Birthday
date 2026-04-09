"use client"

import { Suspense, useEffect, useState, useRef } from "react"
import { useSearchParams } from "next/navigation"
import gsap from "gsap"
import dynamic from "next/dynamic"
import { BirthdayGreeting } from "@/components/sections/birthday-greeting"

const SurpriseCarousel = dynamic(() => import("@/components/sections/surprise-carousel").then(mod => mod.SurpriseCarousel), {
  ssr: false,
  loading: () => <div className="h-screen bg-[#fffafb]" />
})

const BirthdayWish = dynamic(() => import("@/components/sections/birthday-wish").then(mod => mod.BirthdayWish), {
  ssr: false,
  loading: () => <div className="h-screen bg-pink-50/10" />
})

function HomeContent() {
  const searchParams = useSearchParams()
  const isBack = searchParams.get("back") === "true"
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // 1. Initial Position Setup
    if (isBack) {
      const section2 = document.getElementById("surprise-carousel")
      if (section2) {
        // Instant jump before showing anything
        window.scrollTo({
          top: section2.offsetTop,
          behavior: "instant"
        })
      }
    }

    // 2. Global Fade In
    gsap.fromTo(containerRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 1.2, ease: "power3.out", delay: 0.1 }
    )
  }, [isBack])

  return (
    <main ref={containerRef} className="w-full opacity-0 bg-white">
      <BirthdayGreeting isBack={isBack} />
      <SurpriseCarousel />
      <BirthdayWish />
    </main>
  )
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <HomeContent />
    </Suspense>
  )
}
