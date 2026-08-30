"use client";

import React, { useState, useTransition, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  RotateCw,
  RotateCcw,
  Eye,
  Shield,
  Zap,
  Users,
  Maximize2,
  Sparkles,
  X,
  Activity,
  ArrowRight,
  HelpCircle,
  Camera,
  Layers,
  ChevronRight,
  BookOpen,
  Settings,
  Download,
  CheckCircle2,
  Trophy,
} from "lucide-react";
import {
  CourtPlayer,
  DEFAULT_LINEUP_PLAYERS,
  FormationType,
  COURT_POSITIONS,
  rotateClockwise,
  rotateCounterClockwise,
  FIVB_RULES_GUIDE,
  FIVB_COURT_SPECS,
} from "./courtData";
import { CameraPreset } from "./VolleyballCourtScene";
import useCourtLineup from "../../hooks/useCourtLineup";
import useUserRole from "../../hooks/useUserRole";

// Dynamically load Canvas for SSR safety in Next.js
const DynamicCanvas = dynamic(
  () => import("@react-three/fiber").then((mod) => mod.Canvas),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[520px] md:h-[650px] bg-[#050711] flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-16 rounded-full border-4 border-cyan-500/20 border-t-cyan-400 animate-spin" />
        <p className="text-cyan-400 font-mono text-sm tracking-widest uppercase animate-pulse">
          Constructing 3D Court (FIVB 2025-2028)...
        </p>
      </div>
    ),
  }
);

// Dynamically load the Scene to ensure client-only execution
const DynamicVolleyballCourtScene = dynamic(
  () =>
    import("./VolleyballCourtScene").then((mod) => mod.VolleyballCourtScene),
  { ssr: false }
);

interface VolleyballCourtSectionProps {
  isFullPage?: boolean;
}

