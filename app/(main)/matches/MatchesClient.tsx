"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Calendar,
  MapPin,
  Clock,
  CheckCircle2,
  Medal,
  Users,
  Volleyball,
  Info,
  Radio,
  Timer,
  BarChart3,
} from "lucide-react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import LoadingSpinner from "../../../components/LoadingSpinner/LoadingSpinner";
import { Match } from "../../../types";

const MatchesClient = () => {
  const [filter, setFilter] = useState("all");
  const [selectedMatch, setSelectedMatch] = useState<any>(null);

  const axiosSecure = useAxiosSecure();

  const { data: matches = [], isLoading } = useQuery<Match[]>({
    queryKey: ["matches"],
    queryFn: async () => {
      const res = await axiosSecure.get("/matches");
      return res.data;
    },
  });

  const filteredMatches = matches.filter((match) => {
    if (filter === "all") return true;
    return match.status?.toLowerCase() === filter.toLowerCase();
  });

  const stats = {
    total: matches.length,
    live: matches.filter((m) => m.status?.toLowerCase() === "live").length,
    upcoming: matches.filter((m) => m.status?.toLowerCase() === "upcoming").length,
    completed: matches.filter((m) => m.status?.toLowerCase() === "completed").length,
  };

  const getStatusBadge = (status?: string) => {
    const s = status?.toLowerCase();
    if (s === "live") {
      return (
        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.3)] animate-pulse tracking-wider">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]"></span>
          LIVE MATCH
        </span>
      );
    }
    if (s === "upcoming") {
      return (
        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.2)] tracking-wider">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          UPCOMING
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.2)] tracking-wider">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
        COMPLETED
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#070b12]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-100 px-4 pb-28 pt-8 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Ambient Glow Lights */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-cyan-500/15 blur-[150px] rounded-full"></div>
        <div className="absolute top-1/3 -right-40 w-[500px] h-[350px] bg-blue-600/15 blur-[140px] rounded-full"></div>
        <div className="absolute -bottom-20 -left-40 w-[500px] h-[350px] bg-indigo-600/15 blur-[140px] rounded-full"></div>
      </div>

      <div className="relative max-w-5xl mx-auto space-y-8">
        {/* HERO HEADER */}
        <motion.section
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl border border-cyan-500/30 bg-linear-to-br from-[#0e1726] via-[#0b1220] to-[#070b14] p-6 sm:p-8 lg:p-10 shadow-2xl shadow-cyan-950/40"
        >
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-blue-500/20 blur-3xl" />

          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center">
                <img
                  src="https://res.cloudinary.com/do8awe7fc/image/upload/q_auto/f_auto/v1777145975/Logo_qzb1xk.jpg"
                  alt="Aro Ekdin Volleyball Logo"
                  loading="lazy"
                  decoding="async"
                  className="rounded-2xl border border-cyan-400/30 bg-linear-to-br from-cyan-500/20 to-blue-600/30 shadow-[0_0_25px_rgba(6,182,212,0.35)] backdrop-blur-md object-contain animate-spin-slow w-16 h-16"
                  style={{
                    willChange: "transform",
                    transform: "translateZ(0)",
                    backfaceVisibility: "hidden",
                  }}
                />
              </div>

              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 text-[11px] font-extrabold uppercase tracking-widest mb-1.5">
                  <Trophy className="w-3.5 h-3.5 text-amber-400" /> Aro Ekdin Volleyball League
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
                  Match{" "}
                  <span className="bg-linear-to-r from-cyan-400 via-sky-300 to-blue-400 bg-clip-text text-transparent">
                    Center
                  </span>
                </h1>
                <p className="mt-1 text-sm text-slate-300 max-w-lg">
                  Real-time sets, scores, live tournament fixtures, and player squad rosters.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 self-start lg:self-auto">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-2.5 backdrop-blur-md text-center">
                <p className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                  Season
                </p>
                <p className="text-base font-black text-white">2026</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-2.5 backdrop-blur-md text-center">
                <p className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                  Matches
                </p>
                <p className="text-base font-black text-white">{stats.total}</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* STATS SUMMARY CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="rounded-2xl border border-white/10 bg-linear-to-b from-[#111c30] to-[#0c1424] p-4 sm:p-5 shadow-lg shadow-black/30 hover:border-cyan-500/40 transition-all group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Total
                </p>
                <p className="mt-1 text-2xl sm:text-3xl font-black text-white group-hover:text-cyan-300 transition-colors">
                  {stats.total}
                </p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
                <BarChart3 className="h-5 w-5" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-rose-500/30 bg-linear-to-b from-[#24111d] to-[#150912] p-4 sm:p-5 shadow-lg shadow-rose-950/20 hover:border-rose-500/60 transition-all group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-rose-300/80">
                  Live Now
                </p>
                <p className="mt-1 text-2xl sm:text-3xl font-black text-rose-400">
                  {stats.live}
                </p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-400 animate-pulse">
                <Radio className="h-5 w-5" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-2xl border border-amber-500/25 bg-linear-to-b from-[#221c10] to-[#141008] p-4 sm:p-5 shadow-lg shadow-amber-950/20 hover:border-amber-500/50 transition-all group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-amber-300/80">
                  Upcoming
                </p>
                <p className="mt-1 text-2xl sm:text-3xl font-black text-amber-400">
                  {stats.upcoming}
                </p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
                <Timer className="h-5 w-5" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border border-emerald-500/25 bg-linear-to-b from-[#0f211c] to-[#091512] p-4 sm:p-5 shadow-lg shadow-emerald-950/20 hover:border-emerald-500/50 transition-all group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-300/80">
                  Completed
                </p>
                <p className="mt-1 text-2xl sm:text-3xl font-black text-emerald-400">
                  {stats.completed}
                </p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* FILTER TABS */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {[
            { value: "all", label: "All Matches" },
            { value: "live", label: "Live Matches" },
            { value: "upcoming", label: "Upcoming" },
            { value: "completed", label: "Completed" },
          ].map((tab) => {
            const isActive = filter === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => setFilter(tab.value)}
                className={`relative overflow-hidden rounded-2xl px-6 py-2.5 text-xs sm:text-sm font-extrabold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] scale-105"
                    : "border border-white/10 bg-[#0e1626] text-slate-400 hover:border-cyan-500/30 hover:bg-[#131e33] hover:text-white"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="activeFilterBg"
                    className="absolute inset-0 bg-linear-to-r from-cyan-500 via-blue-600 to-indigo-600"
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 30,
                    }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* MATCHES LIST */}
        {filteredMatches.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-3xl border border-white/10 bg-[#0d1424] py-20 text-center shadow-2xl"
          >
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-white/5 border border-white/10">
              <Volleyball className="h-10 w-10 text-slate-600" />
            </div>
            <h3 className="text-xl font-bold text-white">No Matches Found</h3>
            <p className="mt-1 text-sm text-slate-400">
              There are no {filter !== "all" ? filter : ""} matches available right now.
            </p>
          </motion.div>
        ) : (
          <div className="flex flex-col gap-6">
            <AnimatePresence>
              {filteredMatches.map((match: any, idx) => {
                const teamA = match.teamA || { name: match.team1 || "Team A" };
                const teamB = match.teamB || { name: match.team2 || "Team B" };
                const teamAName = teamA.name || "Team A";
                const teamBName = teamB.name || "Team B";
                const teamASets = teamA.setsWon ?? match.team1Score ?? 0;
                const teamBSets = teamB.setsWon ?? match.team2Score ?? 0;
                const isUpcoming = match.status?.toLowerCase() === "upcoming";
                const teamAPlayers = Array.isArray(teamA.players) ? teamA.players : [];
                const teamBPlayers = Array.isArray(teamB.players) ? teamB.players : [];

                return (
                  <motion.div
                    key={match._id || idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    className="group relative rounded-3xl border border-white/10 bg-linear-to-b from-[#0e1728] to-[#090f1c] p-6 sm:p-8 shadow-2xl hover:border-cyan-500/50 hover:shadow-[0_10px_35px_rgba(6,182,212,0.15)] transition-all duration-300 space-y-6"
                  >
                    <div className="absolute top-0 left-8 right-8 h-[2px] bg-linear-to-r from-transparent via-cyan-400/60 to-transparent" />

                    <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 text-lg shrink-0 shadow-md">
                          <Trophy className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-base sm:text-lg font-extrabold text-white truncate block">
                            {match.tournamentName || match.tournament || "Volleyball Tournament"}
                          </span>
                          <span className="text-xs text-cyan-400 font-semibold block mt-0.5">
                            {match.matchType || "Match"} {match.matchFormat ? `• ${match.matchFormat}` : ""}
                          </span>
                        </div>
                      </div>
                      <div className="shrink-0">{getStatusBadge(match.status)}</div>
                    </div>

                    <div className="py-2 grid grid-cols-11 items-center gap-2 sm:gap-6">
                      {/* Team A */}
                      <div className="col-span-5 flex flex-col items-center text-center space-y-2 sm:space-y-3">
                        <div className="w-full">
                          <span className="text-[10px] sm:text-xs text-cyan-400 font-extrabold uppercase tracking-wider block truncate">
                            {teamA.shortName || "Team A"}
                          </span>
                          <h3 className="text-sm sm:text-xl md:text-2xl font-black text-white truncate max-w-full sm:max-w-[260px] mx-auto">
                            {teamAName}
                          </h3>
                        </div>

                        <div
                          className="w-16 h-16 sm:w-28 sm:h-28 md:w-36 md:h-36 rounded-2xl sm:rounded-3xl flex items-center justify-center shrink-0 overflow-hidden border-2 shadow-2xl group-hover:scale-105 transition-transform"
                          style={{
                            backgroundColor: `${teamA.jerseyColor || "#2563eb"}20`,
                            borderColor: teamA.jerseyColor || "#2563eb",
                            boxShadow: `0 0 35px ${teamA.jerseyColor || "#2563eb"}35`,
                          }}
                        >
                          {teamA.logo ? (
                            <img
                              src={teamA.logo}
                              alt={`${teamAName} Logo`}
                              className="w-12 h-12 sm:w-20 sm:h-20 md:w-28 md:h-28 object-contain drop-shadow-md"
                            />
                          ) : (
                            <span className="font-black text-2xl sm:text-4xl md:text-5xl text-white">
                              {teamA.shortName || teamAName.charAt(0) || "A"}
                            </span>
                          )}
                        </div>

                        <div>
                          <p className="text-xl sm:text-3xl md:text-4xl font-black text-cyan-300">
                            {isUpcoming ? "-" : teamASets}
                            <span className="text-[10px] sm:text-xs md:text-sm font-semibold text-slate-400 ml-1 sm:ml-1.5 uppercase block sm:inline">
                              Sets Won
                            </span>
                          </p>
                        </div>
                      </div>

                      {/* VS Centerpiece */}
                      <div className="col-span-1 flex flex-col items-center justify-center py-2">
                        <div className="w-8 h-8 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-[#131f36] border border-cyan-500/30 flex items-center justify-center shadow-lg shadow-cyan-950/40">
                          <span className="text-[11px] sm:text-sm md:text-base font-black text-amber-400">
                            VS
                          </span>
                        </div>
                      </div>

                      {/* Team B */}
                      <div className="col-span-5 flex flex-col items-center text-center space-y-2 sm:space-y-3">
                        <div className="w-full">
                          <span className="text-[10px] sm:text-xs text-orange-400 font-extrabold uppercase tracking-wider block truncate">
                            {teamB.shortName || "Team B"}
                          </span>
                          <h3 className="text-sm sm:text-xl md:text-2xl font-black text-white truncate max-w-full sm:max-w-[260px] mx-auto">
                            {teamBName}
                          </h3>
                        </div>

                        <div
                          className="w-16 h-16 sm:w-28 sm:h-28 md:w-36 md:h-36 rounded-2xl sm:rounded-3xl flex items-center justify-center shrink-0 overflow-hidden border-2 shadow-2xl group-hover:scale-105 transition-transform"
                          style={{
                            backgroundColor: `${teamB.jerseyColor || "#ea580c"}20`,
                            borderColor: teamB.jerseyColor || "#ea580c",
                            boxShadow: `0 0 35px ${teamB.jerseyColor || "#ea580c"}35`,
                          }}
                        >
                          {teamB.logo ? (
                            <img
                              src={teamB.logo}
                              alt={`${teamBName} Logo`}
                              className="w-12 h-12 sm:w-20 sm:h-20 md:w-28 md:h-28 object-contain drop-shadow-md"
                            />
                          ) : (
                            <span className="font-black text-2xl sm:text-4xl md:text-5xl text-white">
                              {teamB.shortName || teamBName.charAt(0) || "B"}
                            </span>
                          )}
                        </div>

                        <div>
                          <p className="text-xl sm:text-3xl md:text-4xl font-black text-orange-300">
                            {isUpcoming ? "-" : teamBSets}
                            <span className="text-[10px] sm:text-xs md:text-sm font-semibold text-slate-400 ml-1 sm:ml-1.5 uppercase block sm:inline">
                              Sets Won
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Set Pills */}
                    {match.sets &&
                      match.sets.length > 0 &&
                      match.sets.some((s: any) => s.teamAScore || s.teamBScore) && (
                        <div className="flex flex-wrap items-center justify-center gap-2.5 bg-black/40 p-3.5 rounded-2xl border border-white/5">
                          {match.sets.map((s: any, sIdx: number) => {
                            if (!s.teamAScore && !s.teamBScore) return null;
                            const aScore = parseInt(s.teamAScore, 10) || 0;
                            const bScore = parseInt(s.teamBScore, 10) || 0;
                            const aWon = aScore > bScore;

                            return (
                              <div
                                key={sIdx}
                                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-bold"
                              >
                                <span className="text-slate-400 uppercase font-semibold">
                                  Set {s.setNumber}:
                                </span>
                                <span
                                  className={
                                    aWon
                                      ? "text-cyan-300 font-black text-sm"
                                      : "text-slate-300 font-semibold text-sm"
                                  }
                                >
                                  {aScore}
                                </span>
                                <span className="text-slate-500">-</span>
                                <span
                                  className={
                                    !aWon
                                      ? "text-orange-300 font-black text-sm"
                                      : "text-slate-300 font-semibold text-sm"
                                  }
                                >
                                  {bScore}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}

                    {match.result && (
                      <div className="bg-linear-to-r from-cyan-500/15 via-blue-600/15 to-indigo-600/15 rounded-2xl px-5 py-3 text-center text-xs sm:text-sm font-bold text-cyan-200 border border-cyan-500/30 shadow-inner">
                        🏆 {match.result}
                      </div>
                    )}

                    {match.manOfTheMatch && (
                      <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold text-amber-300 bg-amber-500/10 px-4 py-2 rounded-xl border border-amber-500/20">
                        <Medal className="w-4 h-4 text-amber-400" />
                        <span>
                          Player of the Match:{" "}
                          <strong>{match.manOfTheMatch}</strong>
                        </span>
                      </div>
                    )}

                    {/* Footer Info & Action */}
                    <div className="pt-5 border-t border-white/10 flex flex-col items-center gap-4">
                      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-slate-400">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-cyan-400" />
                          {match.date
                            ? new Date(match.date).toLocaleDateString()
                            : "TBD"}{" "}
                          {match.time ? `• ${match.time}` : ""}
                        </span>
                        {match.venue && (
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4 text-orange-400" />
                            {match.venue}
                          </span>
                        )}
                        <span className="flex items-center gap-1.5">
                          <Users className="w-4 h-4 text-cyan-400" />
                          {teamAPlayers.length} vs {teamBPlayers.length} players
                        </span>
                      </div>

                      <button
                        onClick={() => setSelectedMatch(match)}
                        className="group/btn relative inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl bg-linear-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white font-extrabold text-sm tracking-wide shadow-[0_4px_25px_rgba(6,182,212,0.45)] hover:shadow-[0_6px_35px_rgba(6,182,212,0.7)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer border border-white/20"
                      >
                        <Info className="w-4 h-4 group-hover/btn:rotate-12 transition-transform" />
                        <span>View Match Details & Squad Lineup</span>
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* MATCH DETAILS & SQUAD MODAL */}
      {selectedMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-hidden">
          <div className="bg-[#0b1220] border border-white/15 rounded-3xl w-full max-w-3xl max-h-[88vh] flex flex-col shadow-2xl overflow-hidden animate-fadeIn">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/10 bg-[#0d1627] shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 text-lg">
                  <Volleyball className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-white">
                    {selectedMatch.tournamentName || "Volleyball Match Details"}
                  </h3>
                  <p className="text-xs text-cyan-400">
                    {selectedMatch.matchType || "Match"} •{" "}
                    {selectedMatch.matchFormat || "Best of 3 Sets"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedMatch(null)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center text-sm font-bold transition-all cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto min-h-0 p-5 sm:p-6 space-y-6">
              <div className="bg-[#070b14] p-5 rounded-2xl border border-white/10 flex items-center justify-around">
                <div className="text-center">
                  <h4 className="font-extrabold text-white text-base">
                    {selectedMatch.teamA?.name || "Team A"}
                  </h4>
                  <p className="text-3xl font-black text-cyan-300 mt-1">
                    {selectedMatch.teamA?.setsWon ?? 0}
                  </p>
                  <span className="text-[11px] text-slate-400 font-semibold uppercase">
                    Sets Won
                  </span>
                </div>

                <div className="text-center px-4">
                  <span className="text-xs font-black text-amber-400 bg-white/5 px-3 py-1 rounded-full border border-white/10 block mb-1">
                    VS
                  </span>
                  {getStatusBadge(selectedMatch.status)}
                </div>

                <div className="text-center">
                  <h4 className="font-extrabold text-white text-base">
                    {selectedMatch.teamB?.name || "Team B"}
                  </h4>
                  <p className="text-3xl font-black text-orange-300 mt-1">
                    {selectedMatch.teamB?.setsWon ?? 0}
                  </p>
                  <span className="text-[11px] text-slate-400 font-semibold uppercase">
                    Sets Won
                  </span>
                </div>
              </div>

              {selectedMatch.sets &&
                selectedMatch.sets.length > 0 &&
                selectedMatch.sets.some(
                  (s: any) => s.teamAScore || s.teamBScore
                ) && (
                  <div>
                    <h4 className="text-xs font-black text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-amber-400" /> Set by Set Breakdown
                    </h4>
                    <div className="bg-[#070b14] rounded-2xl border border-white/10 overflow-hidden">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-white/5 text-slate-400 uppercase font-bold border-b border-white/10">
                          <tr>
                            <th className="px-4 py-3">Set</th>
                            <th className="px-4 py-3 text-cyan-300">
                              {selectedMatch.teamA?.name || "Team A"}
                            </th>
                            <th className="px-4 py-3 text-orange-300">
                              {selectedMatch.teamB?.name || "Team B"}
                            </th>
                            <th className="px-4 py-3 text-right">Set Winner</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {selectedMatch.sets.map((set: any, idx: number) => {
                            const a = parseInt(set.teamAScore, 10);
                            const b = parseInt(set.teamBScore, 10);
                            if (isNaN(a) && isNaN(b)) return null;
                            const aWon = a > b;

                            return (
                              <tr
                                key={idx}
                                className="hover:bg-white/5 transition-colors"
                              >
                                <td className="px-4 py-3 font-bold text-slate-300">
                                  Set {set.setNumber}
                                </td>
                                <td
                                  className={`px-4 py-3 text-sm font-black ${
                                    aWon ? "text-cyan-300" : "text-slate-400"
                                  }`}
                                >
                                  {set.teamAScore || 0}
                                </td>
                                <td
                                  className={`px-4 py-3 text-sm font-black ${
                                    !aWon ? "text-orange-300" : "text-slate-400"
                                  }`}
                                >
                                  {set.teamBScore || 0}
                                </td>
                                <td className="px-4 py-3 text-right font-extrabold text-emerald-400">
                                  {aWon
                                    ? selectedMatch.teamA?.name
                                    : selectedMatch.teamB?.name}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

              {/* Squad Lineup */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#070b14] p-4 rounded-2xl border border-white/10">
                  <div className="flex items-center gap-3 pb-3 mb-3 border-b border-white/10">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs"
                      style={{
                        backgroundColor: `${
                          selectedMatch.teamA?.jerseyColor || "#2563eb"
                        }30`,
                        color: selectedMatch.teamA?.jerseyColor || "#2563eb",
                        border: `1px solid ${
                          selectedMatch.teamA?.jerseyColor || "#2563eb"
                        }`,
                      }}
                    >
                      {selectedMatch.teamA?.shortName || "A"}
                    </div>
                    <div>
                      <h5 className="font-extrabold text-white text-sm">
                        {selectedMatch.teamA?.name || "Team A"} Players
                      </h5>
                      <span className="text-[10px] text-cyan-400 font-semibold">
                        Squad Lineup
                      </span>
                    </div>
                  </div>

                  {Array.isArray(selectedMatch.teamA?.players) &&
                  selectedMatch.teamA.players.length > 0 ? (
                    <ul className="space-y-1.5">
                      {selectedMatch.teamA.players.map(
                        (p: string, pIdx: number) => (
                          <li
                            key={pIdx}
                            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white/5 text-xs text-slate-200 border border-white/5"
                          >
                            <span className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-300 font-bold text-[10px] flex items-center justify-center">
                              {pIdx + 1}
                            </span>
                            <span className="font-semibold">{p}</span>
                          </li>
                        )
                      )}
                    </ul>
                  ) : (
                    <p className="text-xs text-slate-500 italic">
                      No player lineup specified.
                    </p>
                  )}
                </div>

                <div className="bg-[#070b14] p-4 rounded-2xl border border-white/10">
                  <div className="flex items-center gap-3 pb-3 mb-3 border-b border-white/10">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs"
                      style={{
                        backgroundColor: `${
                          selectedMatch.teamB?.jerseyColor || "#ea580c"
                        }30`,
                        color: selectedMatch.teamB?.jerseyColor || "#ea580c",
                        border: `1px solid ${
                          selectedMatch.teamB?.jerseyColor || "#ea580c"
                        }`,
                      }}
                    >
                      {selectedMatch.teamB?.shortName || "B"}
                    </div>
                    <div>
                      <h5 className="font-extrabold text-white text-sm">
                        {selectedMatch.teamB?.name || "Team B"} Players
                      </h5>
                      <span className="text-[10px] text-orange-400 font-semibold">
                        Squad Lineup
                      </span>
                    </div>
                  </div>

                  {Array.isArray(selectedMatch.teamB?.players) &&
                  selectedMatch.teamB.players.length > 0 ? (
                    <ul className="space-y-1.5">
                      {selectedMatch.teamB.players.map(
                        (p: string, pIdx: number) => (
                          <li
                            key={pIdx}
                            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white/5 text-xs text-slate-200 border border-white/5"
                          >
                            <span className="w-4 h-4 rounded-full bg-orange-500/20 text-orange-300 font-bold text-[10px] flex items-center justify-center">
                              {pIdx + 1}
                            </span>
                            <span className="font-semibold">{p}</span>
                          </li>
                        )
                      )}
                    </ul>
                  ) : (
                    <p className="text-xs text-slate-500 italic">
                      No player lineup specified.
                    </p>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div className="bg-[#070b14] p-4 rounded-2xl border border-white/10 space-y-2.5 text-xs">
                {selectedMatch.result && (
                  <div className="flex items-center gap-2 font-bold text-cyan-200">
                    <Trophy className="w-4 h-4 text-amber-400" />
                    <span>
                      Result: <strong>{selectedMatch.result}</strong>
                    </span>
                  </div>
                )}

                {selectedMatch.manOfTheMatch && (
                  <div className="flex items-center gap-2 font-bold text-amber-300">
                    <Medal className="w-4 h-4 text-amber-400" />
                    <span>
                      Player of the Match:{" "}
                      <strong>{selectedMatch.manOfTheMatch}</strong>
                    </span>
                  </div>
                )}

                {selectedMatch.notes && (
                  <div className="text-slate-400">
                    <span className="font-bold text-slate-300">
                      Match Notes:{" "}
                    </span>
                    {selectedMatch.notes}
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between text-slate-400 pt-2.5 border-t border-white/5 gap-2">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-cyan-400" />
                    {selectedMatch.date
                      ? new Date(selectedMatch.date).toLocaleDateString()
                      : "TBD"}{" "}
                    {selectedMatch.time ? `at ${selectedMatch.time}` : ""}
                  </span>
                  {selectedMatch.venue && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-orange-400" />
                      {selectedMatch.venue}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end p-4 border-t border-white/10 bg-[#0d1627] shrink-0">
              <button
                onClick={() => setSelectedMatch(null)}
                className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchesClient;
