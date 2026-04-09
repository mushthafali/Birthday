"use client"

import React, { useRef, useState, useEffect } from "react"
import { ArrowLeft, Heart, Play, Pause, Volume2, VolumeX } from "lucide-react"
import Link from "next/link"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ParticleSystem } from "@/components/ui/particle-system"

export default function MomentsPage() {
    const videoRef = useRef<HTMLVideoElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const playerRef = useRef<HTMLDivElement>(null)
    
    const [isPlaying, setIsPlaying] = useState(false)
    const [isMuted, setIsMuted] = useState(false)
    const [progress, setProgress] = useState(0)

    // Handle Background Music Pause/Resume
    useEffect(() => {
        // Pause global music
        window.dispatchEvent(new CustomEvent('pauseBackgroundMusic'))
        
        return () => {
            // Resume global music when leaving
            window.dispatchEvent(new CustomEvent('resumeBackgroundMusic'))
        }
    }, [])

    // GSAP Entrance
    useGSAP(() => {
        gsap.fromTo(containerRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 1, ease: "power2.out" }
        )
        
        gsap.fromTo(playerRef.current,
            { y: 50, scale: 0.9, opacity: 0 },
            { y: 0, scale: 1, opacity: 1, duration: 1.2, delay: 0.3, ease: "back.out(1.2)" }
        )
    }, { scope: containerRef })

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) videoRef.current.pause()
            else videoRef.current.play()
            setIsPlaying(!isPlaying)
        }
    }

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted
            setIsMuted(!isMuted)
        }
    }

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            const current = videoRef.current.currentTime
            const duration = videoRef.current.duration
            if (duration > 0) {
                setProgress((current / duration) * 100)
            }
        }
    }

    const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
        if (videoRef.current) {
            const rect = e.currentTarget.getBoundingClientRect()
            const x = e.clientX - rect.left
            const clickedValue = (x / rect.width) * videoRef.current.duration
            videoRef.current.currentTime = clickedValue
        }
    }

    return (
        <main ref={containerRef} className="min-h-screen bg-[#0f0a0b] flex flex-col items-center justify-center p-4 relative overflow-hidden text-white">
            
            {/* Background Atmosphere */}
            <div className="absolute inset-0 z-0 opacity-30">
                <ParticleSystem type="heart" count={20} opacity={0.4} />
            </div>

            {/* Blurred Backdrop (Dynamic Feel) */}
            <div className="absolute inset-0 z-[-1] opacity-20 blur-[100px] scale-110">
                <video 
                    src="/video/moment.mp4" 
                    muted 
                    loop 
                    autoPlay 
                    playsInline
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Navigation */}
            <div className="absolute top-8 left-8 z-50">
                <Link href="/?back=true">
                    <button className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 hover:bg-white/20 transition-all active:scale-95 group">
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-bold tracking-wider uppercase text-xs">Back Home</span>
                    </button>
                </Link>
            </div>

            {/* Header */}
            <div className="relative z-10 text-center mb-12 space-y-4">
                <div className="flex items-center justify-center gap-3 text-pink-500 mb-2">
                    <Heart fill="currentColor" className="w-5 h-5 animate-pulse" />
                    <span className="text-sm font-bold tracking-[0.4em] uppercase">A Beautiful Moment Captured</span>
                    <Heart fill="currentColor" className="w-5 h-5 animate-pulse" />
                </div>
                <h1 className="text-4xl md:text-6xl font-bold italic" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Special Times We've Shared
                </h1>
            </div>

            {/* Premium Video Player - Optimized for Portrait */}
            <div 
                ref={playerRef}
                className="relative z-20 h-[70vh] md:h-[80vh] aspect-[9/16] bg-black rounded-[2.5rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] border-[6px] border-white/10 group transform-gpu"
            >
                <video
                    ref={videoRef}
                    src="/video/moment.mp4"
                    className="w-full h-full object-cover"
                    onTimeUpdate={handleTimeUpdate}
                    onClick={togglePlay}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    muted={isMuted}
                    playsInline
                    loop
                />

                {/* Custom Controls Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                    
                    {/* Progress Bar Hit Area */}
                    <div 
                        className="w-full h-4 flex items-center mb-8 cursor-pointer group/progress"
                        onClick={handleSeek}
                    >
                        <div className="w-full h-1.5 bg-white/10 rounded-full relative overflow-hidden group-hover/progress:h-2 transition-all">
                            <div 
                                className="absolute inset-y-0 left-0 bg-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.8)]"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <button onClick={togglePlay} className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all">
                                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 fill-current" />}
                            </button>
                            <button onClick={toggleMute} className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all">
                                {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                            </button>
                        </div>
                        
                        <div className="flex flex-col items-end">
                            <span className="text-xs font-bold tracking-widest uppercase text-white/40">Pure Romance</span>
                            <span className="text-pink-400 font-medium">Forever & Always</span>
                        </div>
                    </div>
                </div>

                {/* Central Play Button (When Paused) */}
                {!isPlaying && (
                    <button 
                        onClick={togglePlay}
                        className="absolute inset-0 flex items-center justify-center z-30"
                    >
                        <div className="p-8 bg-pink-500/20 backdrop-blur-2xl rounded-full border border-pink-400/30 scale-100 hover:scale-110 transition-transform">
                            <Play fill="white" className="w-12 h-12 text-white" />
                        </div>
                    </button>
                )}
            </div>

            {/* Footer Note */}
            <div className="mt-12 text-white/40 italic flex items-center gap-4">
                <span className="w-8 h-[1px] bg-white/10" />
                This small second means everything when spent with you
                <span className="w-8 h-[1px] bg-white/10" />
            </div>

        </main>
    )
}
