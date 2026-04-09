"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, SkipForward, SkipBack, Music, ChevronDown } from "lucide-react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"

interface Song {
    title: string;
    url: string;
    cover: string;
}

const SONG_LIST: Song[] = [
    {
        title: "Waking Up Together With You",
        url: "/song/Waking Up Together With You.mp3",
        cover: "/song/Waking Up Together With You.png"
    },
    {
        title: "She Choose Me",
        url: "/song/She Choose Me.mp3",
        cover: "/song/She Choose Me.png"
    },
    {
        title: "Baby I'm Yours",
        url: "/song/Baby I'm Yours.mp3",
        cover: "/song/Baby I'm Yours.jpg"
    },
    {
        title: "Beautiful Day",
        url: "/song/Beautiful Day.mp3",
        cover: "/song/Beautiful Day.jpg"
    },
    {
        title: "How Deep Is Your Love",
        url: "/song/How Deep Is Your Love.mp3",
        cover: "/song/How Deep Is Your Love.jpg"
    },
    {
        title: "Last Night on Earth",
        url: "/song/Last Night on Earth.mp3",
        cover: "/song/Last Night on Earth.jpg"
    },
    {
        title: "Count on Me",
        url: "/song/Count on Me.mp3",
        cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop"
    },
    {
        title: "Lover",
        url: "/song/Lover.mp3",
        cover: "https://images.unsplash.com/photo-1514525253361-9c1682337d45?w=300&h=300&fit=crop"
    },
    {
        title: "Nothing",
        url: "/song/Nothing.mp3",
        cover: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=300&h=300&fit=crop"
    },
    {
        title: "Nothing's Gonna Change My Love for You",
        url: "/song/Nothings Gonna Change My Love for You.mp3",
        cover: "https://images.unsplash.com/photo-1459749411177-042180ce673c?w=300&h=300&fit=crop"
    },
    {
        title: "Still into You",
        url: "/song/Still into You.mp3",
        cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300&fit=crop"
    },
    {
        title: "Terbuang Dalam Waktu",
        url: "/song/Terbuang Dalam Waktu.mp3",
        cover: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300&h=300&fit=crop"
    }
]

