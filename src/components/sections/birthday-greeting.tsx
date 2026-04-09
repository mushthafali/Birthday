"use client"

import { useEffect, useState, useRef } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { Heart, ChevronDown } from "lucide-react"
import { ParticleSystem } from "@/components/ui/particle-system"

export function BirthdayGreeting({ isBack = false }: { isBack?: boolean }) {
    const sectionRef = useRef<HTMLElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)
    const scrollRef = useRef<HTMLDivElement>(null)
    const chevronRef = useRef<HTMLDivElement>(null)

    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    useGSAP(() => {
        if (!mounted) return

        if (isBack) {
            // Skip entrance animations if returning
            gsap.set([contentRef.current, scrollRef.current], { opacity: 1, y: 0 })
        } else {
            // Hero entrance
            gsap.fromTo(contentRef.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, delay: 0.5, duration: 0.8, ease: "power2.out" }
            )

            // Scroll indicator entrance
            gsap.fromTo(scrollRef.current,
                { opacity: 0 },
                { opacity: 1, delay: 1.5, duration: 0.8 }
            )
        }

        // Chevron bounce
        gsap.to(chevronRef.current, {
            y: 10,
            duration: 1.5,
            repeat: -1,
            yoyo: true,
            ease: "power1.inOut"
        })

        // Background transition on scroll
        gsap.to(sectionRef.current, {
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top top",
                end: "bottom center",
                scrub: true,
            },
            backgroundColor: "#FFF0F3"
        })
    }, { scope: sectionRef, dependencies: [mounted] })

    return (
        <section
            ref={sectionRef}
            className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 bg-white"
        >
            {/* Floating hearts background */}
            <ParticleSystem 
                type="heart" 
                count={10} 
                direction="up" 
                opacity={0.3} 
                className="opacity-70"
            />

            {/* Main content */}
            <div ref={contentRef} className="text-center z-10 max-w-4xl opacity-0">
                <div className="mb-6">
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-2 leading-normal" style={{ fontFamily: "'Playfair Display', serif" }}>
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#8B2635] via-[#A0304A] to-[#8B2635] drop-shadow-lg py-4 px-2">
                            Happy Birthday
                        </span>
                    </h1>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-4 italic leading-normal" style={{ fontFamily: "'Playfair Display', serif" }}>
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-pink-500 to-pink-400 drop-shadow-lg py-4 px-4">
                            My Love
                        </span>
                    </h1>

                    <p className="text-2xl md:text-3xl lg:text-4xl font-medium leading-relaxed" style={{ fontFamily: "'Playfair Display', serif" }}>
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#8B2635] via-[#A0304A] to-[#8B2635] py-2 px-2">
                            To the most beautiful soul in the world
                        </span>
                    </p>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div
                ref={scrollRef}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20 opacity-0"
            >
                <p className="text-pink-600/80 font-medium text-lg italic" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Scroll Down
                </p>
                <div ref={chevronRef}>
                    <ChevronDown className="w-8 h-8 text-pink-500/60" strokeWidth={2} />
                </div>
            </div>
        </section>
    )
}
