"use client"

import { useEffect, useRef, useState, memo, useMemo } from "react"
import { Heart, Camera, Clock, Sparkles, Navigation } from "lucide-react"
import Link from "next/link"
import NextImage from "next/image"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { Draggable } from "gsap/all"

if (typeof window !== "undefined") {
    gsap.registerPlugin(Draggable)
}

const surpriseCards = [
    {
        id: 1,
        title: "How We Got Here",
        icon: Clock,
        gradient: "from-pink-400 via-rose-400 to-pink-500",
        description: "Our beautiful journey together",
        color: "#FF4D6D"
    },
    {
        id: 2,
        title: "Gallery",
        icon: Camera,
        gradient: "from-purple-400 via-pink-400 to-purple-500",
        description: "Precious moments captured",
        color: "#9D50BB"
    },
    {
        id: 3,
        title: "Moments",
        icon: Sparkles,
        gradient: "from-rose-400 via-pink-500 to-rose-500",
        description: "Special times we've shared",
        color: "#FF758C"
    },
    {
        id: 4,
        title: "Things I Love About You",
        icon: Heart,
        gradient: "from-pink-500 via-rose-300 to-pink-400",
        description: "Everything that makes you special",
        color: "#FF0066"
    }
]

// -------------------------------------------------------------------------------------------------
// CarouselCard: PREMIUM 3D RESPONSIVE ATOM
// Features: Mouse-tilt rotation, dynamic spotlight, and parallax layers.
// -------------------------------------------------------------------------------------------------
const CarouselCard = memo(({ card, index }: { card: any, index: number }) => {
    const Icon = card.icon
    const isGallery = card.title === "Gallery"
    const isAboutYou = card.title === "Things I Love About You"
    const isHowWeGotHere = card.title === "How We Got Here"

    const cardRef = useRef<HTMLDivElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)
    const spotlightRef = useRef<HTMLDivElement>(null)
    const iconRef = useRef<HTMLDivElement>(null)
    const textRef = useRef<HTMLDivElement>(null)

    // GSAP 3D Tilt & Spotlight Engine
    useGSAP(() => {
        if (!cardRef.current || !spotlightRef.current) return

        const cardEl = cardRef.current
        const spotlightEl = spotlightRef.current

        // Setup quickSetters for 60fps performance
        const rotateXSetter = gsap.quickSetter(contentRef.current, "rotationX", "deg")
        const rotateYSetter = gsap.quickSetter(contentRef.current, "rotationY", "deg")
        const spotXSetter = gsap.quickSetter(spotlightEl, "x", "px")
        const spotYSetter = gsap.quickSetter(spotlightEl, "y", "px")
        // Parallax layers
        const iconXSetter = gsap.quickSetter(iconRef.current, "x", "px")
        const iconYSetter = gsap.quickSetter(iconRef.current, "y", "px")

        const handleMouseMove = (e: MouseEvent) => {
            const rect = cardEl.getBoundingClientRect()
            const centerX = rect.left + rect.width / 2
            const centerY = rect.top + rect.height / 2
            const mouseX = e.clientX - rect.left
            const mouseY = e.clientY - rect.top

            // 1. Calculate TILT (±10 degrees)
            const tiltX = ((e.clientY - centerY) / (rect.height / 2)) * -10
            const tiltY = ((e.clientX - centerX) / (rect.width / 2)) * 10

            // 2. Perform updates
            rotateXSetter(tiltX)
            rotateYSetter(tiltY)

            // 3. Spotlight position (follows cursor)
            spotXSetter(mouseX - 200) // 200 is half of spotlight width
            spotYSetter(mouseY - 200)

            // 4. Subtle Icon Parallax
            iconXSetter(tiltY * 1.5)
            iconYSetter(tiltX * -1.5)
        }

        const handleMouseEnter = () => {
            gsap.to(spotlightEl, { opacity: 0.15, duration: 0.3 })
            gsap.to(contentRef.current, { scale: 1.02, duration: 0.4, ease: "power2.out" })
        }

        const handleMouseLeave = () => {
            gsap.to(spotlightEl, { opacity: 0, duration: 0.5 })
            gsap.to(contentRef.current, {
                rotationX: 0,
                rotationY: 0,
                scale: 1,
                duration: 0.8,
                ease: "elastic.out(1, 0.3)"
            })
            gsap.to([iconRef.current, textRef.current], { x: 0, y: 0, duration: 0.8, ease: "power2.out" })
        }

        cardEl.addEventListener("mousemove", handleMouseMove)
        cardEl.addEventListener("mouseenter", handleMouseEnter)
        cardEl.addEventListener("mouseleave", handleMouseLeave)

        return () => {
            cardEl.removeEventListener("mousemove", handleMouseMove)
            cardEl.removeEventListener("mouseenter", handleMouseEnter)
            cardEl.removeEventListener("mouseleave", handleMouseLeave)
        }
    }, { scope: cardRef })

    const CardJSX = (
        <div
            ref={cardRef}
            className="group relative perspective-1000 flex-shrink-0"
            style={{ width: '380px', height: '480px' }}
        >
            <div
                ref={contentRef}
                className={`relative w-full h-full rounded-[2.5rem] bg-gradient-to-br ${card.gradient} p-10 overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] preserve-3d transition-transform duration-200`}
            >
                {/* Spotlight Layer */}
                <div
                    ref={spotlightRef}
                    className="absolute inset-0 pointer-events-none opacity-0 bg-[radial-gradient(circle_at_center,_white_0%,_transparent_70%)] w-[400px] h-[400px] blur-[60px] z-20"
                />

                {/* Decorative Glass Elements */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-xl" />

                {/* Content Container */}
                <div className="relative z-30 h-full flex flex-col items-center justify-center text-center space-y-8">
                    {/* Icon Cloud */}
                    <div
                        ref={iconRef}
                        className="p-8 bg-white/20 backdrop-blur-xl border border-white/30 rounded-[2rem] shadow-inner-white flex items-center justify-center group-hover:bg-white/30 transition-colors duration-500"
                    >
                        <Icon className="w-16 h-16 text-white drop-shadow-lg" strokeWidth={1.5} />
                    </div>

                    {/* Metadata */}
                    <div ref={textRef} className="space-y-4">
                        <h3 className="text-4xl font-bold text-white tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                            {card.title}
                        </h3>
                        <p className="text-white/80 text-lg font-medium italic">
                            {card.description}
                        </p>
                    </div>

                    {/* Action Indicator */}
                    <div className="mt-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
                        <div className="bg-white/20 backdrop-blur-md px-8 py-3 rounded-full border border-white/20 text-white font-bold text-sm tracking-widest uppercase">
                            {isGallery ? "Open Gallery ✨" : isAboutYou ? "See About You →" : isHowWeGotHere ? "See Our Story →" : "Explore →"}
                        </div>
                    </div>
                </div>

                {/* Corner Accents */}
                <div className="absolute top-6 left-6 opacity-40">
                    <Navigation className="w-4 h-4 text-white rotate-45" />
                </div>
            </div>
        </div>
    )

    const isMoments = card.title === "Moments"
    const href = isGallery ? "/gallery" : isAboutYou ? "/about-you" : isHowWeGotHere ? "/how-we-got-here" : isMoments ? "/moments" : "#"

    return (
        <Link href={href} className="block no-underline">
            {CardJSX}
        </Link>
    )
})
CarouselCard.displayName = "CarouselCard"

