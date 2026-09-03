"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Crown, 
  Sparkles, 
  Shield, 
  Zap, 
  Users, 
  ExternalLink,
  Search,
  Network,
  ZoomIn,
  ZoomOut,
  Maximize2,
  X,
  Activity,
  ArrowRight
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../hooks/useAxios";
import { Player } from "../../types";

// Default fallback players (Exact 15 players from server database)
const FALLBACK_ROOT_PLAYER: Player = {
  _id: "6a148da50ae171c728e3a28f",
  id: 3,
  jersey: "3",
  name: "Mizba Al Naim",
  position: "Middle Blocker",
  work: "Bangladesh Army",
  img: "https://res.cloudinary.com/do8awe7fc/image/upload/q_auto/f_auto/v1777145439/Mizba_ufaruk.png",
  age: 25,
  height: "5'11\"",
  weight: "80 kg",
  Birthdate: "10/12/2000",
  DominantHand: "Right",
  phone: "01828034641",
  nationality: "Bangladeshi",
  facebook: "https://www.facebook.com/all.mijba",
  instagram: "https://www.instagram.com/mizbaalnaim88/?__pwa=1",
  whatsapp: "https://wa.me/8801828034641?text=Hello%20bro",
};

const FALLBACK_PLAYERS: Player[] = [
  FALLBACK_ROOT_PLAYER,
  {
    _id: "6a148da50ae171c728e3a292",
    id: 6,
    jersey: "5",
    name: "Md Shehad",
    position: "Outside Hitter",
    work: "Bangladesh Army",
    img: "https://res.cloudinary.com/do8awe7fc/image/upload/q_auto/f_auto/v1777145446/Shehad_tvxges.jpg",
    age: 22,
    height: "6'0\"",
    weight: "70 kg",
    Birthdate: "06/05/2003",
    DominantHand: "Right",
    phone: "",
    nationality: "Bangladeshi",
    facebook: "https://www.facebook.com/shehad.molla",
    instagram: "https://www.instagram.com/shehad.molla/",
    whatsapp: "https://web.whatsapp.com/",
  },
  {
    _id: "6a148da50ae171c728e3a298",
    id: 12,
    jersey: "12",
    name: "S.Sazzad",
    position: "Opposite Hitter",
    work: "BKSP",
    img: "https://res.cloudinary.com/do8awe7fc/image/upload/q_auto/f_auto/v1777145445/Sajjad_egabvp.png",
    age: "15",
    height: "6'1\"",
    weight: "67 kg",
    Birthdate: "03/03/2012",
    DominantHand: "Right",
    phone: "N/A",
    nationality: "Bangladeshi",
    facebook: "https://www.facebook.com/profile.php?id=61578778785022",
    instagram: "https://www.instagram.com",
    whatsapp: "https://wa.me/8801000000000?text=Hello%20bro",
  },
  {
    _id: "6a148da50ae171c728e3a29a",
    id: 14,
    jersey: "1",
    name: "MD Mahadir Hassan",
    position: "Outside Hitter",
    work: "Verified Player",
    img: "https://res.cloudinary.com/do8awe7fc/image/upload/q_auto/f_auto/v1777145442/Ridoy_bqraav.jpg",
    age: 22,
    height: "5'7\"",
    weight: "73 kg",
    Birthdate: "13/10/2003",
    DominantHand: "Left",
    phone: "01706414258",
    nationality: "Bangladeshi",
    facebook: "https://www.facebook.com/md.mahadir.hassan.511271",
    instagram: "https://www.instagram.com",
    whatsapp: "https://wa.me/8801706414258?text=Hello%20bro",
  },
  {
    _id: "6a148da50ae171c728e3a29b",
    id: 22,
    jersey: "22",
    name: "Thasin",
    position: "Opposite Hitter",
    work: "Verified Player",
    img: "https://res.cloudinary.com/do8awe7fc/image/upload/q_auto/f_auto/v1777145449/Tasin_ps5hrl.png",
    age: 14,
    height: "6'3\"",
    weight: "65 kg",
    Birthdate: "04/12/2011",
    DominantHand: "Right",
    phone: "01864450133",
    nationality: "Bangladeshi",
    facebook: "https://www.facebook.com/mt.tahsin.772684",
    instagram: "https://www.instagram.com",
    whatsapp: "https://wa.me/8801864450133?text=Hello%20br",
  },
  {
    _id: "6a148da50ae171c728e3a29c",
    id: 75,
    jersey: "75",
    name: "Akash Islam Shawon",
    position: "Opposite Hitter",
    work: "Verified Player",
    img: "https://res.cloudinary.com/do8awe7fc/image/upload/q_auto/f_auto/v1777145445/Shawon_ldtsie.jpg",
    age: 23,
    height: "5'10\"",
    weight: "65 kg",
    Birthdate: "25/05/2002",
    DominantHand: "Right",
    phone: "01648508526",
    nationality: "Bangladeshi",
    facebook: "https://www.facebook.com/akash.islam.shawon.2024",
    instagram: "https://www.instagram.com/akash_islamshawon/?__pwa=1",
    whatsapp: "https://wa.me/01648508526?text=Hello%20br",
  },
  {
    _id: "6a148da50ae171c728e3a290",
    id: 4,
    jersey: "4",
    name: "RA K IB",
    position: "Setter",
    work: "Bangladesh Army",
    img: "https://res.cloudinary.com/do8awe7fc/image/upload/q_auto/f_auto/v1777145442/Rakib2_t03bxk.png",
    age: 23,
    height: "5'8\"",
    weight: "70 kg",
    Birthdate: "10/06/2003",
    DominantHand: "Right",
    phone: "01921252645",
    nationality: "Bangladeshi",
    facebook: "https://www.facebook.com/ra.k.ib.121441",
    instagram: "https://www.instagram.com/rakibislam9759?igsh=Y2czcHdpaGlqaWln",
    whatsapp: "https://wa.me/8801921252645?text=Hello%20bro",
  },
  {
    _id: "6a148da50ae171c728e3a295",
    id: 9,
    jersey: "8",
    name: "Tanvir Islam Tamim",
    position: "Setter",
    work: "Verified Player",
    img: "https://res.cloudinary.com/do8awe7fc/image/upload/q_auto/f_auto/v1777145446/Tanvir_czxdcb.jpg",
    age: 20,
    height: "5'8\"",
    weight: "72 kg",
    Birthdate: "31/01/2006",
    DominantHand: "Left",
    phone: "01742582808",
    nationality: "Bangladeshi",
    facebook: "https://www.facebook.com/Tanvirislamtamim41",
    instagram: "https://www.instagram.com/tanvir_islam_tamim_41/?__pwa=1",
    whatsapp: "https://wa.me/8801742582808?text=Hello%20bro",
  },
  {
    _id: "6a148da50ae171c728e3a297",
    id: 11,
    jersey: "10",
    name: "Sajjad Hosen Sakib",
    position: "Setter",
    work: "Bangladesh Army",
    img: "https://res.cloudinary.com/do8awe7fc/image/upload/q_auto/f_auto/v1777145444/Sakib_akv11o.jpg",
    age: 21,
    height: "5'8\"",
    weight: "70 kg",
    Birthdate: "05/03/2005",
    DominantHand: "Right",
    phone: "01314803315",
    nationality: "Bangladeshi",
    facebook: "https://www.facebook.com/sajjad.hosen.sakib.2025",
    instagram: "https://www.instagram.com/sakibsajjadhossen/?__pwa=1",
    whatsapp: "https://wa.me/8801314803315?text=Hello%20bro",
  },
  {
    _id: "6a148da50ae171c728e3a299",
    id: 13,
    jersey: "12",
    name: "Jubaid Hossain Chanchal",
    position: "Setter",
    work: "Verified Player",
    img: "https://res.cloudinary.com/do8awe7fc/image/upload/q_auto/f_auto/v1777147510/Chanchal_y7fhnc.jpg",
    age: 21,
    height: "5'7\"",
    weight: "51 kg",
    Birthdate: "01/01/2006",
    DominantHand: "Right",
    phone: "01882457135",
    nationality: "Bangladeshi",
    facebook: "https://www.facebook.com/jubaidhossain.chanchal",
    instagram: "https://www.instagram.com/jubaid7535/?__pwa=1",
    whatsapp: "https://wa.me/8801882457135?text=Hello%20bro",
  },
  {
    _id: "6a148da50ae171c728e3a291",
    id: 5,
    jersey: "5",
    name: "Md Maksudur Rahman",
    position: "Libero",
    work: "Verified Player",
    img: "https://res.cloudinary.com/do8awe7fc/image/upload/q_auto/f_auto/v1777145443/Rony_e7x9pr.jpg",
    age: 22,
    height: "5'8\"",
    weight: "80 kg",
    Birthdate: "01/01/2004",
    DominantHand: "Right",
    phone: "01648238359",
    nationality: "Bangladeshi",
    facebook: "https://www.facebook.com/mdmaksudurrahman.01",
    instagram: "https://www.instagram.com/mdmaksudurrahman.01/?__pwa=1",
    whatsapp: "https://wa.me/8801648238359?text=Hello%20bro",
  },
  {
    _id: "6a148da50ae171c728e3a293",
    id: 7,
    jersey: "6",
    name: "Rana Mridha",
    position: "Libero",
    work: "Verified Player",
    img: "https://res.cloudinary.com/do8awe7fc/image/upload/q_auto/f_auto/v1777145442/Rana_b2f5yo.png",
    age: 20,
    height: "5'6\"",
    weight: "60 kg",
    Birthdate: "01/10/2006",
    DominantHand: "Right",
    phone: "01312981263",
    nationality: "Bangladeshi",
    facebook: "https://www.facebook.com/share/18eHBBqAM5/",
    instagram: "https://www.instagram.com/rana_mridha_6s/?__pwa=1",
    whatsapp: "https://wa.me/8801312981263?text=Hello%20bro",
  },
  {
    _id: "6a148da50ae171c728e3a294",
    id: 8,
    jersey: "7",
    name: "Sabbir Mia",
    position: "Libero",
    work: "Verified Player",
    img: "https://res.cloudinary.com/do8awe7fc/image/upload/q_auto/f_auto/v1777145443/Sabbir_msthqh.jpg",
    age: 18,
    height: "5'5\"",
    weight: "50 kg",
    Birthdate: "27/02/2008",
    DominantHand: "Right",
    phone: "01817300660",
    nationality: "Bangladeshi",
    facebook: "https://www.facebook.com/profile.php?id=61577000834786",
    instagram: "https://www.instagram.com/md.sabbirmia20008/?__pwa=1",
    whatsapp: "https://wa.me/8801817300660?text=Hello%20bro",
  },
  {
    _id: "6a148da50ae171c728e3a296",
    id: 10,
    jersey: "9",
    name: "Rakib Mahmud",
    position: "Libero",
    work: "Verified Player",
    img: "https://res.cloudinary.com/do8awe7fc/image/upload/q_auto/f_auto/v1777145441/Rakib_wbdq0e.png",
    age: 21,
    height: "5'8\"",
    weight: "76 kg",
    Birthdate: "05/03/2005",
    DominantHand: "Right",
    phone: "01793908746",
    nationality: "Bangladeshi",
    facebook: "https://www.facebook.com/rakib.mahamud.950028",
    instagram: "https://www.instagram.com/durjoy_mahamud__rakib/?__pwa=1",
    whatsapp: "https://wa.me/8801793908746?text=Hello%20bro",
  },
  {
    _id: "6a148da50ae171c728e3a29d",
    id: 99,
    jersey: "99",
    name: "MD Josim Talukder",
    position: "Libero",
    work: "Verified Player",
    img: "https://res.cloudinary.com/do8awe7fc/image/upload/q_auto/f_auto/v1777145438/Josim_omxn7y.jpg",
    age: 26,
    height: "5'8\"",
    weight: "60 kg",
    Birthdate: "10/01/2000",
    DominantHand: "Right",
    phone: "01789752340",
    nationality: "Bangladeshi",
    facebook: "https://www.facebook.com/T.Josim.10",
    instagram: "https://www.instagram.com/akash_islamshawon/?__pwa=1",
    whatsapp: "https://wa.me/01789752340?text=Hello%20br",
  },
];

