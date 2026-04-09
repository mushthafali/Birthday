"use client"

import React, { useState, useEffect, useRef } from "react"
import { X, Heart } from "lucide-react"
import { ThreeDGalleryCarousel } from "./3d-gallery-carousel"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"

interface GalleryLightboxProps {
    images: string[];
    initialIndex: number;
    onClose: () => void;
}

/**
 * GalleryLightbox (Professional Expert Implementation - GSAP Version)
 * Purpose: Isolates the carousel state to prevent parent (GalleryPage) reconciliation.
 * Uses GSAP for entrance/exit to avoid extra dependencies like framer-motion.
 */
export function GalleryLightbox({ images, initialIndex, onClose }: GalleryLightboxProps) {
    const [selectedIndex, setSelectedIndex] = useState(initialIndex)
    const containerRef = useRef<HTMLDivElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)

    // GSAP Entrance Transition
    useGSAP(() => {
        gsap.fromTo(containerRef.current,
            { opacity: 0, backdropFilter: "blur(0px)" },
            { opacity: 1, backdropFilter: "blur(20px)", duration: 0.6, ease: "power2.out" }
        )
    }, { scope: containerRef })

    const handleClose = () => {
        gsap.to(containerRef.current, {
            opacity: 0,
            backdropFilter: "blur(0px)",
            duration: 0.4,
            ease: "power2.in",
            onComplete: onClose
        })
    }

    // Lock body scroll and handle escape key
    useEffect(() => {
        document.body.style.overflow = "hidden"
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") handleClose()
            if (e.key === "ArrowRight") {
                setSelectedIndex(prev => (prev + 1) % images.length)
            }
            if (e.key === "ArrowLeft") {
                setSelectedIndex(prev => (prev - 1 + images.length) % images.length)
            }
        }
        window.addEventListener("keydown", handleKeyDown)
        return () => {
            document.body.style.overflow = "auto"
            window.removeEventListener("keydown", handleKeyDown)
        }
    }, [images.length])

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-[200] bg-[#1a050a]/95 flex items-center justify-center overflow-hidden opacity-0"
            onClick={handleClose}
        >
            {/* 3D Image Carousel - 100% Isolated State */}
            <ThreeDGalleryCarousel
                images={images}
                selectedIndex={selectedIndex}
                onSelect={(i) => setSelectedIndex(i)}
            />

            {/* Close Button UI (Isolated) */}
            <button
                className="absolute top-6 left-6 p-3 md:p-4 bg-white/90 hover:bg-pink-500 rounded-full transition-all text-pink-600 hover:text-white z-[210] hover:scale-110 active:scale-95 shadow-2xl border-2 border-white/50 hover:border-pink-400"
                onClick={(e) => { e.stopPropagation(); handleClose(); }}
            >
                <X className="w-6 h-6 md:w-8 md:h-8" />
            </button>

            {/* Counter UI (Isolated) */}
            <div
                className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/95 font-bold tracking-[0.4em] text-2xl z-[210] flex flex-col items-center gap-2 pointer-events-none"
                style={{ fontFamily: "'Playfair Display', serif" }}
            >
                <div className="flex items-center gap-6 bg-white/5 backdrop-blur-md px-10 py-4 rounded-full border border-white/10 shadow-2xl">
                    <span className="text-pink-400 drop-shadow-[0_0_10px_rgba(255,77,109,0.5)]">
                        {(selectedIndex + 1).toString().padStart(2, '0')}
                    </span>
                    <div className="w-8 h-[1px] bg-white/20" />
                    <span className="opacity-40">{images.length.toString().padStart(2, '0')}</span>
                </div>
                <span className="text-[10px] uppercase tracking-[0.5em] opacity-40">Our Cherished Memories</span>
            </div>
        </div>
    )
}
