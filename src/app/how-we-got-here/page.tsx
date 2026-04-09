"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, ChevronLeft, ChevronRight, Heart, RefreshCcw, Camera, MessageCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// --- Data Structure ---
const papers = [
    {
        id: "cover",
        type: "cover",
        title: "How We Got Here",
        subtitle: "From being just classmates… to becoming each other’s home.",
        bgColor: "#fffcf7"
    },
    {
        id: "beginning",
        title: "The Beginning",
        text: [
            "We were just classmates back then, and I never thought you would mean this much to me.",
            "It started with something simple… a moment I didn’t expect to matter so much."
        ],
        image: "/assets/1775742243411.jpg",
        rotation: -2
    },
    {
        id: "distance",
        title: "Distance",
        text: [
            "Then the world stopped… and so did our chances to meet.",
            "Distance kept us apart, but somehow… you never left my mind."
        ],
        isChat: true,
        rotation: 1
    },
    {
        id: "still-there",
        title: "Still There",
        text: [
            "Years passed, yet my feelings for you never faded.",
            "No matter how far life took us, a part of me was always with you."
        ],
        emphasized: true,
        rotation: -1
    },
    {
        id: "reconnect",
        title: "Reconnect",
        text: [
            "And then, somehow… we found our way back to each other.",
            "What started as simple conversations slowly became something more."
        ],
        images: ["/assets/1707585502925.jpg", "/assets/1708168563897.jpg"],
        extra: "The first PAPs she ever sent me.",
        rotation: 2
    },
    {
        id: "first-love",
        title: "The First Time",
        text: [
            "For the first time, I called you ‘my love’… and I meant every word."
        ],
        largeText: true,
        rotation: -2
    },
    {
        id: "meeting",
        title: "The Meeting",
        text: [
            "After all the waiting, I finally saw you again.",
            "A moment that felt both new… and strangely familiar."
        ],
        image: "/assets/1753637571890.jpg",
        rotation: 3
    },
    {
        id: "date",
        title: "The Date",
        text: [
            "Our first day together, our first memories captured.",
            "Somewhere between laughter and silence… we fell in love."
        ],
        extra: "Watching 'SORE' - our first movie date.",
        image: "/gallery/After Looong Time/landscape_1.webp",
        rotation: -1
    },
    {
        id: "now",
        title: "Now",
        text: [
            "And here we are… still choosing each other, every single day.",
            "This isn’t the end of our story — it’s just the beginning."
        ],
        image: "/assets/now_latest.webp",
        rotation: 2
    },
    {
        id: "closing",
        type: "closing",
        title: "Ever After",
        text: ["If I could go back to the beginning… I would still choose you, every time."],
        bgColor: "#1a0b0b"
    }
]

// --- Decorative Components ---
const FloatingElements = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(12)].map((_, i) => (
            <motion.div
                key={i}
                initial={{
                    x: Math.random() * 100 + "%",
                    y: Math.random() * 100 + "%",
                    rotate: Math.random() * 360,
                    opacity: 0
                }}
                animate={{
                    y: [null, "-120%"],
                    rotate: [null, Math.random() * 720],
                    opacity: [0, 0.4, 0]
                }}
                transition={{
                    duration: 15 + Math.random() * 20,
                    repeat: Infinity,
                    ease: "linear",
                    delay: Math.random() * 20
                }}
                className="absolute"
            >
                {i % 3 === 0 ? (
                    <Heart className="w-4 h-4 text-pink-200 fill-current" />
                ) : (
                    <div className="w-2 h-2 rounded-full bg-pink-100/40 blur-[1px]" />
                )}
            </motion.div>
        ))}
    </div>
)

const HeartSticker = () => (
    <div className="absolute -top-4 -right-4 z-50 transform rotate-12 drop-shadow-md">
        <div className="bg-pink-400 p-2 rounded-lg rotate-3">
            <Heart className="w-6 h-6 text-white fill-current" />
        </div>
        <div className="absolute inset-0 bg-white/20 rounded-lg -z-10 blur-sm" />
    </div>
)

const Squiggle = () => (
    <svg className="absolute -bottom-6 -left-4 w-24 h-8 text-pink-200/40 opacity-50" viewBox="0 0 100 20">
        <path d="M0,10 Q25,0 50,10 T100,10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
)

