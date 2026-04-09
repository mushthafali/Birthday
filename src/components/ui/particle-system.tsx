"use client"

import { useEffect, useState, useMemo, memo, useRef } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { Heart } from "lucide-react"

// --- Types ---
export type ParticleType = "heart" | "flower" | "circle" | "mixed"

interface Particle {
    id: number
    x: number
    type: "heart" | "flower" | "circle"
    color: string
    duration: number
    delay: number
    size: number
    initialRotate: number
    targetRotate: number
}

// --- Optimized Sub-components ---
const Flower = memo(({ color, size }: { color: string; size: number }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={color}
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-sm will-change-transform"
    >
        <path d="M12 12c2.209 0 4-1.791 4-4s-1.791-4-4-4-4 1.791-4 4 1.791 4 4 4zm0 0c0 2.209 1.791 4 4 4s4-1.791 4-4-1.791-4-4-4-4 1.791-4 4zm0 0c-2.209 0-4 1.791-4 4s1.791 4 4 4 4-1.791 4-4-1.791-4-4-4zm0 0c0-2.209-1.791-4-4-4s-4 1.791-4 4 1.791 4 4 4 4-1.791 4-4zM12 13a1 1 0 100-2 1 1 0 000 2z" />
    </svg>
))
Flower.displayName = "Flower"

const HeartItem = memo(({ color, size }: { color: string; size: number }) => (
    <Heart fill={color} stroke="none" style={{ width: size, height: size }} className="drop-shadow-sm will-change-transform" />
))
HeartItem.displayName = "HeartItem"

const Circle = memo(({ color, size }: { color: string; size: number }) => (
    <div style={{ width: size, height: size, backgroundColor: color }} className="rounded-full drop-shadow-sm will-change-transform" />
))
Circle.displayName = "Circle"

// --- Main Component ---
interface ParticleSystemProps {
    type?: ParticleType
    count?: number
    direction?: "up" | "down"
    colors?: string[]
    delay?: number
    className?: string
    isPaused?: boolean
    opacity?: number
    repeat?: number
}

const DEFAULT_COLORS = ["#FFC0CB", "#FFFFFF", "#FFD700", "#FF4D6D", "#FF758F", "#FFF0F3", "#FFB3C1"]

export function ParticleSystem({
    type = "heart",
    count = 30,
    direction = "down",
    colors = DEFAULT_COLORS,
    delay = 0,
    className = "",
    isPaused = false,
    opacity = 0.4,
    repeat = -1
}: ParticleSystemProps) {
    const [mounted, setMounted] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        setMounted(true)
    }, [])

    const particles = useMemo(() => {
        return Array.from({ length: count }).map((_, i) => {
            let pType: "heart" | "flower" | "circle"
            if (type === "mixed") {
                const rand = Math.random()
                pType = rand > 0.6 ? "heart" : rand > 0.3 ? "flower" : "circle"
            } else {
                pType = type as "heart" | "flower" | "circle"
            }

            return {
                id: i,
                x: Math.random() * 105,
                type: pType,
                color: colors[Math.floor(Math.random() * colors.length)],
                duration: 4 + Math.random() * 6,
                delay: Math.random() * 10 + delay,
                size: 15 + Math.random() * 25,
                initialRotate: Math.random() * 360,
                targetRotate: 360 + Math.random() * 720,
            } as Particle
        })
    }, [count, type, colors, delay])

    useGSAP(() => {
        if (!mounted || !containerRef.current) return

        const elements = containerRef.current.querySelectorAll(".particle-item")
        
        elements.forEach((el, i) => {
            const p = particles[i]
            if (!p) return

            const startY = direction === "down" ? "-10vh" : "110vh"
            const endY = direction === "down" ? "115vh" : "-15vh"

            gsap.fromTo(el,
                {
                    y: startY,
                    x: `${p.x}vw`,
                    rotate: p.initialRotate,
                    opacity: 0,
                    scale: 0.5,
                },
                {
                    y: endY,
                    rotate: p.targetRotate,
                    opacity: opacity,
                    scale: 1,
                    duration: p.duration,
                    delay: p.delay,
                    repeat: repeat,
                    ease: "none",
                    onRepeat: () => {
                        if (repeat === -1) {
                            gsap.set(el, { opacity: 0 })
                            gsap.to(el, { opacity: opacity, duration: 1 })
                        }
                    },
                    onComplete: () => {
                        if (repeat !== -1) {
                            gsap.to(el, { opacity: 0, duration: 0.5 })
                        }
                    },
                    paused: isPaused
                }
            )
        })
    }, { scope: containerRef, dependencies: [mounted, direction, isPaused, opacity] })

    if (!mounted) return null

    return (
        <div
            ref={containerRef}
            className={`fixed inset-0 pointer-events-none overflow-hidden z-10 ${className}`}
        >
            {particles.map((p) => (
                <div
                    key={p.id}
                    className="absolute top-0 particle-item will-change-transform"
                    style={{ left: 0 }}
                >
                    {p.type === "heart" && <HeartItem color={p.color} size={p.size} />}
                    {p.type === "flower" && <Flower color={p.color} size={p.size} />}
                    {p.type === "circle" && <Circle color={p.color} size={p.size} />}
                </div>
            ))}
        </div>
    )
}