export const TeamFamilyTree: React.FC = () => {
  const axios = useAxios();
  const [searchQuery, setSearchQuery] = useState("");
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  const { data: dbPlayers = FALLBACK_PLAYERS } = useQuery<Player[]>({
    queryKey: ["tree-players"],
    queryFn: async () => {
      try {
        const res = await axios.get("/players");
        return Array.isArray(res.data) && res.data.length > 0 ? res.data : FALLBACK_PLAYERS;
      } catch (err) {
        console.warn("Could not fetch live players, using fallback data:", err);
        return FALLBACK_PLAYERS;
      }
    },
    initialData: FALLBACK_PLAYERS,
    retry: 1,
  });

  const playersList = useMemo(() => {
    if (Array.isArray(dbPlayers) && dbPlayers.length > 0) {
      return dbPlayers;
    }
    return FALLBACK_PLAYERS;
  }, [dbPlayers]);

  // Root Node: Jersey #3 (Mizba Al Naim - Team Captain)
  const rootPlayer = useMemo(() => {
    const list = Array.isArray(playersList) ? playersList : FALLBACK_PLAYERS;
    const found = list.find((p) => {
      if (!p) return false;
      const jNum = parseInt(String(p.jersey || ""), 10);
      const pId = String(p.id || "");
      return jNum === 3 || pId === "3" || (p.name && p.name.toLowerCase().includes("mizba"));
    });
    return found || FALLBACK_ROOT_PLAYER;
  }, [playersList]);

  // Squad members excluding root captain
  const squadMembers = useMemo(() => {
    const list = Array.isArray(playersList) ? playersList : FALLBACK_PLAYERS;
    return list.filter((p) => p && p._id !== rootPlayer?._id && String(p.jersey) !== "3");
  }, [playersList, rootPlayer]);

  // 3 Primary Sub-Trees: Left, Middle (Center), Right
  const branches = useMemo(() => {
    const groups = [
      {
        id: "attackers",
        side: "left",
        title: "Attackers",
        badge: "Left Wing",
        icon: <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-400" />,
        theme: {
          border: "border-rose-500/50",
          glow: "shadow-[0_0_20px_rgba(244,63,94,0.35)]",
          badgeBg: "bg-rose-500/20 text-rose-300 border-rose-500/40",
          lineColor: "#f43f5e",
        },
        players: [] as Player[],
      },
      {
        id: "playmakers",
        side: "middle",
        title: "Setters",
        badge: "Center Core",
        icon: <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400" />,
        theme: {
          border: "border-cyan-500/50",
          glow: "shadow-[0_0_20px_rgba(6,182,212,0.35)]",
          badgeBg: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
          lineColor: "#06b6d4",
        },
        players: [] as Player[],
      },
      {
        id: "defenders",
        side: "right",
        title: "Defenders",
        badge: "Right Wing",
        icon: <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />,
        theme: {
          border: "border-emerald-500/50",
          glow: "shadow-[0_0_20px_rgba(16,185,129,0.35)]",
          badgeBg: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
          lineColor: "#10b981",
        },
        players: [] as Player[],
      },
    ];

    squadMembers.forEach((player) => {
      if (!player) return;
      const pos = (player.position || "").toLowerCase();
      if (pos.includes("hitter") || pos.includes("spiker") || pos.includes("attack") || pos.includes("opposite")) {
        groups[0].players.push(player);
      } else if (pos.includes("setter") || pos.includes("play") || pos.includes("all-rounder")) {
        groups[1].players.push(player);
      } else if (pos.includes("blocker") || pos.includes("libero") || pos.includes("defense")) {
        groups[2].players.push(player);
      } else {
        // Balanced distribution
        if (groups[1].players.length <= groups[0].players.length && groups[1].players.length <= groups[2].players.length) {
          groups[1].players.push(player);
        } else if (groups[0].players.length <= groups[2].players.length) {
          groups[0].players.push(player);
        } else {
          groups[2].players.push(player);
        }
      }
    });

    return groups;
  }, [squadMembers]);

  const handleZoom = (delta: number) => {
    setZoomLevel((prev) => Math.min(Math.max(0.7, prev + delta), 1.3));
  };

  const isHighlighted = (player: Player) => {
    if (!searchQuery) return false;
    const q = searchQuery.toLowerCase();
    return (
      (player.name && player.name.toLowerCase().includes(q)) ||
      (player.position && player.position.toLowerCase().includes(q)) ||
      (player.jersey && String(player.jersey).includes(q))
    );
  };

  return (
    <section className="relative py-16 sm:py-24 px-2 sm:px-4 lg:px-6 bg-[#02040a] text-white overflow-hidden select-none">
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12 space-y-3 sm:space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 sm:px-5 py-1.5 rounded-full bg-amber-950/60 border border-amber-500/40 text-amber-300 text-[10px] sm:text-xs font-mono tracking-[0.2em] uppercase shadow-[0_0_20px_rgba(245,158,11,0.25)] backdrop-blur-md"
          >
            <Network className="w-3.5 h-3.5 text-amber-400" />
            <span>Aro Ekdin SQUAD Tree</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight"
          >
            <span className="bg-linear-to-r from-amber-400 via-yellow-200 to-amber-500 bg-clip-text text-transparent filter drop-shadow-[0_0_30px_rgba(245,158,11,0.4)] inline-block">
              Our Squad Tree
            </span>
          </motion.h2>

          <p className="text-slate-400 text-xs sm:text-sm md:text-base max-w-xl mx-auto font-light px-2">
            Fueled by the leadership of <span className="text-amber-400 font-semibold">Captain (Mizba Al Naim)</span> connecting the squad into 3 powerful sub-units.
          </p>
        </div>

        {/* ======================================================== */}
        {/* RESPONSIVE 3-SUBTREE DIAGRAM VIEWPORT (MOBILE & DESKTOP) */}
        {/* ======================================================== */}
        <div className="relative w-full rounded-3xl border border-white/10 bg-linear-to-b from-[#060a14]/90 via-[#03060d]/95 to-[#020307] backdrop-blur-2xl shadow-2xl p-3 pt-9 sm:p-6 md:p-8">
          
          <div
            style={{
              transform: `scale(${zoomLevel})`,
              transformOrigin: "top center",
              transition: "transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)",
            }}
            className="w-full flex flex-col items-center justify-center mx-auto"
          >
            {/* ======================================================== */}
            {/* LEVEL 0: ROOT NODE (JERSEY #3 CAPTAIN - CENTERED)        */}
            {/* ======================================================== */}
            <div className="relative flex flex-col items-center z-30 mb-0">
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                whileHover={{ scale: 1.04, y: -2 }}
                onClick={() => setSelectedPlayer(rootPlayer)}
                className={`relative cursor-pointer group rounded-2xl sm:rounded-3xl p-0.5 sm:p-1 transition-all duration-300 ${
                  isHighlighted(rootPlayer) ? "ring-3 ring-amber-400 animate-bounce" : ""
                }`}
                style={{ transform: "translateZ(0)", willChange: "transform" }}
              >
                {/* Outer Ambient Glow */}
                <div className="absolute -inset-1.5 sm:-inset-2 bg-linear-to-r from-amber-500 via-yellow-400 to-orange-600 rounded-2xl sm:rounded-3xl blur-lg sm:blur-xl opacity-60 group-hover:opacity-90 transition duration-500 animate-pulse-slow pointer-events-none" />

                {/* Root Node Capsule */}
                <div className="relative flex items-center gap-2.5 sm:gap-4 bg-linear-to-b from-[#1c1407] via-[#0f0b03] to-[#050401] border-2 border-amber-400/90 rounded-xl sm:rounded-2xl px-3 sm:px-6 py-2.5 sm:py-3.5 backdrop-blur-xl shadow-[0_0_30px_rgba(245,158,11,0.4)]">
                  
                  {/* Crown Top Badge */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 px-2.5 sm:px-3 py-0.5 rounded-full bg-linear-to-r from-amber-400 to-yellow-500 text-black text-[9px] sm:text-[10px] font-black uppercase tracking-wider shadow-lg border border-amber-200 whitespace-nowrap">
                    <Crown className="w-3 h-3 fill-black" />
                    <span>CAPTAIN</span>
                  </div>

                  {/* Circular Avatar */}
                  <div className="relative w-11 h-11 sm:w-16 sm:h-16 md:w-18 md:h-18 rounded-full overflow-hidden border-2 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.5)] shrink-0 bg-amber-950">
                    <img
                      src={rootPlayer?.img || "https://res.cloudinary.com/do8awe7fc/image/upload/q_auto/f_auto/v1777145439/Mizba_ufaruk.png"}
                      alt={rootPlayer?.name || "Captain"}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  {/* Details */}
                  <div className="text-left">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <h3 className="text-sm sm:text-lg md:text-xl font-black text-white group-hover:text-amber-300 transition-colors">
                        {rootPlayer?.name || "Mizba Al Naim"}
                      </h3>
                      <span className="px-1.5 sm:px-2 py-0.2 sm:py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] sm:text-xs font-mono font-black shrink-0">
                        {rootPlayer?.jersey || "3"}
                      </span>
                    </div>

                    <p className="text-[10px] sm:text-xs text-amber-400/90 font-semibold">
                      {rootPlayer?.position || "All-Rounder / Team Captain"}
                    </p>

                    <p className="text-[9px] sm:text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                      <span className="truncate">{rootPlayer?.work || "Bangladesh Army"}</span>
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Upper Vertical Trunk Line from Root down to the Junction */}
              <div className="w-1 h-8 sm:h-10 bg-linear-to-b from-amber-400 to-cyan-400 shadow-[0_0_10px_#f59e0b] relative">
                {/* Moving Pulse Dot */}
                <motion.div
                  animate={{ y: [0, 28, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="w-2 h-2 -left-[2px] rounded-full bg-yellow-300 shadow-[0_0_8px_#fde047] absolute"
                />
              </div>
            </div>

            {/* ======================================================== */}
            {/* SVG ONE SOLID UNBROKEN CONTINUOUS BRANCH CONNECTORS      */}
            {/* (NO GAPS, CONTINUOUS CENTER LINE THROUGH TO MIDDLE TREE) */}
            {/* ======================================================== */}
            <div className="w-full relative h-10 sm:h-12 -mt-0.5 mb-1">
              <svg className="w-full h-full overflow-visible pointer-events-none" preserveAspectRatio="none">
                {/* 1. Solid Continuous Horizontal Bridge Bar (Spans from Left 16.66% all the way to Right 83.33% with ZERO gaps) */}
                <line 
                  x1="16.66%" 
                  y1="0" 
                  x2="83.33%" 
                  y2="0" 
                  stroke="#06b6d4" 
                  strokeWidth="3" 
                  className="filter drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" 
                />

                {/* 2. Left Drop Line to Left Wing */}
                <line 
                  x1="16.66%" 
                  y1="0" 
                  x2="16.66%" 
                  y2="100%" 
                  stroke="#f43f5e" 
                  strokeWidth="2.5" 
                  className="filter drop-shadow-[0_0_6px_rgba(244,63,94,0.6)]" 
                />

                {/* 3. Middle Continuous Straight Vertical Line from Root Trunk straight down to Middle Pillar */}
                <line 
                  x1="50%" 
                  y1="0" 
                  x2="50%" 
                  y2="100%" 
                  stroke="#06b6d4" 
                  strokeWidth="3" 
                  className="filter drop-shadow-[0_0_10px_rgba(6,182,212,0.9)]" 
                />

                {/* 4. Right Drop Line to Right Wing */}
                <line 
                  x1="83.33%" 
                  y1="0" 
                  x2="83.33%" 
                  y2="100%" 
                  stroke="#10b981" 
                  strokeWidth="2.5" 
                  className="filter drop-shadow-[0_0_6px_rgba(16,185,129,0.6)]" 
                />

                {/* Junction Connected Dots */}
                <circle cx="16.66%" cy="0" r="4.5" fill="#f43f5e" stroke="#000" strokeWidth="1.5" />
                <circle cx="50%" cy="0" r="5.5" fill="#38bdf8" stroke="#000" strokeWidth="2" className="filter drop-shadow-[0_0_8px_#38bdf8]" />
                <circle cx="83.33%" cy="0" r="4.5" fill="#10b981" stroke="#000" strokeWidth="1.5" />
              </svg>
            </div>

            {/* ======================================================== */}
            {/* 3 SYMMETRICAL SUB-TREES (ALWAYS 3 COLUMNS SIDE-BY-SIDE)   */}
            {/* ======================================================== */}
            <div className="w-full grid grid-cols-3 gap-2 sm:gap-4 md:gap-6 lg:gap-8 items-start">
              {branches.map((branch, bIdx) => {
                const isMiddle = branch.side === "middle";

                return (
                  <div key={branch.id} className="relative flex flex-col items-center w-full">
                    
                    {/* Pillar Category Card (Level 1) */}
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: bIdx * 0.1 }}
                      className="relative z-20 w-full"
                    >
                      <div className={`flex flex-col items-center text-center p-2 sm:p-3 md:p-4 rounded-xl sm:rounded-2xl bg-linear-to-b from-[#11192e] to-[#080d19] border ${branch.theme.border} backdrop-blur-md shadow-xl ${isMiddle ? "ring-1 ring-cyan-400/40" : ""}`}>
                        <div className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-black/60 border border-white/10 text-[9px] sm:text-xs font-bold text-white mb-1 sm:mb-1.5">
                          {branch.icon}
                          <h4 className="text-[11px] sm:text-sm md:text-base font-extrabold text-white leading-tight">
                          {branch.title}
                        </h4>
                          
                        </div>
                        
                        <span className="text-[9px] sm:text-[10px] text-slate-400 font-mono mt-0.5">
                          {branch.players.length} Players
                        </span>
                      </div>
                    </motion.div>

                    {/* Vertical Connector Line from Pillar to Leaf Nodes */}
                    <div 
                      className={`h-4 sm:h-6 ${isMiddle ? "w-1 bg-cyan-400 opacity-90" : "w-0.5"}`}
                      style={{ backgroundColor: branch.theme.lineColor }}
                    />

                    {/* Leaf Player Nodes (Level 2) */}
                    <div className="w-full flex flex-col items-center space-y-2 sm:space-y-3.5">
                      {branch.players.map((player, pIdx) => {
                        const isSelected = selectedPlayer?._id === player?._id;
                        const matchHighlight = isHighlighted(player);

                        return (
                          <React.Fragment key={player?._id || player?.id || pIdx}>
                            {pIdx > 0 && (
                              <div 
                                className="w-0.5 h-2.5 sm:h-3.5 opacity-70"
                                style={{ backgroundColor: branch.theme.lineColor }}
                              />
                            )}

                            <motion.div
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.15 + pIdx * 0.04 }}
                              whileHover={{ scale: 1.03, y: -2 }}
                              onClick={() => setSelectedPlayer(player)}
                              className={`relative w-full rounded-xl sm:rounded-2xl cursor-pointer transition-all duration-300 group ${
                                matchHighlight ? "ring-2 ring-amber-400 shadow-[0_0_15px_#f59e0b]" : ""
                              } ${isSelected ? "ring-2 ring-cyan-400" : ""}`}
                            >
                              {/* Node Box */}
                              <div className="flex items-center gap-1.5 sm:gap-2.5 md:gap-3 p-1.5 sm:p-2.5 md:p-3 rounded-xl sm:rounded-2xl bg-linear-to-r from-[#0d1424]/95 to-[#080d1a]/95 border border-white/15 hover:border-cyan-400/60 backdrop-blur-xl transition-all shadow-md group-hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                                
                                {/* Avatar */}
                                <div className="relative w-8 h-8 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full overflow-hidden border border-white/20 shrink-0 bg-black">
                                  <img
                                    src={player?.img || "https://res.cloudinary.com/do8awe7fc/image/upload/q_auto/f_auto/v1777145439/Mizba_ufaruk.png"}
                                    alt={player?.name || "Player"}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                  />
                                </div>

                                {/* Text info */}
                                <div className="text-left flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-1">
                                    <h5 className="text-[10px] sm:text-xs md:text-sm font-bold text-white truncate group-hover:text-cyan-300 transition-colors">
                                      {player?.name}
                                    </h5>
                                    <span className="text-[8px] sm:text-[9px] md:text-[10px] font-mono font-extrabold px-1 py-0.2 rounded bg-black/70 text-slate-300 border border-white/10 shrink-0">
                                      {player?.jersey || "?"}
                                    </span>
                                  </div>

                                  <p className="text-[9px] sm:text-[10px] md:text-[11px] text-slate-400 truncate mt-0.2">
                                    {player?.position || "Squad Member"}
                                  </p>

                                  {player?.work && (
                                    <p className="hidden sm:flex text-[8px] sm:text-[9px] text-slate-400 truncate items-center gap-1 mt-0.5">
                                      <span className="w-1 h-1 rounded-full bg-blue-400 shrink-0" />
                                      <span className="truncate">{player.work}</span>
                                    </p>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 3D PLAYER SPOTLIGHT MODAL (ON CLICKING ANY NODE)          */}
        {/* ======================================================== */}
        <AnimatePresence>
          {selectedPlayer && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.85, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.85, y: 20 }}
                transition={{ type: "spring", damping: 20, stiffness: 200 }}
                className="relative w-full max-w-md rounded-3xl bg-linear-to-b from-[#111b33] via-[#090f20] to-[#04060d] border border-cyan-500/50 p-6 sm:p-8 shadow-[0_0_60px_rgba(6,182,212,0.35)] text-center"
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedPlayer(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Jersey Badge Header */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold mb-4">
                  <Activity className="w-3.5 h-3.5 text-cyan-400" />
                  <span>SQUAD NODE {selectedPlayer.jersey || "?"}</span>
                </div>

                {/* Avatar with Glow Frame */}
                <div className="relative w-24 h-24 sm:w-32 sm:h-32 mx-auto rounded-full overflow-hidden border-3 border-cyan-400/80 shadow-[0_0_30px_rgba(6,182,212,0.5)] mb-4 bg-black">
                  <img
                    src={selectedPlayer.img || "https://res.cloudinary.com/do8awe7fc/image/upload/q_auto/f_auto/v1777145439/Mizba_ufaruk.png"}
                    alt={selectedPlayer.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Player Details */}
                <h3 className="text-xl sm:text-3xl font-black text-white tracking-tight">
                  {selectedPlayer.name}
                </h3>
                
                <p className="text-xs sm:text-sm font-semibold text-cyan-400 mt-1">
                  {selectedPlayer.position || "Volleyball Player"}
                </p>

                {selectedPlayer.work && (
                  <p className="text-xs text-slate-400 mt-1 flex items-center justify-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{selectedPlayer.work}</span>
                  </p>
                )}

                {/* View Full Profile CTA */}
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => setSelectedPlayer(null)}
                    className="flex-1 py-2.5 sm:py-3 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Close
                  </button>

                  <Link
                    href={`/players/${selectedPlayer._id || selectedPlayer.id || ""}`}
                    className="flex-1"
                  >
                    <button className="w-full py-2.5 sm:py-3 rounded-xl bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-lg hover:shadow-cyan-500/30 flex items-center justify-center gap-1.5 cursor-pointer">
                      <span>Full Profile</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </Link>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* View All Squad CTA Button */}
        <div className="text-center mt-16 md:mt-20">
          <Link href="/players">
            <button className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-black/70 hover:bg-cyan-950/60 border border-cyan-500/40 hover:border-cyan-400 text-white font-black text-sm uppercase tracking-widest shadow-[0_0_30px_rgba(6,182,212,0.25)] hover:shadow-[0_0_40px_rgba(6,182,212,0.5)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer backdrop-blur-xl">
              <span>EXPLORE COMPLETE SQUAD</span>
              <div className=" w-7 h-7 rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                <ArrowRight className="w-4 h-4 text-cyan-300" />
              </div>
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TeamFamilyTree;
