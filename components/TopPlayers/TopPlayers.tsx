"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { 
  Crown, 
  Zap, 
  Star, 
  ArrowRight, 
  Sparkles
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { Player } from '../../types';

interface TopPlayerItem {
  id: string;
  _id?: string;
  name: string;
  role: string;
  position: string;
  jersey: string;
  img: string;
  work?: string;
  theme: {
    accent: string;
    border: string;
    glow: string;
    gradient: string;
    tagBg: string;
    badgeText: string;
  };
  icon: React.ReactNode;
}

const TOP_PLAYERS: TopPlayerItem[] = [
  {
    id: "12",
    name: "S.Sajjad",
    role: "Game Changer",
    position: "Opposite Hitter",
    work: "BKSP",
    jersey: "12",
    img: "https://res.cloudinary.com/do8awe7fc/image/upload/q_auto/f_auto/v1777145445/Sajjad_egabvp.png",
    theme: {
      accent: "#06b6d4",
      border: "border-cyan-500/40",
      glow: "shadow-[0_0_40px_rgba(6,182,212,0.35)]",
      gradient: "from-cyan-500 via-blue-500 to-indigo-600",
      tagBg: "bg-cyan-950/70 border-cyan-500/40 text-cyan-300",
      badgeText: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
    },
    icon: <Zap className="w-4 h-4 text-cyan-400" />
  },
  {
    id: "3",
    name: "Mizba Al Naim",
    role: "Captain",
    position: "All-Rounder",
    work: "Bangladesh Army",
    jersey: "3",
    img: "https://res.cloudinary.com/do8awe7fc/image/upload/q_auto/f_auto/v1777145439/Mizba_ufaruk.png",
    theme: {
      accent: "#f59e0b",
      border: "border-amber-500/50",
      glow: "shadow-[0_0_45px_rgba(245,158,11,0.4)]",
      gradient: "from-amber-400 via-orange-500 to-red-600",
      tagBg: "bg-amber-950/70 border-amber-500/40 text-amber-300",
      badgeText: "bg-amber-500/20 text-amber-300 border-amber-500/40"
    },
    icon: <Crown className="w-4 h-4 text-amber-400" />
  },
  {
    id: "6",
    _id: "6a148da50ae171c728e3a292",
    name: "Md Shehad",
    role: "Star Performer",
    position: "Outside Hitter",
    work: "Bangladesh Army",
    jersey: "5",
    img: "https://res.cloudinary.com/do8awe7fc/image/upload/q_auto/f_auto/v1777145446/Shehad_tvxges.jpg",
    theme: {
      accent: "#a855f7",
      border: "border-purple-500/40",
      glow: "shadow-[0_0_40px_rgba(168,85,247,0.35)]",
      gradient: "from-purple-500 via-violet-500 to-indigo-600",
      tagBg: "bg-purple-950/70 border-purple-500/40 text-purple-300",
      badgeText: "bg-purple-500/20 text-purple-300 border-purple-500/40"
    },
    icon: <Star className="w-4 h-4 text-purple-400" />
  },
];

