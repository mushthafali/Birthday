"use client"

import React, { useState, useEffect, useRef, memo, useMemo } from "react"
import dynamic from "next/dynamic"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollToPlugin } from "gsap/ScrollToPlugin"
import { ArrowLeft, X, ChevronLeft, ChevronRight, Heart, LayoutGrid, Camera } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { ParticleSystem } from "@/components/ui/particle-system"
import { useLenis } from "lenis/react"
import { categories, type Category } from "@/data/gallery-data"

// Dynamic import for lightbox to reduce initial bundle
const GalleryLightbox = dynamic(() => import("@/components/ui/gallery-lightbox").then(mod => mod.GalleryLightbox), {
    ssr: false,
    loading: () => <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[200]" />
})

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollToPlugin)
}

// --- Components ---
// --- Components ---

// RainHeartComponent removed as we use unified ParticleSystem.

const CategoryCard = memo(({ category, onClick, index }: { category: typeof categories[0], onClick: () => void, index: number }) => {
    const cardRef = useRef<HTMLDivElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)
    const imgRef = useRef<HTMLImageElement>(null)

    useGSAP(() => {
        gsap.from(cardRef.current, {
            opacity: 0,
            y: 50,
            duration: 0.8,
            delay: index * 0.1,
            ease: "power3.out"
        })

        gsap.from(contentRef.current, {
            opacity: 0,
            x: -30,
            duration: 0.7,
            delay: index * 0.1 + 0.4,
            ease: "power2.out"
        })
    })

    const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return
        const { left, top, width, height } = cardRef.current.getBoundingClientRect()
        const x = (e.clientX - left) / width
        const y = (e.clientY - top) / height

        const moveX = (x - 0.5) * 15
        const moveY = (y - 0.5) * -15

        gsap.to(cardRef.current, {
            rotateX: moveY,
            rotateY: moveX,
            duration: 0.5,
            ease: "power2.out"
        })
    }

    const onMouseEnter = () => {
        gsap.to(cardRef.current, {
            scale: 1.05,
            z: 20,
            shadow: "0 40px 80px rgba(255,182,193,0.4)",
            duration: 0.4,
            ease: "power2.out"
        })
        gsap.to(imgRef.current, { scale: 1.1, opacity: 1, duration: 0.8, ease: "power2.out" })
    }

    const onMouseLeave = () => {
        gsap.to(cardRef.current, {
            scale: 1,
            rotateX: 0,
            rotateY: 0,
            z: 0,
            shadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
            duration: 0.6,
            ease: "power2.out"
        })
        gsap.to(imgRef.current, { scale: 1, opacity: 0.8, duration: 0.8, ease: "power2.out" })
    }

    return (
        <div
            ref={cardRef}
            onMouseEnter={onMouseEnter}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            className="group relative h-[400px] w-full bg-white rounded-[2.5rem] overflow-hidden shadow-xl cursor-pointer border-4 border-white transition-colors duration-500 hover:border-pink-200 perspective-[1000px] transform-gpu"
            onClick={onClick}
        >
            <div className="absolute inset-0 overflow-hidden">
                <Image
                    ref={imgRef}
                    src={category.coverImage}
                    alt={category.title}
                    fill
                    className="object-cover opacity-80"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={index < 2}
                />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-10">
                <div ref={contentRef}>
                    <div className="mb-3 w-16 h-[3px] bg-pink-500 rounded-full" />
                    <h3 className="text-4xl font-bold text-white mb-3 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                        {category.title}
                    </h3>
                    <p className="text-white/80 text-base italic font-medium max-w-xs">
                        {category.description}
                    </p>
                    <div className="mt-6 flex items-center gap-3 text-pink-400 font-bold text-sm tracking-[0.2em] uppercase">
                        <div className="p-2 bg-pink-500/20 rounded-lg backdrop-blur-sm">
                            <Camera className="w-5 h-5 text-pink-400" />
                        </div>
                        <span>Explore Gallery</span>
                    </div>
                </div>
            </div>
        </div>
    )
})
CategoryCard.displayName = "CategoryCard"