export const VolleyballCourtSection: React.FC<VolleyballCourtSectionProps> = ({
  isFullPage = false,
}) => {
  const { players: dbCourtPlayers, formation: dbFormation, netHeight: dbNetHeight, isLoading: isLineupLoading } = useCourtLineup();
  const { role } = useUserRole();
  const isAdmin = role === "admin" || role === "developer";

  const [players, setPlayers] = useState<CourtPlayer[]>(DEFAULT_LINEUP_PLAYERS);
  const [rotationCount, setRotationCount] = useState(1);
  const [formation, setFormation] = useState<FormationType>("standard");
  const [netHeight, setNetHeight] = useState<"men" | "women">("men");
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>("orbit");
  const [selectedPlayer, setSelectedPlayer] = useState<CourtPlayer | null>(null);
  const [showOpponent, setShowOpponent] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Sync with DB players when loaded
  useEffect(() => {
    if (dbCourtPlayers && dbCourtPlayers.length === 6) {
      setPlayers(dbCourtPlayers);
    }
    if (dbFormation) setFormation(dbFormation);
    if (dbNetHeight) setNetHeight(dbNetHeight);
  }, [dbCourtPlayers, dbFormation, dbNetHeight]);

  // Volleyball Clockwise Rotation: 2 -> 1 (to serve), 1 -> 6, 6 -> 5, 5 -> 4, 4 -> 3, 3 -> 2
  const handleRotateClockwise = () => {
    startTransition(() => {
      setPlayers((prev) => rotateClockwise(prev));
      setRotationCount((prev) => (prev % 6) + 1);
    });
  };

  // Volleyball Counter-Clockwise Rotation: 1 -> 2, 2 -> 3, 3 -> 4, 4 -> 5, 5 -> 6, 6 -> 1
  const handleRotateCounterClockwise = () => {
    startTransition(() => {
      setPlayers((prev) => rotateCounterClockwise(prev));
      setRotationCount((prev) => (prev === 1 ? 6 : prev - 1));
    });
  };

  // Find server (Player at Position 1)
  const currentServer = players.find((p) => p.currentPosition === 1);

  return (
    <section className="relative w-full overflow-hidden bg-[#02040a] text-white py-14 px-3 sm:px-6 lg:px-8 font-sans">
      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        {/* Section Header */}
        <div className="flex flex-col  items-center gap-6 pb-2 border-b border-white/10">
          <div className="space-y-3">


            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-5xl md:text-6xl font-black italic text-center tracking-tighter uppercase"
            >
              <span className="px-4 bg-linear-to-r from-white via-cyan-200 to-blue-400 bg-clip-text text-transparent filter drop-shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                3D Volleyball Court
              </span>
            </motion.h2>

            <p className="text-slate-300 text-xs sm:text-sm max-w-xl font-medium">
              Interactive 6-player rotation simulator. Click on any player to
              inspect stats, rotate positions, or switch camera tactical views.
            </p>
          </div>

          {/* Quick Info & Header Actions */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Active Server Badge */}
            {currentServer && (
              <div className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl bg-black/60 border border-emerald-500/30 backdrop-blur-md flex items-center gap-2 shadow-lg">
                <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <div className="text-left">
                  <span className="block text-[9px] sm:text-[10px] uppercase font-mono text-emerald-400 font-bold leading-tight">
                    Server (P1)
                  </span>
                  <span className="block text-[11px] sm:text-xs font-black text-white truncate max-w-[110px] sm:max-w-[140px] leading-tight">
                    #{currentServer.jersey} {currentServer.name}
                  </span>
                </div>
              </div>
            )}

            {/* Net Height Switcher */}
            <div className="flex items-center p-1 bg-black/60 border border-white/15 rounded-xl sm:rounded-2xl backdrop-blur-md">
              <button
                type="button"
                onClick={() => setNetHeight("men")}
                className={`px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[10px] sm:text-[11px] font-bold uppercase transition-all cursor-pointer ${netHeight === "men"
                    ? "bg-cyan-500 text-slate-950 font-black"
                    : "text-slate-400 hover:text-white"
                  }`}
                title="Men's FIVB Net Height 2.43m"
              >
                Men 2.43m
              </button>
              <button
                type="button"
                onClick={() => setNetHeight("women")}
                className={`px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[10px] sm:text-[11px] font-bold uppercase transition-all cursor-pointer ${netHeight === "women"
                    ? "bg-cyan-500 text-slate-950 font-black"
                    : "text-slate-400 hover:text-white"
                  }`}
                title="Women's FIVB Net Height 2.24m"
              >
                Women 2.24m
              </button>
            </div>

            {/* FIVB Rules Button */}
            <button
              onClick={() => setShowRulesModal(true)}
              className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold text-xs uppercase tracking-wider transition-all hover:border-cyan-400/50 cursor-pointer shadow-lg"
              title="Official FIVB Volleyball Rules 2025-2028"
            >
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">FIVB Rules 2025-2028</span>
              <span className="sm:hidden text-[10px]">Rules</span>
            </button>


            

          </div>
        </div>

        {/* 3D Canvas + Interactive Toolbar Viewport */}
        <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-white/15 bg-[#030611] shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
          {/* Top Control Bar Overlay */}
          <div className="absolute top-2.5 sm:top-4 left-2.5 sm:left-4 right-2.5 sm:right-4 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
            {/* Camera View Switcher */}
            <div className="flex items-center p-0.5 sm:p-1 bg-black/80 backdrop-blur-xl border border-white/15 rounded-xl sm:rounded-2xl shadow-2xl pointer-events-auto overflow-x-auto max-w-full">
              <button
                onClick={() => setCameraPreset("orbit")}
                className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 sm:gap-1.5 ${cameraPreset === "orbit"
                    ? "bg-cyan-500 text-black font-black shadow-[0_0_12px_rgba(6,182,212,0.6)]"
                    : "text-slate-300 hover:text-white"
                  }`}
                title="3D Free Orbit View"
              >
                <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span className="hidden xs:inline">Orbit</span>
              </button>

              <button
                onClick={() => setCameraPreset("topdown")}
                className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 sm:gap-1.5 ${cameraPreset === "topdown"
                    ? "bg-cyan-500 text-black font-black shadow-[0_0_12px_rgba(6,182,212,0.6)]"
                    : "text-slate-300 hover:text-white"
                  }`}
                title="Top-Down Tactical View"
              >
                <Layers className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span className="hidden xs:inline">Tactical</span>
              </button>

              <button
                onClick={() => setCameraPreset("spike")}
                className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 sm:gap-1.5 ${cameraPreset === "spike"
                    ? "bg-cyan-500 text-black font-black shadow-[0_0_12px_rgba(6,182,212,0.6)]"
                    : "text-slate-300 hover:text-white"
                  }`}
                title="Front Net / Spike View"
              >
                <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span className="hidden xs:inline">Net</span>
              </button>

              <button
                onClick={() => setCameraPreset("server")}
                className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 sm:gap-1.5 ${cameraPreset === "server"
                    ? "bg-cyan-500 text-black font-black shadow-[0_0_12px_rgba(6,182,212,0.6)]"
                    : "text-slate-300 hover:text-white"
                  }`}
                title="Server Baseline View"
              >
                <Camera className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span className="hidden xs:inline">Serve</span>
              </button>
            </div>

            {/* Formation Strategy Selector & Opponent Toggle */}
            <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
              <div className="flex items-center p-0.5 sm:p-1 bg-black/80 backdrop-blur-xl border border-white/15 rounded-xl sm:rounded-2xl shadow-2xl">
                <button
                  onClick={() => setFormation("standard")}
                  className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold transition-all cursor-pointer ${formation === "standard"
                      ? "bg-blue-600 text-white shadow"
                      : "text-slate-300 hover:text-white"
                    }`}
                >
                  Standard
                </button>
                <button
                  onClick={() => setFormation("serve_receive")}
                  className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold transition-all cursor-pointer ${formation === "serve_receive"
                      ? "bg-blue-600 text-white shadow"
                      : "text-slate-300 hover:text-white"
                    }`}
                >
                  <span className="hidden xs:inline">Serve Receive</span>
                  <span className="xs:hidden">Receive</span>
                </button>
                <button
                  onClick={() => setFormation("perimeter_defense")}
                  className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold transition-all cursor-pointer ${formation === "perimeter_defense"
                      ? "bg-blue-600 text-white shadow"
                      : "text-slate-300 hover:text-white"
                    }`}
                >
                  Defense
                </button>
              </div>

              {/* Toggle Opponent Team */}
              <button
                onClick={() => setShowOpponent(!showOpponent)}
                className={`p-1.5 sm:p-2 rounded-xl sm:rounded-2xl border backdrop-blur-xl transition-all cursor-pointer ${
                  showOpponent
                    ? "bg-rose-950/80 border-rose-500/60 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.4)]"
                    : "bg-black/80 border-white/15 text-slate-400 hover:text-white"
                }`}
                title="Toggle Opponent Team Ghost Markers"
              >
                <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>

          {/* Bottom Rotation Control Bar Overlay */}
          <div className="absolute bottom-2.5 sm:bottom-4 left-2.5 sm:left-4 right-2.5 sm:right-4 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
            {/* Rotation Controls */}
            <div className="flex items-center gap-1.5 sm:gap-2 p-1 sm:p-1.5 bg-black/85 backdrop-blur-xl border border-white/15 rounded-xl sm:rounded-2xl shadow-2xl pointer-events-auto">
              <button
                onClick={handleRotateCounterClockwise}
                className="p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-white transition-all cursor-pointer active:scale-95"
                title="Rotate Counter-Clockwise"
              >
                <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>

              <div className="px-2 sm:px-3 text-center">
                <span className="block text-[8px] sm:text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider leading-none mb-0.5">
                  Rotation
                </span>
                <span className="block text-xs sm:text-sm font-black text-white tracking-wide leading-none">
                  P#{rotationCount}/6
                </span>
              </div>

              <button
                onClick={handleRotateClockwise}
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-[11px] sm:text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(6,182,212,0.5)] transition-all cursor-pointer active:scale-95"
                title="Rotate Clockwise (FIVB Rule 7.6.2)"
              >
                <RotateCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">Rotate Team</span>
                <span className="xs:hidden">Rotate</span>
              </button>
            </div>

            {/* Instruction tooltip badge */}
            <div className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-black/80 border border-white/10 text-[10px] sm:text-[11px] font-medium text-slate-300 backdrop-blur-md pointer-events-auto">
              <HelpCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-400 shrink-0" />
              <span className="hidden sm:inline">Drag to rotate 3D court &bull; Scroll to zoom</span>
              <span className="sm:hidden">Touch & drag court</span>
            </div>
          </div>

          {/* 3D CANVAS */}
          <div className="w-full h-[450px] sm:h-[550px] md:h-[680px]">
            <DynamicCanvas
              shadows
              camera={{ position: [9, 9, 13], fov: 42 }}
              gl={{ antialias: true, alpha: false }}
            >
              <color attach="background" args={["#02040a"]} />
              <DynamicVolleyballCourtScene
                players={players}
                formation={formation}
                selectedPlayer={selectedPlayer}
                onSelectPlayer={(p) => setSelectedPlayer(p)}
                showOpponent={showOpponent}
                cameraPreset={cameraPreset}
                netHeight={netHeight}
              />
            </DynamicCanvas>
          </div>
        </div>

        {/* 6 Starting Players Quick List & Position Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
          {players
            .slice()
            .sort((a, b) => a.currentPosition - b.currentPosition)
            .map((player) => {
              const isSelected = selectedPlayer?.id === player.id;
              const posCoord = COURT_POSITIONS[player.currentPosition];

              return (
                <motion.div
                  key={player.id}
                  whileHover={{ y: -4 }}
                  onClick={() => setSelectedPlayer(player)}
                  className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border backdrop-blur-md transition-all cursor-pointer flex flex-col justify-between ${isSelected
                      ? "bg-cyan-950/80 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                      : "bg-black/50 border-white/10 hover:border-cyan-500/40 hover:bg-slate-900/60"
                    }`}
                >
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border border-cyan-400/50 bg-slate-950 shrink-0">
                      <img
                        src={player.img}
                        alt={player.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1">
                        <span className="text-cyan-400 font-black text-[11px] sm:text-xs">
                          #{player.jersey}
                        </span>
                        <span className="text-[9px] sm:text-[10px] px-1 py-0.2 rounded bg-cyan-950/80 text-cyan-300 font-mono font-bold">
                          P{player.currentPosition}
                        </span>
                      </div>
                      <p className="text-white font-bold text-[11px] sm:text-xs truncate">
                        {player.name}
                      </p>
                    </div>
                  </div>

                  <div className="mt-2 pt-1.5 sm:pt-2 border-t border-white/10 flex items-center justify-between text-[9px] sm:text-[10px] text-slate-400">
                    <span className="truncate">{player.role}</span>
                    <ChevronRight className="w-3 h-3 text-cyan-400 shrink-0" />
                  </div>
                </motion.div>
              );
            })}
        </div>

        {/* Tactical Positions Breakdown Grid & 6 Court Zones */}
        <div className="space-y-6 pt-6 border-t border-white/10">
          <div className="text-center sm:text-left space-y-2">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-cyan-400 font-bold">
              Rotation Guide & Tactical Roles
            </span>
            <h3 className="text-2xl sm:text-4xl font-black italic uppercase tracking-tight text-white">
              Understanding the 6 Court Zones
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {Object.entries(COURT_POSITIONS).map(([posNum, posInfo]) => {
              const num = parseInt(posNum, 10);
              const isFrontRow = num === 2 || num === 3 || num === 4;

              return (
                <div
                  key={posNum}
                  className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-500/40 backdrop-blur-md transition-all hover:-translate-y-1 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-mono font-black text-sm flex items-center justify-center">
                        P{num}
                      </span>
                      <span className="text-sm font-bold text-white">
                        {posInfo.label}
                      </span>
                    </div>
                    <span
                      className={`text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full ${
                        isFrontRow
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                      }`}
                    >
                      {isFrontRow ? "Front Row" : "Back Row"}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-medium">
                    {posInfo.zone}
                  </p>

                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                    <span>
                      {num === 1 && "Serves the ball upon rotation"}
                      {num === 2 && "Primary opposite wing attack"}
                      {num === 3 && "Fast middle tempo & roof blocks"}
                      {num === 4 && "High-volume left wing spikes"}
                      {num === 5 && "Primary receiver / Libero corner"}
                      {num === 6 && "Deep court defensive anchor & pipe attack"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

       
      </div>

      {/* PLAYER DETAILS MODAL / DRAWER */}
      <AnimatePresence>
        {selectedPlayer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xl bg-linear-to-b from-[#0a1124] to-[#040813] border border-cyan-500/40 rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(6,182,212,0.4)]"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedPlayer(null)}
                className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white hover:text-cyan-300 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-6 sm:p-8 space-y-6">
                {/* Header Profile with Jersey */}
                <div className="flex items-center gap-5">
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.5)] bg-black shrink-0">
                    <img
                      src={selectedPlayer.img}
                      alt={selectedPlayer.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-cyan-500 text-black font-black text-xs flex items-center justify-center border-2 border-black">
                      #{selectedPlayer.jersey}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold uppercase">
                        Current: Position {selectedPlayer.currentPosition}
                      </span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-black text-white">
                      {selectedPlayer.name}
                    </h3>
                    <p className="text-cyan-400 font-bold text-sm">
                      {selectedPlayer.detailedPosition}
                    </p>
                  </div>
                </div>

                {/* Tactical Zone & Role */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">Tactical Assignment:</span>
                    <span className="text-white font-bold">
                      {COURT_POSITIONS[selectedPlayer.currentPosition]?.zone}
                    </span>
                  </div>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                    {selectedPlayer.bio}
                  </p>
                </div>

                {/* Radar/Bar Stats */}
                <div className="space-y-3">
                  <h4 className="text-xs font-mono uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Skill Performance Attributes</span>
                  </h4>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-400">Spike Power</span>
                        <span className="text-cyan-300 font-bold">
                          {selectedPlayer.stats.spikes}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-black/60 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-cyan-400 rounded-full"
                          style={{ width: `${selectedPlayer.stats.spikes}%` }}
                        />
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-400">Roof Block</span>
                        <span className="text-cyan-300 font-bold">
                          {selectedPlayer.stats.blocks}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-black/60 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${selectedPlayer.stats.blocks}%` }}
                        />
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-400">Ace Serve</span>
                        <span className="text-cyan-300 font-bold">
                          {selectedPlayer.stats.aces}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-black/60 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-400 rounded-full"
                          style={{ width: `${selectedPlayer.stats.aces}%` }}
                        />
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-400">Floor Defense</span>
                        <span className="text-cyan-300 font-bold">
                          {selectedPlayer.stats.digs}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-black/60 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-400 rounded-full"
                          style={{ width: `${selectedPlayer.stats.digs}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-2">
                  <Link
                    href={`/players/${selectedPlayer.id}`}
                    className="flex-1 py-3 rounded-xl bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <span>View Full Profile</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <button
                    onClick={() => setSelectedPlayer(null)}
                    className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 📖 FIVB OFFICIAL RULES 2025-2028 MODAL / DRAWER */}
      <AnimatePresence>
        {showRulesModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              className="relative w-full max-w-3xl max-h-[85vh] flex flex-col bg-linear-to-b from-[#091124] to-[#040813] border border-cyan-500/40 rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(6,182,212,0.4)] text-white"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-white/10 flex items-center justify-between bg-black/40">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-black uppercase text-white tracking-tight">
                      FIVB Official Volleyball Rules 2025-2028
                    </h3>
                    <p className="text-xs text-slate-400">
                      Approved by 39th FIVB World Congress 2024 &bull; Implemented Jan 1, 2025
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowRulesModal(false)}
                  className="p-2.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-white hover:text-cyan-300 transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content / Rules List */}
              <div className="p-6 overflow-y-auto space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {FIVB_RULES_GUIDE.map((rule) => (
                    <div
                      key={rule.id}
                      className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-500/30 space-y-2.5 transition-all"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-cyan-400" />
                        <h4 className="text-xs font-black uppercase text-cyan-300">
                          {rule.bengaliTitle}
                        </h4>
                      </div>
                      <p className="text-[11px] font-bold text-slate-300">
                        {rule.title}
                      </p>
                      <ul className="space-y-1.5 text-[11px] text-slate-300 leading-relaxed list-disc list-inside">
                        {rule.points.map((pt, idx) => (
                          <li key={idx} className="text-slate-300">
                            {pt}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* Court Dimension Highlights */}
                <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 space-y-2">
                  <h4 className="text-xs font-black uppercase text-cyan-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    Key FIVB Court Dimensions (2025-2028 Edition)
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-300">
                    <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                      <span className="block text-[10px] text-slate-400">Court Size</span>
                      <strong className="text-white">18 m &times; 9 m</strong>
                    </div>
                    <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                      <span className="block text-[10px] text-slate-400">Front Attack Line</span>
                      <strong className="text-white">3 m + 1.75 m Ext.</strong>
                    </div>
                    <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                      <span className="block text-[10px] text-slate-400">Net Height (Men)</span>
                      <strong className="text-white">2.43 m</strong>
                    </div>
                    <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                      <span className="block text-[10px] text-slate-400">Net Height (Women)</span>
                      <strong className="text-white">2.24 m</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-white/10 bg-black/40 flex flex-col sm:flex-row items-center justify-between gap-3">
                <a
                  href="/FIVB-Volleyball_Rules2025_2028.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  download="FIVB_Volleyball_Rules_2025-2028.pdf"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Official FIVB PDF (2025-2028)</span>
                </a>

                <button
                  onClick={() => setShowRulesModal(false)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                >
                  Got It
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default VolleyballCourtSection;
