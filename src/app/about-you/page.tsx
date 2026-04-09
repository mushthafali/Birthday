"use client"

import React, { useState, useEffect, useRef, useMemo } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { Draggable } from "gsap/all"
import { ArrowLeft, Heart } from "lucide-react"
import Link from "next/link"
import { ParticleSystem } from "@/components/ui/particle-system"

const words = [
    "innocent", "mischievous", "funny", "adorable", "beautiful",
    "smart", "clever", "character", "behavior", "personality",
    "independent", "warm", "gentle", "loving", "kind",
    "thoughtful", "brave", "graceful", "pure", "loyal",
    "sweet", "charming", "brilliant", "unique", "perfect",
    "wonderful", "radiant", "cheerful", "creative", "patient",
    "strong", "humble", "honest", "joyful", "elegant",
    "vibrant", "energetic", "peaceful", "dreamy", "magical",
    "inspired", "precious", "heavenly", "stunning", "divine",
    "sparkling", "golden", "angelic", "fearless", "balanced",
    "nurturing", "witty", "spirited", "captivating", "delightful",
    "compassionate", "breathtaking", "enchanting", "magnificent", "luminous",
    "soulful", "resilient", "charismatic", "intuitive", "empathetic",
    "limitless", "authentic", "genuine", "brave-hearted", "kind-hearted",
    "warm-hearted", "open-minded", "positive", "optimistic", "encouraging",
    "supportive", "empowering", "inspiring", "motivating", "vivid",
    "classic", "timeless", "ethereal", "serene", "calm",
    "composed", "artistic", "musical", "poetic", "romantic",
    "ambitious", "determined", "consistent", "growing", "evolving",
    "precious", "unforgettable", "irreplaceable", "spectacular", "majestic",
    "dynamic", "bold", "fearless", "heart-warming", "soul-stirring"
]

// RainHeartComponent and its logic are removed as we use unified ParticleSystem.

export default function AboutYouPage() {
    const containerRef = useRef<HTMLDivElement>(null)
    // Hearts generated only on client via ParticleSystem.


    useGSAP(() => {
        gsap.from(".about-header", { opacity: 0, y: -20, duration: 0.8, ease: "power2.out" })
    }, { scope: containerRef })

    return (
        <main ref={containerRef} className="min-h-screen bg-[#FFF0F3] py-12 px-4 md:px-8 relative overflow-hidden flex flex-col items-center">
            {/* Background Heart Rain */}
            <ParticleSystem 
                type="heart" 
                count={30} 
                direction="down" 
                opacity={0.3} 
            />

            {/* Back Home Button */}
            <Link href="/?back=true" className="fixed top-6 left-6 z-[120]">
                <button
                    className="flex items-center gap-2 px-5 py-2.5 bg-white/80 backdrop-blur-md text-pink-600 font-bold rounded-full shadow-lg border border-pink-100 transition-all hover:bg-white hover:scale-105 active:scale-95"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="hidden md:inline">Back Home</span>
                </button>
            </Link>

            {/* Header */}
            <div className="max-w-7xl w-full mb-16 relative z-10 about-header">
                <div className="flex flex-col items-center gap-4 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#590D22] via-[#C9184A] to-[#590D22] drop-shadow-sm" style={{ fontFamily: "'Playfair Display', serif" }}>
                        Things I Love About You
                    </h1>

                    <div className="flex items-center gap-3">
                        <div className="h-[2px] w-12 bg-[#FF4D6D]/30 rounded-full" />
                        <Heart className="text-[#FF4D6D] w-5 h-5 animate-pulse" fill="currentColor" />
                        <div className="h-[2px] w-12 bg-[#FF4D6D]/30 rounded-full" />
                    </div>
                </div>
            </div>

            {/* Word Globe Section */}
            <div className="flex-1 w-full max-w-5xl relative flex items-center justify-center min-h-[600px] z-10">
                <WordGlobe />
            </div>
        </main>
    )
}

function WordGlobe() {
    const globeRef = useRef<HTMLDivElement>(null)
    const rotX = useRef(0)
    const rotY = useRef(0)
    const mouseX = useRef(0)
    const mouseY = useRef(0)

    // Quick setters for performance
    const wordRefs = useRef<(HTMLDivElement | null)[]>([])

    useGSAP(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.current = (e.clientX / window.innerWidth - 0.5) * 2
            mouseY.current = (e.clientY / window.innerHeight - 0.5) * 2
        }
        window.addEventListener("mousemove", handleMouseMove)

        // Ticker for smooth rotation
        const ticker = () => {
            rotX.current += 0.005 + mouseY.current * 0.01
            rotY.current += 0.01 + mouseX.current * 0.01

            wordRefs.current.forEach((el, i) => {
                if (!el) return

                const total = words.length
                const phi = Math.acos(-1 + (2 * i) / total)
                const theta = Math.sqrt(total * Math.PI) * phi
                const isMobile = window.innerWidth < 768
                const baseRadius = isMobile ? 160 : 350
                const radius = baseRadius + (Math.sin(i * 0.5) * 15)

                let x = radius * Math.sin(phi) * Math.cos(theta)
                let y = radius * Math.sin(phi) * Math.sin(theta)
                let z = radius * Math.cos(phi)

                // Apply rotation
                const cosY = Math.cos(rotY.current)
                const sinY = Math.sin(rotY.current)
                const x1 = x * cosY - z * sinY
                const z1 = x * sinY + z * cosY

                const cosX = Math.cos(rotX.current)
                const sinX = Math.sin(rotX.current)
                const y1 = y * cosX - z1 * sinX
                const z2 = y * sinX + z1 * cosX

                const depth = (z2 + radius) / (radius * 2)
                const scale = 0.6 + depth * 0.6
                const opacity = 0.1 + depth * 0.9
                const blur = Math.max(0, (1 - depth) * 2)

                gsap.set(el, {
                    x: x1,
                    y: y1,
                    zIndex: Math.round(z2 + radius),
                    scale: scale,
                    opacity: opacity,
                    filter: `blur(${blur}px)`
                })
            })
        }

        gsap.ticker.add(ticker)

        // Draggable for manual rotation
        const d = Draggable.create(document.createElement('div'), { // Proxy element for dragging
            trigger: globeRef.current,
            onDrag: function () {
                rotY.current += this.deltaX * 0.01
                rotX.current -= this.deltaY * 0.01
            }
        })

        return () => {
            window.removeEventListener("mousemove", handleMouseMove)
            gsap.ticker.remove(ticker)
            if (d[0]) d[0].kill()
        }
    }, [])

    return (
        <div
            ref={globeRef}
            className="relative w-[300px] h-[300px] md:w-[800px] md:h-[800px] cursor-grab active:cursor-grabbing transform-gpu"
        >
            {words.map((word, i) => (
                <div
                    key={i}
                    ref={el => { wordRefs.current[i] = el }}
                    className="absolute left-1/2 top-1/2 select-none group"
                >
                    <span
                        className="text-sm md:text-xl font-bold whitespace-nowrap drop-shadow-sm text-[#8B2635] hover:text-[#FF4D6D] hover:scale-150 transition-all duration-200 block"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        {word}
                    </span>
                </div>
            ))}
        </div>
    )
}