const GalleryItem = memo(({ src, index, onClick, priority, tagline }: { src: string, index: number, onClick: (index: number) => void, priority: boolean, tagline?: string }) => {
    const [isLoaded, setIsLoaded] = useState(false)
    const itemRef = useRef<HTMLDivElement>(null)
    const overlayRef = useRef<HTMLDivElement>(null)
    const heartRef = useRef<HTMLDivElement>(null)
    const imgRef = useRef<HTMLImageElement>(null)

    // Staggered entrance is now handled by the parent grid component for better coordination.


    const onMouseEnter = () => {
        gsap.to(overlayRef.current, { opacity: 1, duration: 0.4, ease: "power2.out" })
        gsap.to(heartRef.current, { scale: 1, rotate: 0, opacity: 1, duration: 0.5, ease: "back.out(1.7)" })
        gsap.to(imgRef.current, { scale: 1.15, duration: 1.2, ease: "power2.out" })
    }

    const onMouseLeave = () => {
        gsap.to(overlayRef.current, { opacity: 0, duration: 0.4, ease: "power2.in" })
        gsap.to(heartRef.current, { scale: 0.5, rotate: -20, opacity: 0, duration: 0.3, ease: "power2.in" })
        gsap.to(imgRef.current, { scale: 1, duration: 0.8, ease: "power2.out" })
    }

    return (
        <div
            ref={itemRef}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            className="group relative aspect-[4/5] bg-pink-100/50 rounded-[2.5rem] overflow-hidden shadow-lg border-[8px] border-white hover:shadow-2xl hover:shadow-pink-200/50 transition-shadow duration-500 cursor-pointer"
            onClick={() => onClick(index)}
        >
            {!isLoaded && (
                <div className="absolute inset-0 bg-gradient-to-r from-pink-50 via-white to-pink-50 animate-pulse" />
            )}

            <Image
                ref={imgRef}
                src={src}
                alt={`Gallery image ${index + 1}`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                className={`object-cover ${isLoaded ? "opacity-100" : "opacity-0"}`}
                onLoad={() => setIsLoaded(true)}
                priority={priority}
            />

            <div
                ref={overlayRef}
                className="absolute inset-0 bg-gradient-to-t from-[#590D22]/60 via-transparent to-transparent opacity-0 flex flex-col items-center justify-center gap-4 pointer-events-none"
            >
                <div ref={heartRef} className="p-5 bg-white/20 backdrop-blur-xl rounded-full border border-white/30 scale-50 opacity-0 transform-gpu">
                    <Heart fill="white" stroke="#FF4D6D" strokeWidth={1} className="w-10 h-10 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
                </div>
                <span className="text-white font-black tracking-[0.3em] text-[10px] uppercase px-6 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {tagline || "Pure Love"}
                </span>
            </div>
        </div>
    )
})
GalleryItem.displayName = "GalleryItem"

// --- Main Page ---

export default function GalleryPage() {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
    const lenis = useLenis()
    const [visibleCount, setVisibleCount] = useState(12)
    const prevCountRef = useRef(12)

    const mainRef = useRef<HTMLElement>(null)
    const headerRef = useRef<HTMLDivElement>(null)
    const gridRef = useRef<HTMLDivElement>(null)

    const activeCategory = useMemo(() =>
        categories.find(c => c.id === selectedCategory),
        [selectedCategory]
    )

    const allImages = useMemo(() => activeCategory?.images || [], [activeCategory])
    const images = useMemo(() => allImages.slice(0, visibleCount), [allImages, visibleCount])

    // Rain hearts generated only on client via ParticleSystem.
    // Scroll to top on mount (for navigation from Home page)
    useEffect(() => {
        if (lenis) {
            lenis.scrollTo(0, { immediate: true })
        } else if (typeof window !== "undefined") {
            window.scrollTo({ top: 0, behavior: "instant" })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])




    // 1. Grid transition on INITIAL category selection
    useGSAP(() => {
        if (!gridRef.current) return

        // Reset count for new category
        prevCountRef.current = visibleCount

        gsap.fromTo(gridRef.current.children,
            { opacity: 0, y: 30, scale: 0.95 },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                stagger: 0.05,
                duration: 0.8,
                ease: "power3.out",
                clearProps: "all"
            }
        )
    }, { dependencies: [selectedCategory], scope: gridRef })

    // 2. Smoothly animate ONLY the newly added items when "Load More" is clicked
    useGSAP(() => {
        if (!gridRef.current || visibleCount <= prevCountRef.current) {
            prevCountRef.current = visibleCount
            return
        }

        const currentChildren = Array.from(gridRef.current.children)
        const newItems = currentChildren.slice(prevCountRef.current)

        if (newItems.length > 0) {
            gsap.fromTo(newItems,
                { opacity: 0, y: 30, scale: 0.8 },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    stagger: 0.05,
                    duration: 0.6,
                    ease: "power2.out",
                    clearProps: "all"
                }
            )
        }

        prevCountRef.current = visibleCount
    }, { dependencies: [visibleCount], scope: gridRef })

    useGSAP(() => {
        // Simple entrance for headers
        gsap.fromTo(headerRef.current,
            { opacity: 0, y: -20 },
            { opacity: 1, y: 0, duration: 0.6 }
        )
    }, { dependencies: [selectedCategory] })






    const loadMore = () => {
        setVisibleCount(prev => prev + 12)
    }

    useEffect(() => {
        setVisibleCount(12)
        if (lenis) {
            lenis.scrollTo(0, { immediate: true })
        } else if (typeof window !== "undefined") {
            window.scrollTo({ top: 0, behavior: "instant" })
        }
    }, [selectedCategory, lenis])

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (selectedIndex !== null) {
                if (e.key === "Escape") setSelectedIndex(null)
            } else if (selectedCategory !== null) {
                if (e.key === "Escape") setSelectedCategory(null)
            }
        }
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [selectedIndex, selectedCategory])


    return (
        <main ref={mainRef} className="min-h-screen bg-pink-50 py-12 px-4 md:px-8 relative overflow-hidden">
            {/* Background Decorations */}
            <ParticleSystem
                type="heart"
                count={30}
                direction="down"
                isPaused={selectedIndex !== null}
                opacity={0.4}
            />

            {/* Navigation */}
            <div className="fixed top-6 left-6 z-[120] flex gap-4">
                <Link
                    href="/?back=true"
                    onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.05, backgroundColor: "#fff", duration: 0.3 })}
                    onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, backgroundColor: "rgba(255,255,255,0.8)", duration: 0.3 })}
                    className="flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-md text-pink-600 font-bold rounded-full shadow-lg border border-pink-100 transition-shadow hover:shadow-pink-200/50 active:scale-95"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="hidden md:inline">Back Home</span>
                </Link>

                {selectedCategory && (
                    <button
                        onClick={() => setSelectedCategory(null)}
                        onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.05, backgroundColor: "#be185d", duration: 0.3 })}
                        onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, backgroundColor: "#db2777", duration: 0.3 })}
                        className="flex items-center gap-2 px-6 py-3 bg-pink-600 text-white font-bold rounded-full shadow-lg transition-shadow hover:shadow-pink-300/50 active:scale-95"
                    >
                        <LayoutGrid className="w-5 h-5" />
                        <span className="hidden md:inline">Categories</span>
                    </button>
                )}
            </div>

            <div className="max-w-7xl mx-auto mb-16 relative z-10">
                <div ref={headerRef} key={selectedCategory ? "cat" : "sel"}>
                    {!selectedCategory ? (
                        <div className="flex flex-col items-center gap-4 text-center mt-12 md:mt-0">
                            <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#590D22] via-[#C9184A] to-[#590D22] drop-shadow-sm py-4 px-2 leading-normal" style={{ fontFamily: "'Playfair Display', serif" }}>
                                Our Secret Gallery
                            </h1>
                            <p className="text-pink-600 italic font-medium max-w-lg">
                                Each folder contains a piece of our heart. Pick one to explore our favorite memories together.
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="h-[2px] w-12 bg-[#FF4D6D]/30 rounded-full" />
                                <Heart className="text-[#FF4D6D] w-5 h-5 animate-pulse" fill="currentColor" />
                                <div className="h-[2px] w-12 bg-[#FF4D6D]/30 rounded-full" />
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-4 text-center mt-12 md:mt-0">
                            <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#590D22] via-[#C9184A] to-[#590D22] py-4 px-2 leading-normal" style={{ fontFamily: "'Playfair Display', serif" }}>
                                {activeCategory?.title}
                            </h1>
                            <p className="text-pink-600 italic font-medium">
                                {activeCategory?.description}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {!selectedCategory ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {categories.map((cat, idx) => (
                            <CategoryCard
                                key={cat.id}
                                category={cat}
                                index={idx}
                                onClick={() => setSelectedCategory(cat.id)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-12">
                        <div
                            ref={gridRef}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full"
                        >
                            {images.map((src, index) => (
                                <GalleryItem
                                    key={src}
                                    src={src}
                                    index={index}
                                    priority={index < 6}
                                    tagline={activeCategory?.tagline}
                                    onClick={(i) => {
                                        setSelectedIndex(i)
                                    }}
                                />
                            ))}
                        </div>

                        {allImages.length > visibleCount && (
                            <button
                                type="button"
                                onClick={loadMore}
                                className="px-8 py-3 bg-white border-2 border-pink-200 text-pink-600 font-bold rounded-full shadow-lg hover:bg-pink-50 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                            >
                                <span>Load More Memories ✨</span>
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Lightbox / Full Size View (Isolated & GSAP Powered) */}
            {selectedIndex !== null && (
                <GalleryLightbox
                    images={allImages}
                    initialIndex={selectedIndex}
                    onClose={() => setSelectedIndex(null)}
                />
            )}
            <div className="fixed bottom-0 left-0 w-full h-32 bg-gradient-to-t from-pink-100/50 to-transparent pointer-events-none -z-10" />
        </main>
    )
}
