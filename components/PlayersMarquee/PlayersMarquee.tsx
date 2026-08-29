"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  Maximize2, 
  X, 
  Layers, 
  Flame,
  Camera
} from 'lucide-react';
import { useElementOnScreen } from '../../hooks/useElementOnScreen';

interface ActionItem {
  id: number;
  title: string;
  subtitle: string;
  tag: string;
  match: string;
  img: string;
}

const ACTION_PHOTOS: ActionItem[] = [
  {
    id: 1,
    title: "Thunder Spike",
    subtitle: "Aro Ekdin Championship",
    tag: "Spike Action",
    match: "Grand Final Set 3",
    img: "https://res.cloudinary.com/do8awe7fc/image/upload/q_auto/f_auto/v1777145490/Action4_r4hccj.jpg"
  },
  {
    id: 2,
    title: "Wall of Defense",
    subtitle: "Double Block Masterclass",
    tag: "Defense",
    match: "Semi-Final vs Titans",
    img: "https://res.cloudinary.com/do8awe7fc/image/upload/q_auto/f_auto/v1777145489/Action3_skmfkv.jpg"
  },
  {
    id: 3,
    title: "Pure Athleticism",
    subtitle: "Flying Libero Dig",
    tag: "Save",
    match: "Tournament Opener",
    img: "https://res.cloudinary.com/do8awe7fc/image/upload/q_auto/f_auto/v1777145487/Action1_rsrzvd.jpg"
  },
  {
    id: 4,
    title: "Sky Spike",
    subtitle: "Crucial Game Point Attack",
    tag: "Attack",
    match: "Quarter Final Climax",
    img: "https://res.cloudinary.com/do8awe7fc/image/upload/q_auto/f_auto/v1777145486/Action5_mhdswz.jpg"
  },
  {
    id: 5,
    title: "Unstoppable Force",
    subtitle: "Precision Tactical Serve",
    tag: "Serve Ace",
    match: "League Match 12",
    img: "https://res.cloudinary.com/do8awe7fc/image/upload/q_auto/f_auto/v1777145484/Action2_xjcmrw.jpg"
  },
  {
    id: 6,
    title: "Perfect Setup",
    subtitle: "Deceptive Setter Quick",
    tag: "Assist",
    match: "Super Sunday Clash",
    img: "https://res.cloudinary.com/do8awe7fc/image/upload/q_auto/f_auto/v1777145490/Action4_r4hccj.jpg"
  },
  {
    id: 7,
    title: "Iron Net Presence",
    subtitle: "Solo Block Rejection",
    tag: "Block",
    match: "Derby Rivalry Match",
    img: "https://res.cloudinary.com/do8awe7fc/image/upload/q_auto/f_auto/v1777145489/Action3_skmfkv.jpg"
  },
  {
    id: 8,
    title: "Championship Celebration",
    subtitle: "Victory Moment of Glory",
    tag: "Victory",
    match: "Trophy Presentation",
    img: "https://res.cloudinary.com/do8awe7fc/image/upload/q_auto/f_auto/v1777145487/Action1_rsrzvd.jpg"
  }
];

