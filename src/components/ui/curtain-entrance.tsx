"use client"

import React, { useState, useEffect, useRef } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { Heart } from "lucide-react"
import dynamic from "next/dynamic"

import { ParticleSystem } from "./particle-system"

export function CurtainEntrance({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [password, setPassword] = useState("")
    const [showError, setShowError] = useState(false)
    const [isCheckingPassword, setIsCheckingPassword] = useState(false)
    const [isFullyOpen, setIsFullyOpen] = useState(false)

    const containerRef = useRef<HTMLDivElement>(null)
    const leftCurtainRef = useRef<HTMLDivElement>(null)
    const rightCurtainRef = useRef<HTMLDivElement>(null)
    const passwordBoxRef = useRef<HTMLDivElement>(null)
    const heartRef = useRef<HTMLDivElement>(null)
    const sparklesRef = useRef<HTMLDivElement>(null)
    const formRef = useRef<HTMLFormElement>(null)

    const correctPassword = "1210"

    useEffect(() => {
        setMounted(true)
    }, [])

    // continuous animations
    useGSAP(() => {
        if (!heartRef.current || !sparklesRef.current) return

        // Heart pulse
        gsap.to(heartRef.current, {
            scale: 1.1,
            rotate: 5,
            duration: 1,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        })

        // Sparkles rotation
        gsap.to(sparklesRef.current, {
            rotate: 360,
            duration: 20,
            repeat: -1,
            ease: "none"
        })
    }, { scope: containerRef, dependencies: [mounted, isOpen] })

    // Entrance animation
    useGSAP(() => {
        if (!passwordBoxRef.current) return
        gsap.fromTo(passwordBoxRef.current,
            { opacity: 0, scale: 0.8 },
            { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.7)", delay: 0.5 }
        )
    }, { scope: containerRef, dependencies: [mounted] })

    // Curtain opening
    useGSAP(() => {
        if (!isOpen) return

        const tl = gsap.timeline()

        // Fade out password box
        tl.to(passwordBoxRef.current, {
            opacity: 0,
            scale: 0.8,
            duration: 0.5,
            ease: "power2.in"
        })

        // Open curtains
        tl.to(leftCurtainRef.current, {
            x: "-100%",
            duration: 2.5,
            ease: "power4.inOut"
        }, "-=0.2")

        tl.to(rightCurtainRef.current, {
            x: "100%",
            duration: 2.5,
            ease: "power4.inOut",
            onComplete: () => setIsFullyOpen(true)
        }, "<")

        // Dispatch event
        tl.call(() => {
            window.dispatchEvent(new CustomEvent('curtainOpened'))
        }, undefined, "-=2.0")

    }, { dependencies: [isOpen] })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (isCheckingPassword) return

        if (password === correctPassword) {
            setIsCheckingPassword(true)
            setIsOpen(true)
            setShowError(false)
        } else {
            // Shake animation
            setIsCheckingPassword(true)
            setShowError(true)
            gsap.to(formRef.current, {
                x: 10,
                duration: 0.1,
                repeat: 3,
                yoyo: true,
                onComplete: () => {
                    gsap.set(formRef.current, { x: 0 })
                    setIsCheckingPassword(false)
                    setPassword("")
                }
            })
        }
    }

    return (
        <div ref={containerRef}>
            {/* Main Content */}
            <div
                className={`relative z-0 transition-opacity duration-1000 delay-500 ${isOpen ? "opacity-100" : "opacity-0"}`}
                style={{ pointerEvents: isOpen ? "auto" : "none" }}
            >
                {children}
            </div>

            {/* Confetti */}
            {isOpen && !isFullyOpen && (
                <ParticleSystem 
                    type="mixed" 
                    count={80} 
                    repeat={0} 
                    opacity={0.8} 
                    className="z-[100]" 
                />
            )}

            {/* Curtain Overlay */}
            {!isFullyOpen && (
                <div className={`fixed inset-0 z-50 flex items-start justify-center pointer-events-none overflow-hidden`}>

                {/* LEFT CURTAIN */}
                <div
                    ref={leftCurtainRef}
                    className="absolute top-0 left-0 h-full w-1/2 bg-[#720e1e] origin-left z-20 shadow-[10px_0_50px_rgba(0,0,0,0.8)]"
                >
                    <div className="absolute inset-0 w-full h-full opacity-40"
                        style={{ background: "repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(0,0,0,0.5) 45px, rgba(0,0,0,0.2) 80px)" }} />
                </div>

                {/* RIGHT CURTAIN */}
                <div
                    ref={rightCurtainRef}
                    className="absolute top-0 right-0 h-full w-1/2 bg-[#720e1e] origin-right z-20 shadow-[-10px_0_50px_rgba(0,0,0,0.8)]"
                >
                    <div className="absolute inset-0 w-full h-full opacity-40"
                        style={{ background: "repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(0,0,0,0.5) 45px, rgba(0,0,0,0.2) 80px)" }} />
                </div>

                {/* PASSWORD MECHANISM - Center of curtain */}
                {mounted && !isOpen && (
                    <div
                        ref={passwordBoxRef}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-auto flex flex-col items-center gap-6"
                    >
                        {/* Animated Heart Icon */}
                        <div ref={heartRef} className="relative">
                            {/* Glow effect */}
                            <div className="absolute inset-0 blur-2xl bg-pink-500/50 rounded-full scale-150" />

                            {/* Heart */}
                            <div className="relative bg-gradient-to-br from-pink-400 via-pink-500 to-red-500 p-8 rounded-full shadow-2xl">
                                <Heart
                                    className="w-20 h-20 text-white fill-white drop-shadow-lg"
                                />
                            </div>

                            {/* Sparkles */}
                            <div ref={sparklesRef} className="absolute inset-0">
                                {[...Array(6)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="absolute w-2 h-2 bg-white rounded-full"
                                        style={{
                                            top: '50%',
                                            left: '50%',
                                            transform: `rotate(${i * 60}deg) translateY(-60px)`
                                        }}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Password Input Form */}
                        <form
                            ref={formRef}
                            onSubmit={handleSubmit}
                            className="flex flex-col items-center gap-3"
                        >
                            <label className="text-white text-lg font-bold tracking-wide drop-shadow-lg">
                                Masukin Kode Rahasianya yaa Etayaang
                            </label>

                            <input
                                type="text"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="apa yaaa...."
                                maxLength={4}
                                className="w-48 px-6 py-3 text-center text-2xl font-bold tracking-widest rounded-full bg-white/90 backdrop-blur-md border-4 border-pink-300 focus:border-pink-500 focus:outline-none focus:ring-4 focus:ring-pink-500/50 shadow-xl transition-all text-pink-700 placeholder:text-pink-300"
                                autoFocus
                            />

                            <button
                                type="submit"
                                className="mt-2 px-8 py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all"
                            >
                                Enter Password ❤️
                            </button>

                            {showError && (
                                <p className="text-red-300 text-sm font-semibold mt-2 text-center entrance-error">
                                    Kok salahh.....? Kamu gak sayaang aku yaa? 💔
                                </p>
                            )}
                        </form>

                        {/* Hint text */}
                        <p className="text-white/70 text-sm italic mt-4 opacity-0 hint-text">
                            Our Special Day..... Maybe?? 📅
                        </p>
                    </div>
                )}
                </div>
            )}
        </div>
    )
}