export function MusicPlayer() {
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTrack, setCurrentTrack] = useState(0)
    const [isUnlocked, setIsUnlocked] = useState(false)
    const [isPlaylistOpen, setIsPlaylistOpen] = useState(false)
    
    const audioRef = useRef<HTMLAudioElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const iconRef = useRef<HTMLDivElement>(null)
    const playlistRef = useRef<HTMLDivElement>(null)
    const chevronRef = useRef<HTMLDivElement>(null)

    const songs = SONG_LIST

    useGSAP(() => {
        if (!isUnlocked || !containerRef.current) return

        // Entrance animation when unlocked
        gsap.fromTo(containerRef.current,
            { opacity: 0, x: 20 },
            {
                opacity: 1,
                x: 0,
                duration: 1.2,
                ease: "power3.out"
            }
        )
    }, { dependencies: [isUnlocked], scope: containerRef })

    // Icon toggle animation
    useGSAP(() => {
        if (!iconRef.current) return
        gsap.fromTo(iconRef.current,
            { scale: 0, rotate: -180 },
            { scale: 1, rotate: 0, duration: 0.3, ease: "back.out(1.7)" }
        )
    }, { dependencies: [isPlaying], scope: iconRef })

    // Playlist animation
    useGSAP(() => {
        if (!playlistRef.current || !chevronRef.current) return

        if (isPlaylistOpen) {
            gsap.to(playlistRef.current, {
                height: "auto",
                opacity: 1,
                marginTop: 12,
                duration: 0.5,
                ease: "power3.out",
                display: "block"
            })
            gsap.to(chevronRef.current, {
                rotate: 180,
                duration: 0.3
            })
        } else {
            gsap.to(playlistRef.current, {
                height: 0,
                opacity: 0,
                marginTop: 0,
                duration: 0.3,
                ease: "power3.in",
                onComplete: () => {
                    if (playlistRef.current) playlistRef.current.style.display = "none"
                }
            })
            gsap.to(chevronRef.current, {
                rotate: 0,
                duration: 0.3
            })
        }
    }, { dependencies: [isPlaylistOpen] })

    // Listen for curtain opened event - unlock and play
    useEffect(() => {
        const handleCurtainOpen = () => {
            setIsUnlocked(true)
            if (audioRef.current && songs.length > 0) {
                audioRef.current.play().then(() => {
                    setIsPlaying(true)
                }).catch(err => {
                    console.log("Autoplay prevented:", err)
                })
            }
        }

        window.addEventListener('curtainOpened', handleCurtainOpen)
        return () => window.removeEventListener('curtainOpened', handleCurtainOpen)
    }, [songs])

    // Global Pause/Resume for specific pages (like Moments)
    const wasPlayingRef = useRef(false)
    useEffect(() => {
        const handlePause = () => {
            if (isPlaying) {
                wasPlayingRef.current = true
                if (audioRef.current) audioRef.current.pause()
                setIsPlaying(false)
            }
        }
        const handleResume = () => {
            if (wasPlayingRef.current) {
                if (audioRef.current) audioRef.current.play()
                setIsPlaying(true)
                wasPlayingRef.current = false
            }
        }

        window.addEventListener('pauseBackgroundMusic', handlePause)
        window.addEventListener('resumeBackgroundMusic', handleResume)
        return () => {
            window.removeEventListener('pauseBackgroundMusic', handlePause)
            window.removeEventListener('resumeBackgroundMusic', handleResume)
        }
    }, [isPlaying])

    // Close playlist on click outside or scroll
    useEffect(() => {
        if (!isPlaylistOpen) return;

        const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsPlaylistOpen(false);
            }
        };

        const handleScroll = () => {
            setIsPlaylistOpen(false);
        };

        document.addEventListener('mousedown', handleOutsideClick);
        document.addEventListener('touchstart', handleOutsideClick);
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
            document.removeEventListener('touchstart', handleOutsideClick);
            window.removeEventListener('scroll', handleScroll);
        };
    }, [isPlaylistOpen]);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause()
            } else {
                audioRef.current.play()
            }
            setIsPlaying(!isPlaying)
        }
    }

    const nextTrack = () => {
        setCurrentTrack((prev) => (prev + 1) % songs.length)
        setIsPlaying(true)
    }

    const prevTrack = () => {
        setCurrentTrack((prev) => (prev - 1 + songs.length) % songs.length)
        setIsPlaying(true)
    }

    const selectTrack = (index: number) => {
        setCurrentTrack(index)
        setIsPlaying(true)
        // Kept open as per user request
    }

    // Auto-play next track when current ends
    useEffect(() => {
        const audio = audioRef.current
        if (audio) {
            const handleEnded = () => nextTrack()
            audio.addEventListener('ended', handleEnded)
            return () => audio.removeEventListener('ended', handleEnded)
        }
    }, [songs.length])

    // Update audio source when track changes
    useEffect(() => {
        if (audioRef.current && songs.length > 0) {
            audioRef.current.src = songs[currentTrack].url
            if (isPlaying) {
                audioRef.current.play()
            }
        }
    }, [currentTrack, songs])

    return (
        <div
            ref={containerRef}
            className={`fixed top-6 right-6 z-[300] flex flex-col items-end ${!isUnlocked ? 'hidden' : ''}`}
            style={{ opacity: 0 }}
        >
            <div className="bg-gradient-to-br from-pink-100 to-pink-200 backdrop-blur-lg rounded-full shadow-2xl p-3 px-5 border-2 border-pink-300 flex items-center gap-4 relative">
                <audio ref={audioRef} />

                <div className="flex items-center gap-4">
                    {/* Music Icon */}
                    <div className="bg-gradient-to-br from-pink-400 to-pink-500 p-2 rounded-full shadow-inner">
                        <Music className="w-4 h-4 text-white" />
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={prevTrack}
                            className="p-2 hover:bg-pink-300/50 rounded-full transition-all hover:scale-110 active:scale-95"
                            aria-label="Previous track"
                        >
                            <SkipBack className="w-4 h-4 text-pink-700" />
                        </button>

                        <button
                            onClick={togglePlay}
                            className="p-3 bg-gradient-to-br from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 rounded-full transition-all hover:scale-110 active:scale-95 shadow-lg relative min-w-[48px] min-h-[48px] flex items-center justify-center overflow-hidden"
                            aria-label={isPlaying ? "Pause" : "Play"}
                        >
                            <div ref={iconRef}>
                                {isPlaying ? (
                                    <Pause className="w-5 h-5 text-white fill-white" />
                                ) : (
                                    <Play className="w-5 h-5 text-white fill-white" />
                                )}
                            </div>
                        </button>

                        <button
                            onClick={nextTrack}
                            className="p-2 hover:bg-pink-300/50 rounded-full transition-all hover:scale-110 active:scale-95"
                            aria-label="Next track"
                        >
                            <SkipForward className="w-4 h-4 text-pink-700" />
                        </button>
                    </div>

                    <div className="flex items-center pl-2 border-l border-pink-300/50">
                        {/* Playlist Toggle (Inside the pill for better alignment) */}
                        <button
                            onClick={() => setIsPlaylistOpen(!isPlaylistOpen)}
                            className={`p-2 rounded-full transition-all ${isPlaylistOpen ? 'bg-pink-400 text-white shadow-inner' : 'bg-pink-300/30 text-pink-700 hover:bg-pink-300/50'}`}
                        >
                            <div ref={chevronRef}>
                                <ChevronDown className="w-4 h-4" />
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Dropdown Playlist */}
            <div
                ref={playlistRef}
                className="w-72 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-pink-200 overflow-hidden hidden"
                style={{ height: 0, opacity: 0 }}
            >
                <div className="p-4 flex flex-col gap-3">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-[11px] font-black text-pink-500 uppercase tracking-[0.2em]">Playlist</h3>
                        <span className="text-[10px] font-medium text-gray-400">{songs.length} Tracks</span>
                    </div>
                    
                    <div className="flex flex-col gap-1.5 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {songs.map((song, index) => (
                            <button
                                key={index}
                                onClick={() => selectTrack(index)}
                                className={`flex items-center gap-4 p-2.5 rounded-2xl transition-all text-left ${currentTrack === index ? 'bg-pink-50 border border-pink-100' : 'hover:bg-gray-50 border border-transparent'}`}
                            >
                                <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 shadow-sm border border-white">
                                    <img 
                                        src={song.cover} 
                                        alt={song.title} 
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Music'
                                        }}
                                    />
                                    {currentTrack === index && isPlaying && (
                                        <div className="absolute inset-0 bg-pink-500/30 flex items-center justify-center backdrop-blur-[1px]">
                                            <div className="flex gap-0.5 items-end h-4">
                                                <div className="w-0.5 bg-white animate-[music-bar_0.8s_ease-in-out_infinite]" style={{ height: '60%' }}></div>
                                                <div className="w-1 bg-white animate-[music-bar_1.2s_ease-in-out_infinite]" style={{ height: '100%' }}></div>
                                                <div className="w-0.5 bg-white animate-[music-bar_0.6s_ease-in-out_infinite]" style={{ height: '80%' }}></div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col flex-1 overflow-hidden">
                                    <span className={`text-[13px] font-bold truncate leading-tight ${currentTrack === index ? 'text-pink-700' : 'text-gray-800'}`}>
                                        {song.title}
                                    </span>
                                    <span className={`text-[10px] mt-0.5 font-medium uppercase tracking-tight ${currentTrack === index ? 'text-pink-400' : 'text-gray-400'}`}>
                                        {currentTrack === index ? (isPlaying ? '• Playing' : '• Paused') : '• Select to play'}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes music-bar {
                    0%, 100% { height: 40%; }
                    50% { height: 100%; }
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #f472b6;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #db2777;
                }
            `}</style>
        </div>
    )
}
