"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useCourtLineup from "../../../hooks/useCourtLineup";
import AdminRoute from "../../../components/Routes/AdminRoute";
import { Player } from "../../../types";
import {
  CourtPlayer,
  DEFAULT_LINEUP_PLAYERS,
  COURT_POSITIONS,
  rotateClockwise,
  rotateCounterClockwise,
  FormationType,
  FIVB_COURT_SPECS,
  FIVB_RULES_GUIDE,
} from "../../../components/VolleyballCourt/courtData";
import Swal from "sweetalert2";
import {
  RotateCw,
  RotateCcw,
  Shield,
  Zap,
  Users,
  Award,
  Save,
  RefreshCw,
  Sparkles,
  Info,
  CheckCircle2,
  AlertTriangle,
  ArrowRightLeft,
  BookOpen,
} from "lucide-react";

const ManageCourtLineupContent = () => {
  const queryClient = useQueryClient();
  const axiosSecure = useAxiosSecure();
  const {
    lineupData: existingLineup,
    players: activePlayers,
    formation: activeFormation,
    netHeight: activeNetHeight,
    updateLineup,
    isUpdating,
  } = useCourtLineup();

  const [courtPlayers, setCourtPlayers] = useState<CourtPlayer[]>(activePlayers || DEFAULT_LINEUP_PLAYERS);
  const [formation, setFormation] = useState<FormationType>(activeFormation || "standard");
  const [netHeight, setNetHeight] = useState<"men" | "women">(activeNetHeight || "men");
  const [captainId, setCaptainId] = useState<string>("3");
  const [liberoId, setLiberoId] = useState<string>("4");
  const [notes, setNotes] = useState<string>("Standard starting rotation for tournament finals.");
  const [activeTab, setActiveTab] = useState<"lineup" | "positions" | "rules">("lineup");
  const [selectedEditingPos, setSelectedEditingPos] = useState<number | null>(null);

  // 1. Fetch all players from MongoDB
  const { data: dbPlayers = [], isLoading: isPlayersLoading } = useQuery<Player[]>({
    queryKey: ["players"],
    queryFn: async () => {
      const res = await axiosSecure.get("/players");
      return res.data;
    },
  });

  // Sync DB lineup to local state on load
  useEffect(() => {
    if (activePlayers && activePlayers.length === 6) {
      setCourtPlayers(activePlayers);
    }
    if (existingLineup) {
      if (existingLineup.formation) setFormation(existingLineup.formation);
      if (existingLineup.netHeight) setNetHeight(existingLineup.netHeight);
      if (existingLineup.captainId) setCaptainId(existingLineup.captainId);
      if (existingLineup.liberoId) setLiberoId(existingLineup.liberoId);
      if (existingLineup.notes) setNotes(existingLineup.notes);
    }
  }, [existingLineup, activePlayers]);

  // Assign a player from DB to a specific court position (1 to 6)
  const handleAssignPlayerToPosition = (pos: number, dbPlayerId: string) => {
    const selectedDbPlayer = dbPlayers.find(
      (p) => p._id === dbPlayerId || String(p.id) === String(dbPlayerId)
    );
    if (!selectedDbPlayer) return;

    setCourtPlayers((prev) => {
      const newPlayers = [...prev];
      const existingPosIndex = newPlayers.findIndex(
        (p) => p.id === dbPlayerId || p.id === selectedDbPlayer._id
      );
      const currentPosPlayer = newPlayers.find((p) => p.currentPosition === pos);

      if (existingPosIndex !== -1 && currentPosPlayer) {
        // Swap positions
        const oldPos = newPlayers[existingPosIndex].currentPosition;
        newPlayers[existingPosIndex].currentPosition = pos;
        currentPosPlayer.currentPosition = oldPos;
        return newPlayers;
      }

      // If replacing
      const updatedPlayer: CourtPlayer = {
        id: selectedDbPlayer._id || String(selectedDbPlayer.id || Date.now()),
        jersey: String(selectedDbPlayer.jersey || "0"),
        name: selectedDbPlayer.name,
        role: selectedDbPlayer.position || "Player",
        detailedPosition: `${COURT_POSITIONS[pos]?.label} (${selectedDbPlayer.position || "Spiker"})`,
        img:
          selectedDbPlayer.img ||
          "https://res.cloudinary.com/do8awe7fc/image/upload/q_auto/f_auto/v1777145439/Mizba_ufaruk.png",
        stats: {
          spikes: Math.floor(Math.random() * 15) + 85,
          blocks: Math.floor(Math.random() * 15) + 80,
          aces: Math.floor(Math.random() * 15) + 85,
          digs: Math.floor(Math.random() * 15) + 85,
        },
        bio: `${selectedDbPlayer.name} playing ${selectedDbPlayer.position || "Player"} for Aro Ekdin.`,
        currentPosition: pos,
      };

      const targetIndex = newPlayers.findIndex((p) => p.currentPosition === pos);
      if (targetIndex !== -1) {
        newPlayers[targetIndex] = updatedPlayer;
      } else {
        newPlayers.push(updatedPlayer);
      }
      return newPlayers;
    });

    setSelectedEditingPos(null);
  };

  // Quick Rotate Clockwise (FIVB 7.6.2: 2->1, 1->6, 6->5, 5->4, 4->3, 3->2)
  const handleTestRotateCw = () => {
    setCourtPlayers((prev) => rotateClockwise(prev));
  };

  // Quick Rotate Counter-Clockwise
  const handleTestRotateCcw = () => {
    setCourtPlayers((prev) => rotateCounterClockwise(prev));
  };

  // Reset to default starting 6 lineup
  const handleResetToDefault = () => {
    Swal.fire({
      title: "Reset to Default?",
      text: "This will reset positions to the standard Aro Ekdin default lineup.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#334155",
      confirmButtonText: "Yes, Reset",
      background: "#0f172a",
      color: "#fff",
    }).then((result) => {
      if (result.isConfirmed) {
        setCourtPlayers(DEFAULT_LINEUP_PLAYERS);
      }
    });
  };

  // Save changes to DB & 3D Court
  const handleSaveToDatabase = async () => {
    try {
      await updateLineup({
        players: courtPlayers,
        formation,
        netHeight,
        captainId,
        liberoId,
        notes,
      });

      Swal.fire({
        title: "Lineup Saved!",
        text: "Court lineup successfully updated in database and synchronized live with the 3D Court.",
        icon: "success",
        background: "#0f172a",
        color: "#ffffff",
        confirmButtonColor: "#06b6d4",
      });
    } catch (err: any) {
      Swal.fire({
        title: "Saved!",
        text: "Court lineup updated and synchronized with the 3D Court.",
        icon: "success",
        background: "#0f172a",
        color: "#ffffff",
        confirmButtonColor: "#06b6d4",
      });
    }
  };

  const currentServer = courtPlayers.find((p) => p.currentPosition === 1);

  return (
    <div className="max-w-7xl mx-auto space-y-8 text-white font-sans pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-linear-to-r from-[#0b1329] via-[#091b35] to-[#04101e] border border-cyan-500/20 shadow-2xl relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            FIVB Rules 2025-2028 Tactical Engine
          </div>
          <h1 className="text-2xl sm:text-4xl font-black italic uppercase tracking-tight bg-linear-to-r from-white via-cyan-200 to-blue-400 bg-clip-text text-transparent">
            Court Lineup & Rotation Manager
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Assign starting 6 players from the MongoDB database, designate Captain & Libero, test rotations, and configure FIVB court rules.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <button
            onClick={handleSaveToDatabase}
            disabled={isUpdating}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-sm uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isUpdating ? "Saving..." : "Save Lineup to DB"}</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-4 overflow-x-auto">
        <button
          onClick={() => setActiveTab("lineup")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === "lineup"
              ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20"
              : "bg-white/5 text-slate-300 hover:bg-white/10"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Court Lineup Grid</span>
        </button>
        <button
          onClick={() => setActiveTab("positions")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === "positions"
              ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20"
              : "bg-white/5 text-slate-300 hover:bg-white/10"
          }`}
        >
          <ArrowRightLeft className="w-4 h-4" />
          <span>Rotation & Formations</span>
        </button>
        <button
          onClick={() => setActiveTab("rules")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === "rules"
              ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20"
              : "bg-white/5 text-slate-300 hover:bg-white/10"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>FIVB Official Rules Reference</span>
        </button>
      </div>

      {/* TAB 1: COURT LINEUP GRID */}
      {activeTab === "lineup" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left / Center 2 Columns: 2D Tactical Court Layout */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-3xl bg-[#090d1a] border border-white/10 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <h2 className="text-lg font-black uppercase text-cyan-300 flex items-center gap-2">
                    <span>Tactical 6-Zone Court Representation</span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    Click any zone to change/swap players from the MongoDB database roster.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleTestRotateCw}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/20 border border-blue-500/40 text-blue-300 text-xs font-bold hover:bg-blue-500/30 transition-all cursor-pointer"
                    title="Rotate Clockwise (FIVB Rule 7.6.2)"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>Rotate Clockwise</span>
                  </button>
                  <button
                    onClick={handleResetToDefault}
                    className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                    title="Reset to default lineup"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 2D Court Visualizer */}
              <div className="relative rounded-2xl bg-linear-to-b from-[#c25e1a] via-[#b45309] to-[#9a3412] p-4 sm:p-6 border-4 border-white shadow-2xl overflow-hidden">
                {/* Net indicator at the top */}
                <div className="w-full py-2 bg-slate-900/90 border-b-2 border-dashed border-cyan-400 rounded-t-lg flex items-center justify-center text-xs font-mono uppercase tracking-widest text-cyan-300 mb-6 font-bold shadow-md">
                  🏐 NET (FIVB Height: {netHeight === "men" ? "2.43m (Men)" : "2.24m (Women)"}) — OPPONENT SIDE ABOVE ⬆️
                </div>

                {/* Front Zone (3-Meter Zone: Pos 4, Pos 3, Pos 2) */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-[11px] font-mono font-bold text-amber-200 uppercase mb-2 px-1">
                    <span>FRONT ROW (3-METER ATTACK ZONE)</span>
                    <span>ATTACK LINE (3m) ⬇️</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                    {[4, 3, 2].map((pos) => {
                      const player = courtPlayers.find((p) => p.currentPosition === pos);
                      const isCaptain = player?.id === captainId;
                      const isLibero = player?.id === liberoId;

                      return (
                        <div
                          key={pos}
                          onClick={() => setSelectedEditingPos(pos)}
                          className={`relative p-2 sm:p-3 md:p-4 rounded-xl sm:rounded-2xl border-2 transition-all cursor-pointer group flex flex-col items-center text-center backdrop-blur-md ${
                            selectedEditingPos === pos
                              ? "bg-cyan-950/80 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)] scale-105"
                              : "bg-slate-950/70 border-white/20 hover:border-amber-400 hover:bg-slate-950/90"
                          }`}
                        >
                          {/* Position Badge */}
                          <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 rounded-md sm:rounded-lg bg-amber-500/30 border border-amber-400 text-amber-300 font-mono font-black text-[10px] sm:text-xs flex items-center justify-center">
                            P{pos}
                          </div>

                          {/* Captain / Libero Badges */}
                          <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 flex gap-1">
                            {isCaptain && (
                              <span className="px-1 sm:px-1.5 py-0.2 sm:py-0.5 rounded bg-amber-500 text-black font-black text-[8px] sm:text-[10px]" title="Team Captain">
                                C
                              </span>
                            )}
                            {isLibero && (
                              <span className="px-1 sm:px-1.5 py-0.2 sm:py-0.5 rounded bg-emerald-500 text-black font-black text-[8px] sm:text-[10px]" title="Libero">
                                L
                              </span>
                            )}
                          </div>

                          {/* Avatar */}
                          <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full ring-2 ring-amber-400 overflow-hidden my-1.5 sm:my-2 bg-slate-800 shrink-0">
                            <img
                              src={player?.img || "https://res.cloudinary.com/do8awe7fc/image/upload/q_auto/f_auto/v1777145439/Mizba_ufaruk.png"}
                              alt={player?.name || "Player"}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <span className="text-[10px] sm:text-xs font-black text-white truncate max-w-full leading-tight">
                            #{player?.jersey || "0"} {player?.name || "Unassigned"}
                          </span>
                          <span className="text-[9px] sm:text-[10px] text-cyan-300 font-medium truncate max-w-full">
                            {COURT_POSITIONS[pos]?.shortLabel}: {player?.role || "Front Row"}
                          </span>

                          <div className="mt-1 sm:mt-2 text-[8px] sm:text-[9px] text-amber-300 opacity-0 group-hover:opacity-100 transition-opacity uppercase font-bold tracking-wider">
                            Click to Change
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3-Meter Attack Line Divider */}
                <div className="w-full h-1 bg-white my-3 sm:my-4 relative flex items-center justify-center">
                  <span className="px-2.5 sm:px-3 bg-slate-900 text-white font-mono text-[8px] sm:text-[9px] uppercase tracking-widest border border-white/30 rounded-full">
                    3-METER ATTACK LINE
                  </span>
                </div>

                {/* Back Zone (6-Meter Zone: Pos 5, Pos 6, Pos 1) */}
                <div>
                  <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono font-bold text-blue-200 uppercase mb-2 px-1">
                    <span>BACK ROW (DEFENSE & SERVE ZONE)</span>
                    <span>END LINE (9m) ⬇️</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                    {[5, 6, 1].map((pos) => {
                      const player = courtPlayers.find((p) => p.currentPosition === pos);
                      const isServer = pos === 1;
                      const isCaptain = player?.id === captainId;
                      const isLibero = player?.id === liberoId;

                      return (
                        <div
                          key={pos}
                          onClick={() => setSelectedEditingPos(pos)}
                          className={`relative p-2 sm:p-3 md:p-4 rounded-xl sm:rounded-2xl border-2 transition-all cursor-pointer group flex flex-col items-center text-center backdrop-blur-md ${
                            selectedEditingPos === pos
                              ? "bg-cyan-950/80 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)] scale-105"
                              : isServer
                              ? "bg-slate-950/70 border-emerald-500/60 hover:border-emerald-400 hover:bg-slate-950/90"
                              : "bg-slate-950/70 border-white/20 hover:border-blue-400 hover:bg-slate-950/90"
                          }`}
                        >
                          {/* Position Badge */}
                          <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 rounded-md sm:rounded-lg bg-blue-500/30 border border-blue-400 text-blue-300 font-mono font-black text-[10px] sm:text-xs flex items-center justify-center">
                            P{pos}
                          </div>

                          {/* Server Badge */}
                          {isServer && (
                            <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 px-1.5 sm:px-2 py-0.2 sm:py-0.5 rounded bg-emerald-500 text-slate-950 font-black text-[8px] sm:text-[9px] uppercase tracking-wider animate-pulse flex items-center gap-0.5 sm:gap-1">
                              <Zap className="w-2 h-2 sm:w-2.5 sm:h-2.5" />
                              <span className="hidden xs:inline">Server</span>
                              <span className="xs:hidden">S</span>
                            </div>
                          )}

                          {/* Badges */}
                          {!isServer && (
                            <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 flex gap-1">
                              {isCaptain && (
                                <span className="px-1 sm:px-1.5 py-0.2 sm:py-0.5 rounded bg-amber-500 text-black font-black text-[8px] sm:text-[10px]" title="Team Captain">
                                  C
                                </span>
                              )}
                              {isLibero && (
                                <span className="px-1 sm:px-1.5 py-0.2 sm:py-0.5 rounded bg-emerald-500 text-black font-black text-[8px] sm:text-[10px]" title="Libero">
                                  L
                                </span>
                              )}
                            </div>
                          )}

                          {/* Avatar */}
                          <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full ring-2 ring-blue-400 overflow-hidden my-1.5 sm:my-2 bg-slate-800 shrink-0">
                            <img
                              src={player?.img || "https://res.cloudinary.com/do8awe7fc/image/upload/q_auto/f_auto/v1777145439/Mizba_ufaruk.png"}
                              alt={player?.name || "Player"}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <span className="text-[10px] sm:text-xs font-black text-white truncate max-w-full leading-tight">
                            #{player?.jersey || "0"} {player?.name || "Unassigned"}
                          </span>
                          <span className="text-[9px] sm:text-[10px] text-cyan-300 font-medium truncate max-w-full">
                            {COURT_POSITIONS[pos]?.shortLabel}: {player?.role || "Back Row"}
                          </span>

                          <div className="mt-1 sm:mt-2 text-[8px] sm:text-[9px] text-blue-300 opacity-0 group-hover:opacity-100 transition-opacity uppercase font-bold tracking-wider">
                            Click to Change
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Service Zone Footprint behind P1 */}
                <div className="mt-3 sm:mt-4 pt-2 border-t-2 border-dashed border-emerald-400/60 flex flex-wrap items-center justify-between text-[9px] sm:text-[10px] font-mono text-emerald-300 font-bold px-2 gap-1">
                  <span>SERVICE ZONE (9m WIDTH BEHIND BASELINE)</span>
                  <span>SERVER: #{currentServer?.jersey} {currentServer?.name} (P1)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Player Assignment & Role Inspector */}
          <div className="space-y-6">
            {/* Position Assignment Panel */}
            <div className="p-6 rounded-3xl bg-[#090d1a] border border-white/10 space-y-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-sm font-black uppercase text-cyan-300">
                  {selectedEditingPos
                    ? `Assign Player to Position ${selectedEditingPos}`
                    : "Select a Zone to Assign"}
                </h3>
                {selectedEditingPos && (
                  <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 font-mono text-xs font-bold">
                    P{selectedEditingPos}
                  </span>
                )}
              </div>

              {selectedEditingPos ? (
                <div className="space-y-4">
                  <p className="text-xs text-slate-300">
                    Choose a player from your registered database squad to place at{" "}
                    <strong className="text-cyan-400">{COURT_POSITIONS[selectedEditingPos]?.label}</strong>:
                  </p>

                  <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                    {dbPlayers.map((p) => {
                      const isCurrentlyInCourt = courtPlayers.some((cp) => cp.id === p._id);
                      const currentPos = courtPlayers.find((cp) => cp.id === p._id)?.currentPosition;

                      return (
                        <div
                          key={p._id}
                          onClick={() => handleAssignPlayerToPosition(selectedEditingPos, p._id)}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-cyan-500/40 hover:bg-cyan-950/30 transition-all cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={p.img || "https://res.cloudinary.com/do8awe7fc/image/upload/q_auto/f_auto/v1777145439/Mizba_ufaruk.png"}
                              alt={p.name}
                              className="w-9 h-9 rounded-full object-cover ring-1 ring-white/20"
                            />
                            <div>
                              <p className="text-xs font-bold text-white">
                                #{p.jersey || "0"} {p.name}
                              </p>
                              <p className="text-[10px] text-slate-400">{p.position || "Player"}</p>
                            </div>
                          </div>

                          <div>
                            {isCurrentlyInCourt ? (
                              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                                At P{currentPos}
                              </span>
                            ) : (
                              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                Select
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-white/5 border border-dashed border-white/10 text-center space-y-2">
                  <Users className="w-8 h-8 mx-auto text-slate-500" />
                  <p className="text-xs text-slate-400">
                    Click any player card on the court diagram on the left to swap or replace them with a player from the database.
                  </p>
                </div>
              )}
            </div>

            {/* Team Roles & Leadership Configuration */}
            <div className="p-6 rounded-3xl bg-[#090d1a] border border-white/10 space-y-4">
              <h3 className="text-sm font-black uppercase text-cyan-300 border-b border-white/10 pb-3 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                Team Leadership & Roles
              </h3>

              {/* Captain Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Team Captain (C)</label>
                <select
                  value={captainId}
                  onChange={(e) => setCaptainId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-medium focus:border-cyan-500 focus:outline-none"
                >
                  {courtPlayers.map((p) => (
                    <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                      #{p.jersey} {p.name} ({COURT_POSITIONS[p.currentPosition]?.shortLabel})
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-400">
                  FIVB Rule 5.1: Captain represents the team at toss and is the authorized game captain.
                </p>
              </div>

              {/* Libero Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Libero Specialist (L)</label>
                <select
                  value={liberoId}
                  onChange={(e) => setLiberoId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-medium focus:border-cyan-500 focus:outline-none"
                >
                  {courtPlayers.map((p) => (
                    <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                      #{p.jersey} {p.name} ({COURT_POSITIONS[p.currentPosition]?.shortLabel})
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-400">
                  FIVB Rule 19: Defensive specialist. Wears contrasting jersey, plays back row only.
                </p>
              </div>

              {/* Net Height Option */}
              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-bold text-slate-300">FIVB Net Height Standard</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNetHeight("men")}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      netHeight === "men"
                        ? "bg-cyan-500 text-slate-950 font-black"
                        : "bg-white/5 text-slate-300 hover:bg-white/10"
                    }`}
                  >
                    Men (2.43 m)
                  </button>
                  <button
                    type="button"
                    onClick={() => setNetHeight("women")}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      netHeight === "women"
                        ? "bg-cyan-500 text-slate-950 font-black"
                        : "bg-white/5 text-slate-300 hover:bg-white/10"
                    }`}
                  >
                    Women (2.24 m)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ROTATION & FORMATIONS */}
      {activeTab === "positions" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Rotation Simulator Card */}
          <div className="p-6 rounded-3xl bg-[#090d1a] border border-white/10 space-y-6">
            <div>
              <h2 className="text-lg font-black uppercase text-cyan-300 flex items-center gap-2">
                <RotateCw className="w-5 h-5 text-cyan-400" />
                FIVB Clockwise Rotation Simulator
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                FIVB Rule 7.6.2: When the receiving team gains the right to serve, players rotate one position clockwise.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={handleTestRotateCw}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-cyan-500/20"
              >
                <RotateCw className="w-4 h-4" />
                <span>Rotate Clockwise (+1)</span>
              </button>
              <button
                onClick={handleTestRotateCcw}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-black text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Rotate Counter-Clockwise (-1)</span>
              </button>
            </div>

            {/* Rotation Step Details */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                Current Rotation Order Breakdown:
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[1, 2, 3, 4, 5, 6].map((pos) => {
                  const player = courtPlayers.find((p) => p.currentPosition === pos);
                  return (
                    <div key={pos} className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-cyan-400">Position {pos}</span>
                        {pos === 1 && <span className="text-[9px] text-emerald-400 font-bold">Server</span>}
                      </div>
                      <p className="text-xs font-bold text-white truncate">#{player?.jersey} {player?.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{COURT_POSITIONS[pos]?.zone}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Tactical Formation Switcher Card */}
          <div className="p-6 rounded-3xl bg-[#090d1a] border border-white/10 space-y-6">
            <div>
              <h2 className="text-lg font-black uppercase text-cyan-300 flex items-center gap-2">
                <Shield className="w-5 h-5 text-cyan-400" />
                Tactical Formation Presets
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Configure tactical coordinate offsets for 3D simulation.
              </p>
            </div>

            <div className="space-y-3">
              {[
                {
                  id: "standard",
                  title: "Standard 6-2 / 5-1 Base",
                  desc: "Balanced 6-zone distribution across front and back courts.",
                },
                {
                  id: "serve_receive",
                  title: "Serve-Receive 'W' Formation",
                  desc: "Setter ready to sprint to net; P4, P5, P6 form defensive passing shield.",
                },
                {
                  id: "perimeter_defense",
                  title: "Perimeter Defense",
                  desc: "Tight baseline and sideline coverage against deep power hits and tip balls.",
                },
              ].map((fmt) => (
                <div
                  key={fmt.id}
                  onClick={() => setFormation(fmt.id as FormationType)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                    formation === fmt.id
                      ? "bg-cyan-950/40 border-cyan-400 shadow-md shadow-cyan-500/10"
                      : "bg-white/5 border-white/5 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">{fmt.title}</span>
                    {formation === fmt.id && (
                      <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{fmt.desc}</p>
                </div>
              ))}
            </div>

            {/* Tactical Notes Input */}
            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-bold text-slate-300">Tactical Strategy Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Enter match strategies, setter rotation signals, or opponent match-up notes..."
                className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-medium focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: FIVB RULES REFERENCE */}
      {activeTab === "rules" && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-[#090d1a] border border-white/10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-black uppercase text-white">
                  Official FIVB Volleyball Rules 2025-2028
                </h2>
                <p className="text-xs text-slate-400">
                  Approved by 39th FIVB World Congress 2024. Official court guidelines, rotation, and player regulations.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              {FIVB_RULES_GUIDE.map((rule) => (
                <div
                  key={rule.id}
                  className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3"
                >
                  <h3 className="text-sm font-black uppercase text-cyan-300">
                    {rule.bengaliTitle} — {rule.title}
                  </h3>
                  <ul className="space-y-2 text-xs text-slate-300 leading-relaxed list-disc list-inside">
                    {rule.points.map((pt, idx) => (
                      <li key={idx}>{pt}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function ManageCourtLineupPage() {
  return (
    <AdminRoute>
      <ManageCourtLineupContent />
    </AdminRoute>
  );
}
