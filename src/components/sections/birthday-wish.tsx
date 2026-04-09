"use client"

import React, { useState, useRef, useEffect, memo } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { Heart, X } from "lucide-react"
import NextImage from "next/image"
import { ParticleSystem } from "@/components/ui/particle-system"

// RainHeartComponent and its interface are removed as we use ParticleSystem now.

import { useLenis } from "lenis/react"

export function BirthdayWish() {
    const lenis = useLenis()
    const sectionRef = useRef<HTMLElement>(null)
    const headerRef = useRef<HTMLDivElement>(null)
    const footerHeartRef = useRef<HTMLSpanElement>(null)
    const duckRef = useRef<HTMLSpanElement>(null)
    const bgHeartsRef = useRef<HTMLDivElement>(null)

    // Envelope & Letter Refs
    const envelopeRef = useRef<HTMLDivElement>(null)
    const flapRef = useRef<HTMLDivElement>(null)
    const letterRef = useRef<HTMLDivElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)
    const buttonRef = useRef<HTMLButtonElement>(null)
    const popupRef = useRef<HTMLDivElement>(null)
    const popupContentRef = useRef<HTMLDivElement>(null)

    const [surpriseKey, setSurpriseKey] = useState(0)
    const [explosionCount, setExplosionCount] = useState(0)
    const [isOpened, setIsOpened] = useState(false)
    const [isPulled, setIsPulled] = useState(false)
    const [isPopup, setIsPopup] = useState(false)
    const rainId = useRef(0)

    // Disable scrolling when envelope is open
    useEffect(() => {
        if (isOpened) {
            document.body.classList.add('no-scroll')
            lenis?.stop()
        } else {
            document.body.classList.remove('no-scroll')
            lenis?.start()
        }
        return () => {
            document.body.classList.remove('no-scroll')
            lenis?.start()
        }
    }, [isOpened, lenis])
    

    useGSAP(() => {
        // Entrance animations
        gsap.from(headerRef.current, {
            scrollTrigger: {
                trigger: headerRef.current,
                start: "top 90%",
            },
            opacity: 0,
            y: -20,
            duration: 0.6
        })

        // Initial state for envelope and letter (Starting slightly lower to rise up)
        gsap.set(envelopeRef.current, {
            opacity: 0,
            scale: 0.9,
            y: 50
        })
        gsap.set(letterRef.current, { 
            y: 60, 
            xPercent: -50,
            opacity: 1, 
            scale: 0.95 
        })

        // Scroll-linked Entrance/Exit Animation (Emerging from origin point)
        gsap.to(envelopeRef.current, {
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top bottom",
                end: "top 20%",
                scrub: true,         // Perfect link to scroll speed
                invalidateOnRefresh: true,
            },
            y: 0, // Landing position
            opacity: 1,
            scale: 1,
            ease: "none",
            overwrite: "auto"
        })

        // Continuous animations
        gsap.to(footerHeartRef.current, {
            scale: 1.25,
            duration: 0.8,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        })

        gsap.to(duckRef.current, {
            rotate: 10,
            y: -5,
            duration: 1,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        })

        if (bgHeartsRef.current) {
            const hearts = bgHeartsRef.current.querySelectorAll('.bg-heart')
            hearts.forEach((heart, i) => {
                gsap.to(heart, {
                    y: -20,
                    rotate: 10,
                    duration: 5 + Math.random() * 5,
                    repeat: -1,
                    yoyo: true,
                    delay: i * 0.5,
                    ease: "sine.inOut"
                })
            })
        }
    }, { scope: sectionRef })

    const toggleEnvelope = () => {
        if (isPulled) return

        if (!isOpened) {
            const tl = gsap.timeline({
                onComplete: () => setIsOpened(true)
            })

            // 1. Open flap
            tl.to(flapRef.current, {
                rotateX: 180,
                duration: 0.6,
                zIndex: 5,
                ease: "power2.inOut"
            })

            // 2. Peek letter (Slide up subtly from behind the pocket)
            tl.to(letterRef.current, {
                y: -30,
                scale: 1,
                duration: 0.6,
                ease: "power2.out"
            }, "-=0.2")
        } else {
            const tl = gsap.timeline({
                onComplete: () => setIsOpened(false)
            })

            // 1. Un-peek letter
            tl.to(letterRef.current, {
                y: 60,
                scale: 0.95,
                duration: 0.6,
                ease: "power2.inOut"
            })

            // 2. Close flap
            tl.to(flapRef.current, {
                rotateX: 0,
                duration: 0.6,
                zIndex: 30,
                ease: "power2.inOut"
            }, "-=0.2")
        }
    }

    const handlePull = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (!isOpened || isPulled) return

        setIsPulled(true)

        const tl = gsap.timeline()

        // 1. Pull letter out smoothly
        tl.to(letterRef.current, {
            y: -120,
            scale: 1.1,
            opacity: 0,
            duration: 0.8,
            ease: "power2.inOut",
            onComplete: () => {
                openPopup()
            }
        })
    }

    const openPopup = () => {
        setIsPopup(true)
        // Reset letter visibility for background
        gsap.set(letterRef.current, { opacity: 0 })

        gsap.fromTo(popupRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 0.4 }
        )
        gsap.fromTo(popupContentRef.current,
            { scale: 0.8, opacity: 0, y: 100 },
            { scale: 1, opacity: 1, y: 0, duration: 0.6, ease: "back.out(1.4)" }
        )
    }

    const closePopup = (e: React.MouseEvent) => {
        e.stopPropagation()

        // Start reset immediately so it tucks back during animation
        setIsPulled(false)
        setIsOpened(false)

        const tl = gsap.timeline({
            onComplete: () => {
                setIsPopup(false)
                // Ensure everything is truly reset
                gsap.set(letterRef.current, { y: 60, xPercent: -50, opacity: 1, scale: 0.95 })
                gsap.set(contentRef.current, { opacity: 0 })
            }
        })

        // 1. Exit popup
        tl.to(popupContentRef.current, {
            scale: 0.8,
            opacity: 0,
            y: 50,
            duration: 0.4,
            ease: "power2.in"
        })
            .to(popupRef.current, { opacity: 0, duration: 0.3 }, "-=0.2")

            // 2. Animate letter and flap closing in sync
            .to(letterRef.current, {
                y: 60,
                opacity: 1,
                scale: 0.95,
                duration: 0.5,
                ease: "power2.inOut"
            }, "-=0.3")
            .to(flapRef.current, {
                rotateX: 0,
                duration: 0.6,
                zIndex: 30,
                ease: "power2.inOut"
            }, "-=0.2")
    }

    // Explosion animation
    useGSAP(() => {
        if (explosionCount === 0) return

        const selector = isPopup ? popupContentRef.current : letterRef.current
        const latestExplosion = selector?.querySelector(`.explosion-${explosionCount - 1}`)
        if (latestExplosion) {
            const particles = latestExplosion.querySelectorAll('.particle')
            particles.forEach((p) => {
                gsap.to(p, {
                    x: (Math.random() - 0.5) * 600,
                    y: (Math.random() - 0.5) * 600 - 150,
                    scale: 0,
                    opacity: 0,
                    rotate: Math.random() * 720,
                    duration: 1.5,
                    ease: "power3.out"
                })
            })
        }
    }, { dependencies: [explosionCount], scope: sectionRef })

    const triggerSurprise = (e: React.MouseEvent) => {
        e.stopPropagation()
        setExplosionCount(prev => prev + 1)
        setSurpriseKey(prev => prev + 1)
    }

    const LetterContent = (extraStyles = "") => (
        <div className={`flex flex-col items-center justify-center text-center ${extraStyles}`}>
            <p className="text-xl md:text-3xl text-[#590D22] leading-relaxed italic mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>
                "May this year bring you as much happiness as you bring into my life. May your dreams take flight and your heart always be full. I love you, now and forever."
            </p>

            <div className="relative inline-block">
                {[...Array(explosionCount)].map((_, expIndex) => (
                    <div key={expIndex} className={`absolute inset-0 pointer-events-none explosion-${expIndex}`}>
                        {[...Array(20)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute left-1/2 top-1/2 particle"
                                style={{ color: ["#ff4d6d", "#ff758f", "#f72585"][i % 3] }}
                            >
                                <Heart fill="currentColor" size={12 + Math.random() * 15} />
                            </div>
                        ))}
                    </div>
                ))}

                <button
                    onClick={triggerSurprise}
                    onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.05, duration: 0.2 })}
                    onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, duration: 0.2 })}
                    className="px-8 py-4 bg-gradient-to-b from-[#FFD60A] to-[#FFC300] text-amber-900 font-black rounded-full shadow-xl text-lg md:text-xl flex items-center gap-3 border-b-4 border-[#CC9900] active:scale-95 transition-transform"
                >
                    Yay! Happy Birthday!🤍
                </button>
            </div>
        </div>
    )

    return (
        <section
            ref={sectionRef}
            className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden"
        >
            {/* Background Image - Section 3 (Full Cover) */}
            <div className="absolute inset-0 -z-10 pointer-events-none select-none">
                <NextImage
                    src="/assets/section3.png"
                    alt=""
                    fill
                    className="object-cover"
                    priority={true}
                    unoptimized
                />
            </div>
            {/* Global Heart Rain */}
            {surpriseKey > 0 && (
                <ParticleSystem
                    key={surpriseKey}
                    type="heart"
                    count={40}
                    repeat={0}
                    opacity={0.6}
                    className="z-[260]"
                />
            )}

            {/* Header - Positioned Absolute at Top */}
            <div ref={headerRef} className="absolute top-24 text-center z-10 w-full px-4">
                <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#8B2635] via-[#C9184A] to-[#8B2635] mb-3 py-2 px-2 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                    My Wish For You
                </h2>
                <div className="w-24 h-1 bg-[#FF4D6D]/30 mx-auto rounded-full" />
                {!isOpened && (
                    <p className="mt-4 text-[#8B2635] italic animate-bounce"> Click the envelope baby 💌</p>
                )}
                {isOpened && !isPulled && (
                    <p className="mt-4 text-[#8B2635] italic animate-bounce font-bold">Once again ! ✨</p>
                )}
            </div>

            {/* Interactive Envelope & Letter (The Centered Element) */}
            <div className="relative w-full max-w-[450px] h-[320px] flex items-center justify-center z-20 perspective-1000">
                <div
                    ref={envelopeRef}
                    onClick={toggleEnvelope}
                    onMouseEnter={() => {
                        if (!isOpened) {
                            gsap.to(envelopeRef.current, {
                                scale: 1.05,
                                rotateZ: 2,
                                duration: 0.4,
                                ease: "power2.out"
                            })
                        }
                    }}
                    onMouseLeave={() => {
                        gsap.to(envelopeRef.current, {
                            scale: 1,
                            rotateZ: 0,
                            duration: 0.6,
                            ease: "elastic.out(1, 0.3)"
                        })
                    }}
                    className="relative w-full h-full bg-[#FFB3C1] border-4 border-white rounded-xl shadow-2xl cursor-pointer preserve-3d"
                >
                    {/* Flap */}
                    <div
                        ref={flapRef}
                        className="absolute top-0 left-0 w-full h-[52%] bg-gradient-to-b from-[#FF758F] to-[#FF4D6D] origin-top border-x-[6px] border-t-[6px] border-white/80 rounded-t-2xl z-30 backface-hidden shadow-lg flex items-end justify-center pb-2"
                        style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)", transformStyle: "preserve-3d" }}
                    >
                        {/* Wax Seal / Heart Detail on Flap */}
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/50 shadow-inner translate-y-2">
                            <Heart fill="white" size={24} className="text-white drop-shadow-md" />
                        </div>
                    </div>

                    {/* Letter (Middle layer of the sandwich) */}
                    <div
                        ref={letterRef}
                        onClick={handlePull}
                        className={`absolute left-1/2 top-8 w-[85%] h-[65%] bg-gradient-to-br from-white to-pink-50 rounded-lg shadow-xl z-10 p-6 md:p-10 border-2 border-white flex items-center justify-center transform-gpu ${isPulled ? 'shadow-2xl' : ''} ${isOpened && !isPulled ? 'cursor-pointer hover:bg-pink-100/50' : ''} transition-all duration-300`}
                    >
                        {!isPulled && isOpened && (
                            <div className="flex flex-col items-center gap-2 text-pink-500 font-black opacity-80 animate-pulse">
                                <Heart size={20} fill="currentColor" />
                                <span className="text-[10px] uppercase tracking-[0.2em] text-center leading-tight drop-shadow-sm">Klik me!</span>
                            </div>
                        )}
                        <div ref={contentRef} className="opacity-0 pointer-events-none">
                            {LetterContent("scale-75 md:scale-90")}
                        </div>
                    </div>

                    {/* Pocket Front Covers (Triangles) - Layered In Front of Letter */}
                    {/* Bottom Triangle */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#FFB3C1] to-[#FF4D6D] z-20 rounded-xl pointer-events-none shadow-inner opacity-90" style={{ clipPath: "polygon(0 100%, 50% 50%, 100% 100%)" }} />
                    {/* Left Triangle */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#FFD1DC] to-[#FF85A1] z-15 rounded-xl pointer-events-none opacity-95" style={{ clipPath: "polygon(0 0, 0 100%, 50% 50%)" }} />
                    {/* Right Triangle */}
                    <div className="absolute inset-0 bg-gradient-to-l from-[#FFD1DC] to-[#FF85A1] z-15 rounded-xl pointer-events-none opacity-95" style={{ clipPath: "polygon(100% 0, 100% 100%, 50% 50%)" }} />
                </div>
            </div>

            {/* Full-Screen Popup */}
            {isPopup && (
                <div
                    ref={popupRef}
                    className="absolute inset-0 z-[200] bg-black/40 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
                    onClick={closePopup}
                >
                    <div
                        ref={popupContentRef}
                        className="relative w-full max-w-4xl bg-white rounded-[3rem] shadow-2xl p-10 md:p-20 pt-24 md:pt-32 border-8 border-pink-100 flex flex-col items-center justify-start transform-gpu overflow-y-auto max-h-[90vh]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={closePopup}
                            className="absolute top-6 right-6 p-3 bg-pink-50 text-pink-600 rounded-full hover:bg-pink-100 transition-colors"
                        >
                            <X size={32} />
                        </button>

                        <div className="mb-8 p-4 bg-pink-50 rounded-full">
                            <Heart fill="#FF4D6D" stroke="none" size={48} className="animate-pulse" />
                        </div>

                        {LetterContent()}
                    </div>
                </div>
            )}

            {/* Background Decoration */}
            <div ref={bgHeartsRef} className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute text-[#FFB3C1]/15 bg-heart"
                        style={{
                            left: `${10 + i * 15}%`,
                            top: `${20 + (i % 3) * 20}%`
                        }}
                    >
                        <Heart fill="currentColor" size={40 + (i % 3) * 20} />
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10 w-full px-4 text-center">
                <div className="flex items-center justify-center gap-2 text-[#8B2635] text-lg md:text-xl font-medium" style={{ fontFamily: "'Playfair Display', serif" }}>
                    <span>made with</span>
                    <span ref={footerHeartRef} className="inline-block text-[#FF4D6D]">
                        <Heart fill="currentColor" size={20} />
                    </span>
                    <span>for you</span>
                </div>

                <div className="flex items-center gap-2 text-[#A0304A] font-semibold text-xl md:text-2xl py-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                    <span>happy birthday</span>
                    <span ref={duckRef} className="inline-block">🦆</span>
                </div>
            </div>
        </section>
    )
}