const TopPlayers: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const axiosSecure = useAxiosSecure();

  // Fetch players list to match dynamic _id
  const { data: dbPlayers = [] } = useQuery<Player[]>({
    queryKey: ['players'],
    queryFn: async () => {
      const res = await axiosSecure.get('/players');
      return res.data;
    }
  });

  const getProfileLink = (player: TopPlayerItem) => {
    if (player._id) {
      return `/players/${player._id}`;
    }
    const targetJersey = parseInt(player.jersey, 10);
    const targetId = parseInt(player.id, 10);
    const matched = dbPlayers.find((p) => {
      const jNum = parseInt(String(p.jersey), 10);
      const pId = (p as any).id;
      return (
        (pId && Number(pId) === targetId) ||
        (jNum && jNum === targetJersey) ||
        p.name?.toLowerCase() === player.name.toLowerCase()
      );
    });

    if (matched?._id) {
      return `/players/${matched._id}`;
    }
    return `/players/${player.id || ''}`;
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 14
      }
    }
  };

  return (
    <section className="relative py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-linear-to-b from-[#020307] via-[#050914] to-[#020307] overflow-hidden text-white cv-auto">
      {/* Background Ambient Glow Lights */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[450px] bg-blue-600/10 blur-[170px] rounded-full"></div>
        <div className="absolute top-1/4 left-10 w-[450px] h-[350px] bg-cyan-600/10 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-1/4 right-10 w-[450px] h-[350px] bg-purple-600/10 blur-[150px] rounded-full"></div>
        
        {/* Subtle Cyber Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] bg-size-[36px_36px] opacity-10"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-cyan-500/25 to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Centered Section Header */}
        <div className="flex flex-col items-center justify-center text-center mb-16 md:mb-24 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-cyan-950/50 border border-cyan-500/30 text-cyan-300 text-xs font-mono tracking-[0.3em] uppercase shadow-[0_0_20px_rgba(6,182,212,0.25)] backdrop-blur-md"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>HALL OF LEGENDS</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight uppercase italic text-center w-full"
          >
            <span className="bg-linear-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent filter drop-shadow-[0_0_30px_rgba(59,130,246,0.4)] inline-block">
              Top Performers
            </span>
          </motion.h2>

          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto font-light text-center">
            Meet the driving force and match-winners behind Aro Ekdin Volleyball Club.
          </p>

          <div className="flex justify-center items-center gap-2 pt-2 mx-auto">
            <div className="w-12 h-0.5 bg-linear-to-r from-transparent to-cyan-500 rounded-full"></div>
            <div className="w-3 h-3 rotate-45 border border-cyan-400 bg-cyan-500/30 shadow-[0_0_10px_#06b6d4]"></div>
            <div className="w-12 h-0.5 bg-linear-to-l from-transparent to-cyan-500 rounded-full"></div>
          </div>
        </div>

        {/* 3D Elite Cards Showcase Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 items-stretch"
        >
          {TOP_PLAYERS.map((player, index) => {
            const isCaptain = player.role === "Captain";
            const profileUrl = getProfileLink(player);

            return (
              <motion.div
                key={player.id}
                variants={cardVariants}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`relative group rounded-[2.2rem] overflow-hidden transition-all duration-500 ${
                  isCaptain ? 'md:-translate-y-4' : ''
                }`}
                style={{ willChange: "transform, opacity", transform: "translateZ(0)", backfaceVisibility: "hidden" }}
              >
                {/* Cyber Card Container */}
                <div className={`relative h-full flex flex-col justify-between rounded-[2.2rem] bg-linear-to-b from-[#0b1222]/90 via-[#070b15]/95 to-[#04060d] border ${player.theme.border} p-6 sm:p-7 backdrop-blur-xl shadow-2xl transition-all duration-500 group-hover:border-opacity-100 group-hover:${player.theme.glow} group-hover:-translate-y-2`}>
                  
                  {/* Card Background Ambient Spotlight */}
                  <div 
                    className="absolute -top-20 -right-20 w-48 h-48 rounded-full blur-3xl opacity-20 group-hover:opacity-45 transition-opacity pointer-events-none"
                    style={{ backgroundColor: player.theme.accent }}
                  />

                  {/* Top Badge & Jersey Header */}
                  <div className="relative z-10 flex items-center justify-between gap-2 mb-4">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border backdrop-blur-md text-xs font-black uppercase tracking-wider ${player.theme.tagBg}`}>
                      {player.icon}
                      <span>{player.role}</span>
                    </div>

                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 border border-white/15 backdrop-blur-md">
                      <span className="text-[10px] text-slate-400 font-mono font-semibold">JERSEY</span>
                      <span className="text-sm font-black text-white">#{player.jersey}</span>
                    </div>
                  </div>

                  {/* Player Image Showcase */}
                  <div className="relative w-full h-80 sm:h-84 md:h-80 lg:h-96 rounded-2xl overflow-hidden mb-5 bg-linear-to-b from-white/5 to-transparent border border-white/10 group-hover:border-white/20 transition-all">
                    {/* Glowing Aura Ring */}
                    <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/80 pointer-events-none z-10"></div>

                    <img
                      src={player.img}
                      alt={player.name}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-108"
                      style={{ willChange: "transform", transform: "translateZ(0)", backfaceVisibility: "hidden" }}
                    />

                    {/* Bottom Image Gradient Overlay */}
                    <div className="absolute inset-0 bg-linear-to-t from-[#070b15] via-transparent to-transparent pointer-events-none z-10"></div>

                    {/* Position Pill Overlay */}
                    <div className="absolute bottom-3 left-3 z-20">
                      <span className="px-3 py-1 rounded-xl bg-black/75 border border-white/15 backdrop-blur-md text-[11px] font-bold text-slate-200 tracking-wide">
                        {player.position}
                      </span>
                    </div>
                  </div>

                  {/* Player Info & View Profile CTA */}
                  <div className="relative z-10 space-y-5 text-center">
                    <div>
                      <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-linear-to-r group-hover:from-white group-hover:to-slate-300 transition-colors">
                        {player.name}
                      </h3>
                      <div className="flex items-center justify-center gap-2 mt-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span className="text-xs font-semibold text-slate-400">{player.work}</span>
                      </div>
                    </div>

                    {/* CTA Button -> Direct to Player Profile */}
                    <Link href={profileUrl} className="block w-full">
                      <button className={`w-full py-3.5 px-4 rounded-2xl bg-linear-to-r ${player.theme.gradient} text-white font-extrabold text-xs uppercase tracking-wider shadow-lg hover:shadow-cyan-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer border border-white/20`}>
                        <span>View Profile</span>
                        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
                      </button>
                    </Link>
                  </div>

                  {/* Corner Glow Accent */}
                  <div 
                    className="absolute bottom-0 left-10 right-10 h-[2px] rounded-full opacity-60 group-hover:opacity-100 transition-opacity"
                    style={{ backgroundColor: player.theme.accent }}
                  />
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* View All Squad CTA Button */}
        <div className="text-center mt-16 md:mt-20">
          <Link href="/players">
            <button className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-black/70 hover:bg-cyan-950/60 border border-cyan-500/40 hover:border-cyan-400 text-white font-black text-sm uppercase tracking-widest shadow-[0_0_30px_rgba(6,182,212,0.25)] hover:shadow-[0_0_40px_rgba(6,182,212,0.5)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer backdrop-blur-xl">
              <span>EXPLORE COMPLETE SQUAD</span>
              <div className="w-7 h-7 rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                <ArrowRight className="w-4 h-4 text-cyan-300" />
              </div>
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TopPlayers;
