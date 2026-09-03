"use client";

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

import TeamFamilyTree from '@/components/TeamFamilyTree/TeamFamilyTree';

const VolleyballCourtSection = dynamic(() => import('@/components/VolleyballCourt/VolleyballCourtSection'), {
  ssr: true,
  loading: () => <div className="min-h-[500px] bg-[#030611] flex items-center justify-center text-cyan-400 font-mono text-sm animate-pulse">Loading 3D Court...</div>
});

const PlayersMarquee = dynamic(() => import('../../components/PlayersMarquee/PlayersMarquee'), {
  ssr: true,
  loading: () => <div className="min-h-screen bg-black flex items-center justify-center text-gray-500">Loading Exhibition...</div>
});

const AutoPlayVideo = dynamic(() => import('../../components/AutoPlayVideo/AutoPlayVideo'), {
  ssr: true,
  loading: () => <div className="h-96 md:h-screen bg-black flex items-center justify-center text-gray-500">Loading Video...</div>
});

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const heroRef = useRef<HTMLDivElement | null>(null);
  const [isHeroVisible, setIsHeroVisible] = useState(true);

  const bannerData = [
    {
      id: 1,
      img: "https://res.cloudinary.com/do8awe7fc/image/upload/q_auto/f_auto/v1777145679/IMG_2008_uxdtnc.jpg",
      title: "Aro Ekdin",
      description: "Bound by Passion, Driven by Teamwork"
    },
    {
      id: 2,
      img: "https://res.cloudinary.com/do8awe7fc/image/upload/q_auto/f_auto/v1777145652/IMG_2689_vze9lh.jpg",
      title: "Rise Together",
      description: "Every set, every spike, we play as one."
    },
    {
      id: 3,
      img: "https://res.cloudinary.com/do8awe7fc/image/upload/q_auto/f_auto/v1777145633/IMG_2281_z0lm9k.jpg",
      title: "Elite Action",
      description: "Chasing greatness on and off the court."
    }
  ];

  // Pause slideshow interval when offscreen or tab is backgrounded
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsHeroVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isHeroVisible) return;

    const timer = setInterval(() => {
      if (!document.hidden) {
        setCurrentSlide((prev) => (prev + 1) % bannerData.length);
      }
    }, 4000);

    return () => clearInterval(timer);
  }, [bannerData.length, isHeroVisible]);

  return (
    <>
      <style>
        {`
          .dark-home-bg {
            background-color: #02040a;
          }
          .dark-home-bg > * {
            background-color: inherit;
          }
          /* 3D hover tilt effect with GPU acceleration */
          .player-card-3d {
            transition: transform 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1), box-shadow 0.4s ease;
            transform-style: preserve-3d;
            perspective: 1000px;
            will-change: transform;
            backface-visibility: hidden;
            position: relative;
            background: linear-gradient(135deg, rgba(15,20,35,0.95), rgba(5,5,15,0.98));
            border: 1px solid rgba(255,255,255,0.08);
          }
          .player-card-3d:hover {
            transform: translate3d(0, -8px, 0) rotateX(5deg) rotateY(5deg);
            box-shadow: 0 30px 40px -20px rgba(0, 150, 255, 0.4);
          }
          .player-image {
            transition: transform 0.7s cubic-bezier(0.2, 0.9, 0.4, 1.1);
            will-change: transform;
          }
          .player-card-3d:hover .player-image {
            transform: scale3d(1.05, 1.05, 1);
          }
          .player-card-3d::after {
            content: '';
            position: absolute;
            inset: -1px;
            background: linear-gradient(135deg, #3b82f6, #06b6d4, #4f46e5);
            border-radius: 1.5rem;
            opacity: 0;
            transition: opacity 0.5s ease;
            z-index: -1;
          }
          .player-card-3d:hover::after {
            opacity: 0.7;
          }
          .role-badge {
            background: linear-gradient(135deg, rgba(0,0,0,0.7), rgba(20,20,40,0.8));
            backdrop-filter: blur(8px);
            border: 1px solid rgba(59,130,246,0.4);
            transition: all 0.3s;
          }
          .player-card-3d:hover .role-badge {
            border-color: rgba(6,182,212,0.8);
            box-shadow: 0 0 12px rgba(6,182,212,0.4);
          }
          .player-name {
            transition: all 0.3s ease;
          }
          .player-card-3d:hover .player-name {
            color: white;
          }
          .player-role {
            transition: all 0.3s ease;
          }
          .player-card-3d:hover .player-role {
            color: white;
          }
        `}
      </style>

      <div className="dark-home-bg">
        {/* Hero Banner Section */}
        <section 
          ref={heroRef}
          className="relative w-full h-[80vh] md:h-screen overflow-hidden bg-black font-sans"
        >
          {bannerData.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out will-change-transform ${index === currentSlide ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}
              style={{ willChange: "opacity, transform", transform: "translateZ(0)", backfaceVisibility: "hidden" }}
            >
              <img
                src={slide.img}
                alt={slide.title}
                loading={index === 0 ? "eager" : "lazy"}
                decoding={index === 0 ? "sync" : "async"}
                className={`w-full h-full object-cover object-center ${index === currentSlide ? "animate-zoom" : "scale-100"}`}
                style={{ willChange: "transform", transform: "translateZ(0)", backfaceVisibility: "hidden" }}
              />
              <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/40 to-transparent"></div>
              <div className="absolute inset-0 bg-linear-to-t from-black/90 via-transparent to-transparent"></div>
              <div className="absolute inset-0 flex items-end px-6 md:px-20 pb-12 sm:pb-20 md:pb-32">
                <div className="max-w-3xl">
                  <h1 className={`text-4xl md:text-8xl font-black italic uppercase tracking-tighter text-white transition-all duration-1000 delay-300 transform ${index === currentSlide ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"}`}>
                    {slide.title}
                  </h1>
                  <div className={`h-1.5 bg-red-600 my-4 transition-all duration-[1.5s] delay-500 ${index === currentSlide ? "w-20 md:w-40" : "w-0"}`}></div>
                  <p className={`text-sm md:text-2xl text-gray-300 font-medium tracking-wide max-w-sm md:max-w-md transition-all duration-1000 delay-700 transform ${index === currentSlide ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"}`}>
                    {slide.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
          <div className="absolute bottom-10 right-6 md:right-16 flex flex-col space-y-4 z-30">
            {bannerData.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className="group flex items-center justify-end p-2 cursor-pointer"
              >
                <span className={`mr-3 text-[10px] md:text-xs font-bold transition-all duration-300 ${index === currentSlide ? "text-red-600 opacity-100" : "text-white opacity-0 md:group-hover:opacity-50"}`}>
                  0{index + 1}
                </span>
                <div className={`transition-all duration-500 rounded-full ${index === currentSlide ? "h-8 w-1 bg-red-600 shadow-[0_0_15px_#dc2626]" : "h-3 w-1 bg-white/30"}`} />
              </button>
            ))}
          </div>
          <div className="absolute bottom-0 left-0 w-full h-24 bg-linear-to-t from-black to-transparent pointer-events-none"></div>
        </section>

        <div id="players-marquee" className="bg-[#02040a]">
          <PlayersMarquee />
        </div>

        <div id="video-section" className="bg-[#02040a]">
          <AutoPlayVideo videoSrc="https://res.cloudinary.com/do8awe7fc/video/upload/q_auto/f_auto/v1777145434/MainVideo_rxfdje.mp4" />
        </div>

        {/* Team Family Tree Section */}
        <div id="team-tree">
          <TeamFamilyTree />
        </div>

        {/* 3D Volleyball Court & Lineup Section */}
        <div id="court-lineup">
          <VolleyballCourtSection />
        </div>
        
      </div>
    </>
  );
};

export default Home;
