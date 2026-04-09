"use client"

import React, { useMemo, memo, useRef, useState, useEffect } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ChevronLeft, ChevronRight } from "lucide-react"

import NextImage from "next/image"

const BLANK_PIXEL = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"

// -------------------------------------------------------------------------------------------------
// CarouselSlide: ULTRA-PERFORMANCE PERSISTENT ATOM
// Optimized for Zero-Lag Hover and High-End 60fps Stability.
// -------------------------------------------------------------------------------------------------
const CarouselSlide = memo(({
    src,
    index,
    totalCount,
    activeIndex,
    onClick
}: {
    src: string;
    index: number;
    totalCount: number;
    activeIndex: number;
    onClick: (index: number) => void;
}) => {
    const [isDecoded, setIsDecoded] = useState(false);
    const slideRef = useRef<HTMLDivElement>(null);
    const photoContainerRef = useRef<HTMLDivElement>(null);

    // 1. Position Logic
    const relativeIndex = useMemo(() => {
        let diff = index - activeIndex
        if (diff > totalCount / 2) diff -= totalCount
        if (diff < -totalCount / 2) diff += totalCount
        return diff
    }, [index, activeIndex, totalCount])

    const isCenter = relativeIndex === 0
    // REDUCED VRAM WINDOW: From 10 to 5 for better memory performance
    const isWithinVramWindow = Math.abs(relativeIndex) <= 5

    // 2. Hardware-Level Texture Upload
    useEffect(() => {
        if (!src || !isWithinVramWindow) {
            setIsDecoded(false);
            return;
        }

        let isMounted = true;
        const img = new Image();

        img.onload = () => {
            if (!isMounted) return;
            setIsDecoded(true);
        };

        img.src = src;

        if ('decode' in img) {
            img.decode()
                .then(() => {
                    if (isMounted) setIsDecoded(true);
                })
                .catch(() => { });
        }

        return () => {
            isMounted = false;
            img.onload = null;
        };
    }, [src, isWithinVramWindow]);

    /**
     * GSAP MIRROR-HOVER ENGINE (Anti-Lag Solution)
     * We use GSAP to handle hover scaling instead of CSS transitions.
     * This ensures the hover effect is hardware-synchronized with the 3D engine.
     */
    const handleHover = (entering: boolean) => {
        if (!isCenter || !photoContainerRef.current) return;

        gsap.to(photoContainerRef.current, {
            scale: entering ? 1.05 : 1,
            duration: 0.4,
            ease: "power2.out",
            overwrite: "auto",
            // Enhance shadow on hover for premium feel
            boxShadow: entering
                ? '0 80px 150px -30px rgba(0,0,0,0.7)'
                : '0 50px 100px -20px rgba(0,0,0,0.5)',
            force3D: true
        });
    }

    const filename = src.toLowerCase().split('/').pop() || ""
    const isLandscape = filename.includes('landscape') ||
        filename.includes('landsacpe') ||
        filename.startsWith('1.')
    const frameSrc = isLandscape ? "/assets/frame-landscape-v2.png" : "/assets/frame-portrait-v2.png"

    return (
        <div
            ref={slideRef}
            data-slide-index={index}
            className="carousel-slide-node absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 invisible"
            style={{
                willChange: 'transform, opacity',
                backfaceVisibility: 'hidden',
                transformStyle: 'preserve-3d'
            }}
            onClick={(e) => {
                e.stopPropagation()
                if (!isCenter) onClick(index)
            }}
            onMouseEnter={() => handleHover(true)}
            onMouseLeave={() => handleHover(false)}
        >
            <div
                ref={photoContainerRef}
                className={`relative flex items-center justify-center preserve-3d backface-hidden ${isLandscape
                    ? "w-[1000px] h-[750px] max-w-[85vw] max-h-[60vh] md:max-w-[95vw] md:max-h-[80vh]"
                    : "w-[680px] h-[1000px] max-w-[75vw] max-h-[75vh] md:max-w-[85vw] md:max-h-[85vh]"}`}
                style={{
                    aspectRatio: isLandscape ? '1000/750' : '680/1000',
                    boxShadow: (isWithinVramWindow && isDecoded) ? '0 50px 100px -20px rgba(0,0,0,0.5)' : 'none',
                    borderRadius: '20px',
                    // REMOVED CSS transition to prevent contention
                }}
            >
                {/* Photo Layer - Uses responsive percentages instead of fixed pixels */}
                <div className={isLandscape ? "relative w-[87.5%] h-[86%]" : "relative w-[80.8%] h-[75%]"}>
                    {isWithinVramWindow && (
                        <NextImage
                            src={src}
                            alt=""
                            fill
                            sizes={isLandscape ? "1000px" : "680px"}
                            priority={isCenter}
                            className={`object-cover rounded-[10px] transition-opacity duration-600 ${isDecoded ? "opacity-100" : "opacity-0"}`}
                            onLoad={() => setIsDecoded(true)}
                        />
                    )}
                </div>

                {/* Frame Layer - Uses responsive offsets */}
                <div
                    className={`absolute inset-0 pointer-events-none z-10 ${isLandscape ? "left-[3%]" : "left-[3.5%]"}`}
                    style={{
                        opacity: (isWithinVramWindow && isDecoded) ? 1 : 0,
                        transition: 'opacity 0.6s ease-in-out'
                    }}
                >
                    <NextImage
                        src={frameSrc}
                        alt=""
                        fill
                        className="object-contain"
                        sizes="(max-width: 1000px) 100vw, 1000px"
                    />
                </div>
            </div>
        </div>
    )
})
CarouselSlide.displayName = "CarouselSlide"