// -------------------------------------------------------------------------------------------------
// SurpriseCarousel: OPTIMIZED PREMIUM ENGINE
// Features: Infinite loop, high-inertia dragging, and refined layout.
// -------------------------------------------------------------------------------------------------
export function SurpriseCarousel() {
    const sectionRef = useRef<HTMLDivElement>(null)
    const headerRef = useRef<HTMLDivElement>(null)
    const carouselRef = useRef<HTMLDivElement>(null)
    const heartRef = useRef<HTMLSpanElement>(null)
    const butterfly1Ref = useRef<HTMLDivElement>(null)
    const [gifKey, setGifKey] = useState(0)

    // Force GIF refresh on mount to ensure they play from the start
    useEffect(() => {
        setGifKey(Date.now())
    }, [])

    const cardWidth = 380 + 32 // width + gap
    const totalWidth = cardWidth * surpriseCards.length

    // Infinite Buffer (x3 ensures enough scroll space for high-speed dragging)
    const infiniteCards = useMemo(() => [
        ...surpriseCards,
        ...surpriseCards,
        ...surpriseCards,
        ...surpriseCards
    ], [])

    useGSAP(() => {
        // Continuous Floating Hearts & Butterfly 1 Animation
        gsap.to([heartRef.current, butterfly1Ref.current], {
            scale: 1.25,
            duration: 1.5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            lazy: true
        })

        // Infinite Draggable Logic & Ticker Engine
        gsap.set(carouselRef.current, { x: -totalWidth })

        let xPos = -totalWidth
        let isInteracting = false
        const speed = 0.2 // Reduced speed (was 0.5) for a very slow, smooth experience

        const checkInfinite = (val: number) => {
            if (val < -totalWidth * 2) return val + totalWidth
            if (val > -totalWidth) return val - totalWidth
            return val
        }

        const tick = () => {
            if (isInteracting) return
            xPos = checkInfinite(xPos - speed)
            gsap.set(carouselRef.current, { x: xPos, force3D: true, lazy: true })
        }

        gsap.ticker.add(tick)

        const drag = Draggable.create(carouselRef.current, {
            type: "x",
            inertia: true,
            edgeResistance: 0.65,
            throwResistance: 800,
            onPress: () => {
                isInteracting = true
            },
            onDrag: function () {
                xPos = checkInfinite(this.x)
                if (Math.abs(xPos - this.x) > 1) {
                    gsap.set(this.target, { x: xPos })
                    this.update()
                }
            },
            onThrowUpdate: function () {
                xPos = checkInfinite(this.x)
                if (Math.abs(xPos - this.x) > 1) {
                    gsap.set(this.target, { x: xPos })
                    this.update()
                }
            },
            onRelease: () => {
                // Resume auto-slide almost immediately after release
                gsap.delayedCall(0.1, () => {
                    if (!drag[0].isThrowing) isInteracting = false
                })
            },
            onThrowComplete: () => {
                isInteracting = false
            },
            allowEventDefault: false,
            allowNativeTouchScrolling: false,
            dragClickables: true
        })

        return () => {
            gsap.ticker.remove(tick)
            if (drag[0]) drag[0].kill()
        }
    }, { scope: sectionRef })

    return (
        <section id="surprise-carousel" ref={sectionRef} className="relative py-32 px-4 bg-[#fffafb] overflow-hidden">
            {/* Header Polish */}
            <div ref={headerRef} className="max-w-7xl mx-auto text-center mb-24 space-y-4">
                <span className="text-pink-400 font-bold tracking-[0.3em] uppercase text-sm block mb-2">Our Special Treasures</span>
                <h2 className="text-5xl md:text-7xl font-bold flex items-center justify-center gap-6 text-[#4a0e0e]" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Choose Your Adventure
                    <span ref={heartRef} className="inline-block text-pink-500 drop-shadow-pink-glow relative">
                        <Heart fill="currentColor" stroke="none" className="w-12 h-12 md:w-16 md:h-16" />

                        {/* Second Butterfly (Facing Heart) */}
                        <div className="absolute -right-24 md:-right-36 -top-12 md:-top-20 w-32 h-32 md:w-56 md:h-56 pointer-events-none select-none animate-float -scale-x-100">
                            <NextImage
                                key={`butterfly-heart-${gifKey}`}
                                src={`/assets/kupukupu.gif?v=${gifKey}`}
                                alt="Butterfly"
                                width={200}
                                height={200}
                                unoptimized
                                className="w-full h-auto drop-shadow-lg"
                                priority
                            />
                        </div>
                    </span>
                </h2>
                <div className="flex items-center justify-center gap-4 text-pink-500/60 font-medium italic text-xl">
                    <span className="w-12 h-[1px] bg-current" />
                    Swipe to explore our story
                    <span className="w-12 h-[1px] bg-current" />
                </div>
            </div>

            {/* Butterfly Accent (Top Left) */}
            <div ref={butterfly1Ref} className="absolute top-20 left-20 w-48 h-48 md:w-80 md:h-80 z-20 pointer-events-none select-none">
                <div className="animate-float w-full h-full">
                    <NextImage
                        key={`butterfly-accent-${gifKey}`}
                        src={`/assets/kupukupu.gif?v=${gifKey}`}
                        alt="Butterfly"
                        width={400}
                        height={400}
                        unoptimized
                        className="w-full h-auto drop-shadow-2xl"
                        priority
                    />
                </div>
            </div>

            {/* Carousel Container */}
            <div className="w-full relative px-10">
                <div
                    ref={carouselRef}
                    className="flex gap-8 cursor-grab active:cursor-grabbing will-change-transform"
                >
                    {infiniteCards.map((card, index) => (
                        <CarouselCard
                            key={`${card.id}-${index}`}
                            card={card}
                            index={index}
                        />
                    ))}
                </div>
            </div>

            {/* Subtle Gradient Fog (Premium Finish) */}
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#fffafb] to-transparent pointer-events-none z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#fffafb] to-transparent pointer-events-none z-10" />

            {/* footer_section2 Decorative Image - Professional Placement */}
            <div
                className="absolute left-[-0.5%] w-[101%] z-[60] pointer-events-none select-none"
                style={{ bottom: '-7px' }} // ADJUST VERTICAL: Increase negative to lower (e.g., -10px), decrease to raise (e.g., -5px or 0px)
            >
                <NextImage
                    src="/assets/footer_section2.png"
                    alt=""
                    width={1920}
                    height={300}
                    loading="lazy"
                    className="w-full h-auto object-bottom opacity-90 transition-opacity duration-1000 scale-x-[1.02]" // ADJUST HORIZONTAL: Increase scale-x (e.g., 1.05) to push further into the edges
                />
            </div>
        </section>
    )
}