export default function Ultimate3DCarousel() {
  const [containerRef, isVisible] = useElementOnScreen({ threshold: 0.1 });
  const [viewMode, setViewMode] = useState<'cylinder' | 'stream'>('cylinder');
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState<'normal' | 'fast'>('normal');
  const [activeModalItem, setActiveModalItem] = useState<ActionItem | null>(null);

  // Touch & Drag state
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startAngle = useRef(0);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  const totalCards = ACTION_PHOTOS.length;
  const angleStep = 360 / totalCards;

  // Active highlighted card calculation
  const normalizedAngle = ((rotationAngle % 360) + 360) % 360;
  const activeIndex = Math.round((360 - normalizedAngle) / angleStep) % totalCards;

  // Smooth Auto-Rotation Loop with timestamp delta
  useEffect(() => {
    if (!isPlaying || !isVisible) {
      lastTimeRef.current = null;
      return;
    }

    const degPerSecond = speed === 'fast' ? 14 : 7.5;

    const animate = (time: number) => {
      if (lastTimeRef.current !== null) {
        const delta = (time - lastTimeRef.current) / 1000;
        setRotationAngle((prev) => prev - degPerSecond * delta);
      }
      lastTimeRef.current = time;
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, isVisible, speed]);

  // Touch / Mouse Drag handlers for smooth 3D spinning
  const handleDragStart = (clientX: number) => {
    isDragging.current = true;
    startX.current = clientX;
    startAngle.current = rotationAngle;
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging.current) return;
    const deltaX = clientX - startX.current;
    // Sensitivity factor (1px = 0.35 degrees)
    setRotationAngle(startAngle.current + deltaX * 0.35);
  };

  const handleDragEnd = () => {
    isDragging.current = false;
  };

  const rotateToStep = (direction: 'prev' | 'next') => {
    const step = direction === 'next' ? -angleStep : angleStep;
    setRotationAngle((prev) => Math.round((prev + step) / angleStep) * angleStep);
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full min-h-screen bg-linear-to-b from-[#04060d] via-[#020307] to-[#04060d] flex flex-col items-center justify-center py-16 px-3 sm:px-6 lg:px-8 overflow-hidden font-sans text-white select-none cv-auto"
    >
      {/* Background Lighting & Radial Mesh */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-cyan-600/10 blur-[160px] rounded-full"></div>
        <div className="absolute bottom-10 left-10 w-[500px] h-[350px] bg-blue-600/10 blur-[140px] rounded-full"></div>
        <div className="absolute top-10 right-10 w-[500px] h-[350px] bg-indigo-600/10 blur-[140px] rounded-full"></div>
        
        {/* Subtle Cyber Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e3a8a_1px,transparent_1px)] bg-size-[40px_40px] opacity-15"></div>
      </div>

      {/* Header Section */}
      <div className="relative z-20 text-center max-w-4xl mx-auto mb-10 sm:mb-14 space-y-4 px-4">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-xs font-mono tracking-[0.25em] uppercase shadow-[0_0_20px_rgba(6,182,212,0.2)] backdrop-blur-md"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>Interactive 3D Exhibition</span>
        </motion.div>

        <motion.h2 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight uppercase italic"
        >
          <span className="bg-linear-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent filter drop-shadow-[0_0_25px_rgba(59,130,246,0.35)]">
            Moments of Action
          </span>
        </motion.h2>

        

        {/* Mode Switch Tabs & Controls Bar */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <div className="flex items-center p-1 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl">
            <button
              onClick={() => setViewMode('cylinder')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                viewMode === 'cylinder'
                  ? 'bg-linear-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.5)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>3D Arena</span>
            </button>
            <button
              onClick={() => setViewMode('stream')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                viewMode === 'stream'
                  ? 'bg-linear-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.5)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Action Stream</span>
            </button>
          </div>
        </div>
      </div>

      {/* VIEW MODE 1: 3D CYLINDER ARENA */}
      {viewMode === 'cylinder' && (
        <div 
          className="relative w-full flex flex-col items-center justify-center"
          onMouseLeave={handleDragEnd}
          onMouseDown={(e) => handleDragStart(e.clientX)}
          onMouseMove={(e) => handleDragMove(e.clientX)}
          onMouseUp={handleDragEnd}
          onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
          onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
          onTouchEnd={handleDragEnd}
        >
          {/* 3D Perspective Wrapper */}
          <div className="relative w-full flex items-center justify-center arena-3d-perspective py-12 md:py-20 cursor-grab active:cursor-grabbing">
            {/* Glowing 3D Arena Ground Ring */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 arena-ground-ring pointer-events-none">
              <div className="w-full h-full rounded-full border-2 border-cyan-500/25 shadow-[0_0_50px_rgba(6,182,212,0.25)] animate-pulse"></div>
            </div>

            {/* 3D Carousel Cylinder Ring */}
            <div 
              className="arena-cylinder-spinner"
              style={{
                transform: `rotateY(${rotationAngle}deg)`,
              }}
            >
              {ACTION_PHOTOS.map((item, index) => {
                const rotation = index * angleStep;
                const isCurrentActive = index === activeIndex;

                return (
                  <div
                    key={item.id}
                    className="arena-card-slot"
                    style={{
                      '--rotation': `${rotation}deg`,
                    } as React.CSSProperties}
                  >
                    <div 
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveModalItem(item);
                      }}
                      className={`arena-card-content group relative w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden border backdrop-blur-md transition-all duration-500 cursor-pointer ${
                        isCurrentActive
                          ? 'border-cyan-400 shadow-[0_0_35px_rgba(6,182,212,0.45)] scale-105'
                          : 'border-white/15 bg-gray-950/60 shadow-[0_15px_35px_rgba(0,0,0,0.6)] hover:border-cyan-400/60 hover:scale-105'
                      }`}
                    >
                      {/* Photo Image */}
                      <img 
                        src={item.img} 
                        alt={item.title} 
                        className="w-full h-full object-cover object-center transform transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                        decoding="async"
                        style={{ willChange: "transform", transform: "translateZ(0)", backfaceVisibility: "hidden" }}
                      />

                      {/* Glass Gradients */}
                      <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/30 to-transparent p-4 sm:p-6 flex flex-col justify-between pointer-events-none">
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 text-[10px] sm:text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                            {item.tag}
                          </span>
                          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/50 border border-white/20 flex items-center justify-center text-white/80 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Maximize2 className="w-3.5 h-3.5" />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <p className="text-white font-black text-base sm:text-xl md:text-2xl tracking-tight line-clamp-1 group-hover:text-cyan-300 transition-colors">
                            {item.title}
                          </p>
                          <p className="text-slate-300 text-xs sm:text-sm line-clamp-1 font-medium">
                            {item.subtitle}
                          </p>
                          <div className="pt-2 flex items-center gap-1.5 text-[10px] sm:text-xs text-cyan-400/90 font-mono">
                            <Camera className="w-3 h-3 text-cyan-400" />
                            <span>{item.match}</span>
                          </div>
                        </div>
                      </div>

                      {/* Active Cyber Edge Highlight */}
                      {isCurrentActive && (
                        <div className="absolute inset-0 rounded-2xl sm:rounded-3xl border-2 border-cyan-400/80 pointer-events-none animate-pulse"></div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Control Dock */}
          <div className="relative z-20 flex flex-wrap items-center justify-center gap-3 mt-20  sm:gap-4 mt-12">
            <button
              onClick={() => rotateToStep('prev')}
              className="p-3 sm:p-3.5 rounded-full bg-black/60 hover:bg-cyan-950/70 border border-white/15 hover:border-cyan-500/50 text-white shadow-xl hover:shadow-cyan-500/20 hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer backdrop-blur-md"
              title="Previous Action"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-2 px-5 py-3 rounded-full bg-linear-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>Pause Rotation</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Auto Rotate</span>
                </>
              )}
            </button>

            <button
              onClick={() => setSpeed(speed === 'normal' ? 'fast' : 'normal')}
              className="px-4 py-3 rounded-full bg-black/60 hover:bg-white/10 border border-white/15 text-slate-300 hover:text-white text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer backdrop-blur-md"
            >
              Speed: <span className="text-cyan-400 font-black">{speed.toUpperCase()}</span>
            </button>

            <button
              onClick={() => rotateToStep('next')}
              className="p-3 sm:p-3.5 rounded-full bg-black/60 hover:bg-cyan-950/70 border border-white/15 hover:border-cyan-500/50 text-white shadow-xl hover:shadow-cyan-500/20 hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer backdrop-blur-md"
              title="Next Action"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          
        </div>
      )}

      {/* VIEW MODE 2: INFINITE DUAL-STREAM MARQUEE */}
      {viewMode === 'stream' && (
        <div className="relative w-full space-y-6 sm:space-y-8 py-6">
          {/* Top Marquee (Left Scroll) */}
          <div className="relative w-full overflow-hidden flex [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
            <div className="flex gap-4 sm:gap-6 animate-marquee-left hover:[animation-play-state:paused] py-2">
              {[...ACTION_PHOTOS, ...ACTION_PHOTOS].map((item, idx) => (
                <div
                  key={`top-${idx}`}
                  onClick={() => setActiveModalItem(item)}
                  className="group relative w-64 sm:w-80 h-44 sm:h-52 shrink-0 rounded-2xl overflow-hidden border border-white/15 bg-gray-900/60 backdrop-blur-md shadow-xl hover:border-cyan-400 hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all duration-500 hover:-translate-y-2 cursor-pointer"
                >
                  <img 
                    src={item.img} 
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent p-4 flex flex-col justify-end">
                    <span className="w-fit text-[10px] font-bold px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 mb-1">
                      {item.tag}
                    </span>
                    <p className="text-white font-bold text-base truncate">{item.title}</p>
                    <p className="text-slate-400 text-xs truncate">{item.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Marquee (Right Scroll) */}
          <div className="relative w-full overflow-hidden flex [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
            <div className="flex gap-4 sm:gap-6 animate-marquee-right hover:[animation-play-state:paused] py-2">
              {[...ACTION_PHOTOS.slice().reverse(), ...ACTION_PHOTOS.slice().reverse()].map((item, idx) => (
                <div
                  key={`bottom-${idx}`}
                  onClick={() => setActiveModalItem(item)}
                  className="group relative w-64 sm:w-80 h-44 sm:h-52 shrink-0 rounded-2xl overflow-hidden border border-white/15 bg-gray-900/60 backdrop-blur-md shadow-xl hover:border-blue-400 hover:shadow-[0_0_25px_rgba(59,130,246,0.4)] transition-all duration-500 hover:-translate-y-2 cursor-pointer"
                >
                  <img 
                    src={item.img} 
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent p-4 flex flex-col justify-end">
                    <span className="w-fit text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30 mb-1">
                      {item.tag}
                    </span>
                    <p className="text-white font-bold text-base truncate">{item.title}</p>
                    <p className="text-slate-400 text-xs truncate">{item.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* FULLSCREEN PREVIEW LIGHTBOX MODAL */}
      <AnimatePresence>
        {activeModalItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl bg-[#090e18] border border-cyan-500/40 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.35)]"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveModalItem(null)}
                className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white hover:text-cyan-300 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-12">
                <div className="md:col-span-8 relative h-72 sm:h-96 md:h-[480px]">
                  <img 
                    src={activeModalItem.img} 
                    alt={activeModalItem.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-[#090e18] via-transparent to-transparent md:hidden"></div>
                </div>

                <div className="md:col-span-4 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                  <div>
                    <span className="inline-block px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-4">
                      {activeModalItem.tag}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                      {activeModalItem.title}
                    </h3>
                    <p className="text-slate-300 text-sm mt-2 font-medium">
                      {activeModalItem.subtitle}
                    </p>
                    <div className="mt-4 p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-400 space-y-1.5 font-mono">
                      <p>🏆 Match: <span className="text-white font-bold">{activeModalItem.match}</span></p>
                      <p>⚡ Team: <span className="text-cyan-300 font-bold">Aro Ekdin Volleyball</span></p>
                      <p>✨ Quality: <span className="text-emerald-400 font-bold">HD Master Snapshot</span></p>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveModalItem(null)}
                    className="w-full py-3 rounded-xl bg-linear-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm tracking-wide shadow-lg hover:shadow-cyan-500/40 transition-all cursor-pointer"
                  >
                    Close Showcase
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3D ARENA & MARQUEE CSS STYLES */}
      <style>{`
        .arena-3d-perspective {
          perspective: 2000px;
        }

        .arena-ground-ring {
          width: 750px;
          height: 750px;
          transform: translate(-50%, -50%) rotateX(75deg);
          transform-style: preserve-3d;
        }

        .arena-cylinder-spinner {
          position: relative;
          width: 290px;
          height: 420px;
          transform-style: preserve-3d;
          will-change: transform;
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
          transition: transform 0.15s ease-out;
          --arena-radius: 640px;
        }

        .arena-card-slot {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          transform-style: preserve-3d;
          will-change: transform;
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
          transform: rotateY(var(--rotation, 0deg)) translateZ(var(--arena-radius, 640px));
        }

        @keyframes marqueeLeft {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }

        @keyframes marqueeRight {
          0% { transform: translate3d(-50%, 0, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }

        .animate-marquee-left {
          display: flex;
          width: max-content;
          animation: marqueeLeft 30s linear infinite;
          will-change: transform;
        }

        .animate-marquee-right {
          display: flex;
          width: max-content;
          animation: marqueeRight 30s linear infinite;
          will-change: transform;
        }

        /* Responsive Breakpoints */
        @media (max-width: 1024px) {
          .arena-3d-perspective {
            perspective: 1600px;
          }
          .arena-cylinder-spinner {
            width: 240px;
            height: 350px;
            --arena-radius: 500px;
          }
          .arena-ground-ring {
            width: 600px;
            height: 600px;
          }
        }

        @media (max-width: 768px) {
          .arena-3d-perspective {
            perspective: 1300px;
          }
          .arena-cylinder-spinner {
            width: 195px;
            height: 290px;
            --arena-radius: 380px;
          }
          .arena-ground-ring {
            width: 460px;
            height: 460px;
          }
        }

        @media (max-width: 480px) {
          .arena-3d-perspective {
            perspective: 1000px;
          }
          .arena-cylinder-spinner {
            width: 160px;
            height: 240px;
            --arena-radius: 290px;
          }
          .arena-ground-ring {
            width: 350px;
            height: 350px;
          }
        }

        @media (max-width: 360px) {
          .arena-3d-perspective {
            perspective: 850px;
          }
          .arena-cylinder-spinner {
            width: 140px;
            height: 210px;
            --arena-radius: 240px;
          }
          .arena-ground-ring {
            width: 290px;
            height: 290px;
          }
        }
      `}</style>
    </div>
  );
}