// -------------------------------------------------------------------------------------------------
// ThreeDGalleryCarousel: EXPERT ZERO-LAG ENGINE
// Features: Frustum Culling, VRAM Recovery, GSAP-Synchronized Interactions.
// -------------------------------------------------------------------------------------------------
export function ThreeDGalleryCarousel({ images, selectedIndex, onSelect }: {
    images: string[];
    selectedIndex: number;
    onSelect: (index: number) => void;
}) {
    const containerRef = useRef<HTMLDivElement>(null)
    const touchStart = useRef<number | null>(null)
    const [hasInteracted, setHasInteracted] = useState(false)
    const total = images.length

    // Frustum Culling & Liquid Motion Loop
    useGSAP(() => {
        if (!containerRef.current) return

        const slides = containerRef.current.querySelectorAll('.carousel-slide-node')

        slides.forEach((el) => {
            const slideIdx = parseInt(el.getAttribute('data-slide-index') || '0', 10)

            let diff = slideIdx - selectedIndex
            if (diff > total / 2) diff -= total
            if (diff < -total / 2) diff += total
            const relIdx = diff

            // --- FRUSTUM CULLING ---
            if (Math.abs(relIdx) > 12) {
                gsap.set(el, {
                    autoAlpha: 0,
                    x: relIdx * 620,
                    z: -3000,
                    pointerEvents: "none"
                });
                return;
            }

            const isCenter = relIdx === 0
            const isMobile = window.innerWidth < 768

            // Target Values - Responsive spacing
            const spacing = isMobile ? 380 : 640
            const xPos = relIdx * spacing
            const zPos = isCenter ? 0 : -Math.abs(relIdx) * (isMobile ? 400 : 600)
            const rotY = relIdx * -35
            const opacity = Math.max(1 - Math.abs(relIdx) * 0.45, 0)
            const scale = 1 - Math.abs(relIdx) * 0.15

            // Expert Motion Trigger
            gsap.to(el, {
                x: xPos,
                z: zPos,
                rotateY: rotY,
                opacity: opacity,
                scale: scale,
                autoAlpha: opacity > 0 ? 1 : 0,
                duration: 0.75,
                ease: "power3.out",
                force3D: true,
                pointerEvents: isCenter ? "auto" : "none", // Only center image captures hover
                overwrite: "auto",
                lazy: false
            })
        })
    }, { dependencies: [selectedIndex, hasInteracted], scope: containerRef })

    const handleTouchStart = (e: React.TouchEvent) => {
        setHasInteracted(true)
        touchStart.current = e.touches[0].clientX
    }

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStart.current === null) return
        const touchEnd = e.changedTouches[0].clientX
        const diff = touchStart.current - touchEnd
        const threshold = 50
        if (Math.abs(diff) > threshold) {
            if (diff > 0) onSelect((selectedIndex + 1) % total)
            else onSelect((selectedIndex - 1 + total) % total)
        }
        touchStart.current = null
    }

    return (
        <div
            className="fixed inset-0 flex items-center justify-center perspective-[2500px] transform-gpu preserve-3d overflow-hidden pointer-events-none touch-none overscroll-none"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            <div
                ref={containerRef}
                className="relative w-full h-full flex items-center justify-center preserve-3d pointer-events-auto"
            >
                {images.map((src, index) => (
                    <CarouselSlide
                        key={`ultra-v3-node-${index}`}
                        src={src}
                        index={index}
                        totalCount={total}
                        activeIndex={selectedIndex}
                        onClick={onSelect}
                    />
                ))}
            </div>

            {/* Interaction Hint */}
            {!hasInteracted && total > 1 && (
                <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-[250] pointer-events-none">
                    <div className="flex flex-col items-center gap-3 animate-bounce shadow-2xl">
                        <div className="flex items-center gap-4 px-6 py-3 bg-white/10 backdrop-blur-xl rounded-full border border-white/20">
                            <div className="flex gap-1">
                                <div className="w-2 h-2 bg-pink-400 rounded-full animate-ping" />
                                <ChevronLeft className="w-4 h-4 text-white/60" />
                            </div>
                            <span className="text-white/80 text-[10px] font-bold uppercase tracking-[0.4em] whitespace-nowrap">
                                Swipe to Explore
                            </span>
                            <div className="flex gap-1">
                                <ChevronRight className="w-4 h-4 text-white/60" />
                                <div className="w-2 h-2 bg-pink-400 rounded-full animate-ping" />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