export default function HowWeGotHerePage() {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [direction, setDirection] = useState(0) // 1 for next, -1 for prev

    const nextCard = () => {
        if (currentIndex < papers.length - 1) {
            setDirection(1)
            setCurrentIndex(prev => prev + 1)
        }
    }

    const prevCard = () => {
        if (currentIndex > 0) {
            setDirection(-1)
            setCurrentIndex(prev => prev - 1)
        }
    }

    const resetStory = () => {
        setDirection(-1)
        setCurrentIndex(0)
    }

    // Handle Keyboard Navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight") nextCard()
            if (e.key === "ArrowLeft") prevCard()
        }
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [currentIndex])

    return (
        <main className="min-h-screen bg-[#fdfcf7] flex items-center justify-center p-4 overflow-hidden relative selection:bg-pink-100 selection:text-pink-600">

            {/* Background Texture & Ornaments */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none z-0" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/paper-fibers.png')" }} />
            <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-pink-100/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-orange-100/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

            <FloatingElements />

            {/* Back Navigation */}
            <div className="absolute top-8 left-8 z-50">
                <Link
                    href="/?back=true"
                    className="flex items-center gap-2 px-6 py-3 bg-white/60 backdrop-blur-md rounded-full border border-black/5 hover:bg-white transition-all active:scale-95 group shadow-sm"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-black/60">Story Explorer</span>
                </Link>
            </div>

            {/* Paper Stack Container */}
            <div className="relative w-full max-w-lg aspect-[3/4.2] md:aspect-[3/4] perspective-1000">

                <AnimatePresence mode="popLayout" custom={direction}>
                    <motion.div
                        key={currentIndex}
                        custom={direction}
                        initial={{
                            x: direction > 0 ? 500 : -500,
                            rotate: direction > 0 ? 15 : -15,
                            opacity: 0,
                            scale: 0.9
                        }}
                        animate={{
                            x: 0,
                            rotate: papers[currentIndex].rotation || 0,
                            opacity: 1,
                            scale: 1,
                            zIndex: 10
                        }}
                        exit={{
                            x: direction > 0 ? -500 : 500,
                            rotate: direction > 0 ? -15 : 15,
                            opacity: 0,
                            scale: 0.9,
                            zIndex: 0
                        }}
                        transition={{
                            type: "spring",
                            stiffness: 260,
                            damping: 25
                        }}
                        className={`absolute inset-0 w-full h-full shadow-[0_30px_60px_-12px_rgba(50,50,93,0.15),0_18px_36px_-18px_rgba(0,0,0,0.2)] rounded-3xl p-8 md:p-12 border border-black/5 flex flex-col justify-center gap-8 ${papers[currentIndex].bgColor === "#1a0b0b" ? "bg-[#1a0b0b] text-white" : "bg-white text-black"}`}
                        style={{ cursor: "default" }}
                    >
                        {/* Decorative Corner Ornament */}
                        {currentIndex % 2 === 0 && <HeartSticker />}
                        <Squiggle />

                        {/* Card Content Logic */}
                        {papers[currentIndex].type === "cover" ? (
                            <div className="text-center space-y-8 relative">
                                <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-20">
                                    <Heart className="w-24 h-24 text-pink-200 fill-current" />
                                </div>
                                <Heart className="w-12 h-12 text-pink-500 mx-auto fill-current animate-pulse relative z-10" />
                                <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter relative z-10 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                                    How We <br /> <span className="text-pink-500">Got Here</span>
                                </h1>
                                <p className="text-xs md:text-sm text-black/50 font-medium leading-relaxed max-w-[250px] mx-auto">
                                    {papers[currentIndex].subtitle}
                                </p>
                                <button
                                    onClick={nextCard}
                                    className="px-10 py-4 bg-pink-500 hover:bg-pink-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_10px_20px_rgba(236,72,153,0.3)]"
                                >
                                    Begin the Story
                                </button>
                            </div>
                        ) : papers[currentIndex].type === "closing" ? (
                            <div className="text-center space-y-12">
                                <div className="text-3xl md:text-4xl text-pink-500 font-serif italic leading-tight px-4">
                                    "{papers[currentIndex].text?.[0]}"
                                </div>
                                <div className="space-y-6">
                                    <button
                                        onClick={resetStory}
                                        className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] bg-white/10 hover:bg-white/20 px-6 py-2 rounded-full transition-all"
                                    >
                                        <RefreshCcw className="w-3 h-3" />
                                        Replay Story
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-between py-2 relative">
                                <div className="w-full space-y-3 md:space-y-6">
                                    <div className="flex items-center justify-between text-[8px] md:text-[10px] font-black uppercase tracking-widest text-black/20">
                                        <span>Part {currentIndex + 1}</span>
                                        <div className="flex gap-1">
                                            <Heart className="w-2 h-2 fill-current" />
                                            <Heart className="w-2 h-2 fill-current" />
                                        </div>
                                    </div>
                                    <h2 className="text-2xl md:text-4xl font-bold italic text-[#2d2424]" style={{ fontFamily: "'Playfair Display', serif" }}>
                                        {papers[currentIndex].title}
                                    </h2>
                                    <div className={`space-y-3 ${papers[currentIndex].largeText ? 'text-xl md:text-3xl font-serif italic text-pink-600 leading-tight' : 'text-xs md:text-base text-black/70 leading-relaxed font-medium'}`}>
                                        {papers[currentIndex].text?.map((t, i) => (
                                            <p key={i}>{t}</p>
                                        ))}
                                    </div>
                                </div>

                                {/* Media Support */}
                                <div className="w-full flex-grow flex items-center justify-center mt-4">
                                    {papers[currentIndex].images ? (
                                        <div className="flex gap-4 w-full h-full p-2 relative">
                                            {/* Tape Ornament */}
                                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-12 h-3 bg-white/40 border border-white/20 -rotate-3 z-50 backdrop-blur-sm" />

                                            {papers[currentIndex].images?.map((img, i) => (
                                                <div key={i} className={`relative flex-1 aspect-[3/4] rounded-2xl overflow-hidden shadow-xl border-4 border-white transform ${i % 2 === 0 ? '-rotate-3 translate-y-2' : 'rotate-3'}`}>
                                                    <Image src={img} alt="" fill className="object-cover" />
                                                </div>
                                            ))}
                                        </div>
                                    ) : papers[currentIndex].image ? (
                                        <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-xl border-4 md:border-8 border-white group">
                                            <Image src={papers[currentIndex].image!} alt="" fill className="object-cover transition-transform duration-1000 group-hover:scale-110" />
                                            <div className="absolute bottom-4 right-4 bg-black/20 backdrop-blur-md p-2 rounded-xl">
                                                <Camera className="w-4 h-4 text-white" />
                                            </div>
                                        </div>
                                    ) : papers[currentIndex].isChat ? (
                                        <div className="w-full p-6 md:p-8 bg-pink-50/50 rounded-3xl border border-pink-100/50 flex flex-col items-center gap-4 text-center">
                                            <MessageCircle className="w-6 h-6 md:w-8 h-8 text-pink-400 opacity-50" />
                                            <p className="text-[10px] md:text-sm italic text-pink-600 font-medium leading-relaxed">
                                                "Separated by walls, connected by the invisible threads of our conversation."
                                            </p>
                                        </div>
                                    ) : (
                                        /* Decorative Doodle for pages without media */
                                        <div className="opacity-10 scale-125">
                                            <Heart className="w-20 h-20 text-pink-500 fill-current" />
                                        </div>
                                    )}
                                </div>

                                {papers[currentIndex].extra && (
                                    <div className="w-full pt-4 text-[8px] font-black uppercase tracking-[0.4em] text-pink-400 opacity-60 text-center italic">
                                        {papers[currentIndex].extra}
                                    </div>
                                )}
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>

                {/* Background Stacks (Visual Illusion) */}
                <div className="absolute inset-0 translate-x-3 translate-y-3 -rotate-2 bg-white/70 rounded-3xl -z-10 border border-black/5 shadow-sm" />
                <div className="absolute inset-0 -translate-x-2 translate-y-6 rotate-3 bg-white/50 rounded-3xl -z-20 border border-black/5 shadow-sm" />
            </div>

            {/* Navigation Controls */}
            <div className="absolute bottom-6 md:bottom-10 flex flex-col items-center gap-6 z-50">
                <div className="flex items-center gap-8 md:gap-12">
                    <button
                        onClick={prevCard}
                        disabled={currentIndex === 0}
                        className={`p-4 md:p-5 rounded-full border border-black/5 transition-all ${currentIndex === 0 ? 'opacity-0 scale-50 pointer-events-none' : 'bg-white shadow-xl hover:scale-110 active:scale-95 group'}`}
                    >
                        <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 group-hover:-translate-x-1 transition-transform" />
                    </button>

                    <div className="flex flex-col items-center">
                        <div className="text-[8px] md:text-[10px] font-black tracking-[0.5em] text-black/20 uppercase mb-2">
                            Memory {currentIndex + 1} / {papers.length}
                        </div>
                        <div className="flex gap-1 md:gap-1.5">
                            {papers.map((_, i) => (
                                <div
                                    key={i}
                                    className={`w-1 h-1 md:w-1.5 md:h-1.5 rounded-full transition-all duration-500 ${i === currentIndex ? 'bg-pink-400 w-3 md:w-4' : 'bg-black/10'}`}
                                />
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={nextCard}
                        disabled={currentIndex === papers.length - 1}
                        className={`p-4 md:p-5 rounded-full border border-black/5 transition-all ${currentIndex === papers.length - 1 ? 'opacity-0 scale-50 pointer-events-none' : 'bg-white shadow-xl hover:scale-110 active:scale-95 group'}`}
                    >
                        <ChevronRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>

            <style>{`
                .perspective-1000 {
                    perspective: 1500px;
                }
            `}</style>

        </main>
    )
}
