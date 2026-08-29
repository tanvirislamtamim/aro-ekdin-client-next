"use client";

import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import LoadingSpinner from "../../../components/LoadingSpinner/LoadingSpinner";
import Swal from "sweetalert2";
import axios from "axios";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaTrophy,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaSpinner,
  FaUsers,
  FaVolleyballBall,
  FaPalette,
} from "react-icons/fa";
import AdminRoute from "../../../components/Routes/AdminRoute";
import { Match } from "../../../types";

const PRESET_COLORS = [
  "#2563eb",
  "#06b6d4",
  "#ea580c",
  "#10b981",
  "#ef4444",
  "#8b5cf6",
  "#eab308",
  "#ec4899",
  "#1e293b",
  "#ffffff",
];

const ManageMatchesContent = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [teamALogoFile, setTeamALogoFile] = useState<File | null>(null);
  const [teamBLogoFile, setTeamBLogoFile] = useState<File | null>(null);

  const initialFormState = {
    tournamentName: "",
    matchType: "",
    matchFormat: "Best of 3",
    date: "",
    time: "",
    venue: "",
    status: "Upcoming",
    notes: "",
    result: "",
    manOfTheMatch: "",
    sets: [
      { setNumber: 1, teamAScore: "", teamBScore: "" },
      { setNumber: 2, teamAScore: "", teamBScore: "" },
      { setNumber: 3, teamAScore: "", teamBScore: "" },
    ],
    teamA: {
      name: "",
      shortName: "",
      logo: "",
      jerseyColor: "#2563eb",
      setsWon: 0,
      players: "",
    },
    teamB: {
      name: "",
      shortName: "",
      logo: "",
      jerseyColor: "#ea580c",
      setsWon: 0,
      players: "",
    },
  };

  const [formData, setFormData] = useState(initialFormState);

  const { data: matches = [], isLoading } = useQuery<Match[]>({
    queryKey: ["matches"],
    queryFn: async () => {
      const res = await axiosSecure.get("/matches");
      return res.data;
    },
  });

  const uploadToCloudinary = async (file: File | null) => {
    if (!file) return null;
    const imgData = new FormData();
    imgData.append("file", file);
    imgData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "aro_ekdin"
    );

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "do8awe7fc";
    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      imgData
    );
    return res.data.secure_url;
  };

  const handleSetScoreChange = (index: number, field: string, value: string) => {
    const updatedSets = [...formData.sets];
    updatedSets[index] = { ...updatedSets[index], [field]: value };

    let aWon = 0;
    let bWon = 0;
    updatedSets.forEach((s) => {
      const a = parseInt(s.teamAScore, 10);
      const b = parseInt(s.teamBScore, 10);
      if (!isNaN(a) && !isNaN(b)) {
        if (a > b && (a >= 25 || (s.setNumber === 5 && a >= 15))) aWon++;
        else if (b > a && (b >= 25 || (s.setNumber === 5 && b >= 15))) bWon++;
      }
    });

    setFormData({
      ...formData,
      sets: updatedSets,
      teamA: { ...formData.teamA, setsWon: aWon },
      teamB: { ...formData.teamB, setsWon: bWon },
    });
  };

  const handleAddSet = () => {
    if (formData.sets.length < 5) {
      setFormData({
        ...formData,
        sets: [
          ...formData.sets,
          { setNumber: formData.sets.length + 1, teamAScore: "", teamBScore: "" },
        ],
      });
    }
  };

  const handleRemoveSet = () => {
    if (formData.sets.length > 1) {
      const updatedSets = formData.sets.slice(0, -1);
      setFormData({
        ...formData,
        sets: updatedSets,
      });
    }
  };

  const handleOpenModal = (match: any = null) => {
    setTeamALogoFile(null);
    setTeamBLogoFile(null);

    if (match) {
      setEditingMatch(match);

      const teamAPlayersStr = Array.isArray(match.teamA?.players)
        ? match.teamA.players.join(", ")
        : match.teamA?.players || "";

      const teamBPlayersStr = Array.isArray(match.teamB?.players)
        ? match.teamB.players.join(", ")
        : match.teamB?.players || "";

      setFormData({
        tournamentName: match.tournamentName || match.tournament || "",
        matchType: match.matchType || "",
        matchFormat: match.matchFormat || "Best of 3",
        date: match.date ? match.date.split("T")[0] : "",
        time: match.time || "",
        venue: match.venue || "",
        status: match.status || "Upcoming",
        notes: match.notes || "",
        result: match.result || "",
        manOfTheMatch: match.manOfTheMatch || "",
        sets: match.sets && match.sets.length > 0
          ? match.sets
          : [
              { setNumber: 1, teamAScore: "", teamBScore: "" },
              { setNumber: 2, teamAScore: "", teamBScore: "" },
              { setNumber: 3, teamAScore: "", teamBScore: "" },
            ],
        teamA: {
          name: match.teamA?.name || match.team1 || "",
          shortName: match.teamA?.shortName || "",
          logo: match.teamA?.logo || match.team1Logo || "",
          jerseyColor: match.teamA?.jerseyColor || "#2563eb",
          setsWon: match.teamA?.setsWon ?? match.teamA?.score ?? 0,
          players: teamAPlayersStr,
        },
        teamB: {
          name: match.teamB?.name || match.team2 || "",
          shortName: match.teamB?.shortName || "",
          logo: match.teamB?.logo || match.team2Logo || "",
          jerseyColor: match.teamB?.jerseyColor || "#ea580c",
          setsWon: match.teamB?.setsWon ?? match.teamB?.score ?? 0,
          players: teamBPlayersStr,
        },
      });
    } else {
      setEditingMatch(null);
      setFormData(initialFormState);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMatch(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      let finalTeamALogo = formData.teamA.logo;
      let finalTeamBLogo = formData.teamB.logo;

      if (teamALogoFile) {
        const uploadedA = await uploadToCloudinary(teamALogoFile);
        if (uploadedA) finalTeamALogo = uploadedA;
      }

      if (teamBLogoFile) {
        const uploadedB = await uploadToCloudinary(teamBLogoFile);
        if (uploadedB) finalTeamBLogo = uploadedB;
      }

      const parsePlayers = (str: any) => {
        if (!str) return [];
        if (Array.isArray(str)) return str;
        return str
          .split(",")
          .map((p: string) => p.trim())
          .filter(Boolean);
      };

      const matchPayload = {
        tournamentName: formData.tournamentName,
        matchType: formData.matchType,
        matchFormat: formData.matchFormat,
        date: formData.date,
        time: formData.time,
        venue: formData.venue,
        status: formData.status,
        notes: formData.notes,
        result: formData.result,
        manOfTheMatch: formData.manOfTheMatch,
        sets: formData.sets,
        teamA: {
          name: formData.teamA.name,
          shortName: formData.teamA.shortName,
          logo: finalTeamALogo,
          jerseyColor: formData.teamA.jerseyColor,
          setsWon: Number(formData.teamA.setsWon) || 0,
          players: parsePlayers(formData.teamA.players),
        },
        teamB: {
          name: formData.teamB.name,
          shortName: formData.teamB.shortName,
          logo: finalTeamBLogo,
          jerseyColor: formData.teamB.jerseyColor,
          setsWon: Number(formData.teamB.setsWon) || 0,
          players: parsePlayers(formData.teamB.players),
        },
      };

      if (editingMatch) {
        await axiosSecure.put(`/matches/${editingMatch._id}`, matchPayload);
        Swal.fire({
          icon: "success",
          title: "Match Updated",
          text: "Volleyball match details successfully updated.",
          timer: 1800,
          showConfirmButton: false,
          background: "#111823",
          color: "#fff",
        });
      } else {
        await axiosSecure.post("/matches", matchPayload);
        Swal.fire({
          icon: "success",
          title: "Match Added",
          text: "New Volleyball match created successfully.",
          timer: 1800,
          showConfirmButton: false,
          background: "#111823",
          color: "#fff",
        });
      }

      queryClient.invalidateQueries({ queryKey: ["matches"] });
      handleCloseModal();
    } catch (error: any) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to save match.",
        background: "#111823",
        color: "#fff",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = (id: string, teams: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Delete match ${teams}? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#3b82f6",
      confirmButtonText: "Yes, delete it!",
      background: "#111823",
      color: "#fff",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosSecure.delete(`/matches/${id}`);
          queryClient.invalidateQueries({ queryKey: ["matches"] });
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "Match deleted successfully.",
            timer: 1500,
            showConfirmButton: false,
            background: "#111823",
            color: "#fff",
          });
        } catch (error: any) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: error.response?.data?.message || "Failed to delete match.",
            background: "#111823",
            color: "#fff",
          });
        }
      }
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#111823] p-6 rounded-3xl border border-white/5 shadow-2xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-bold uppercase mb-2">
            <FaVolleyballBall className="text-amber-400" /> Volleyball Match Controller
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Manage Volleyball Matches
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Set-by-set score management (1-5 sets), team lineups, venue, and live status.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 bg-linear-to-r from-blue-500 to-cyan-400 text-slate-950 font-black px-6 py-3.5 rounded-2xl hover:opacity-90 transition-all shadow-lg hover:scale-105 cursor-pointer"
        >
          <FaPlus /> Add New Match
        </button>
      </div>

      {/* Matches List */}
      {isLoading ? (
        <div className="py-20">
          <LoadingSpinner />
        </div>
      ) : matches.length === 0 ? (
        <div className="text-center py-16 bg-[#111823] rounded-3xl border border-white/5">
          <FaVolleyballBall className="w-14 h-14 mx-auto text-gray-600 mb-3" />
          <p className="text-gray-400 font-medium">
            No matches found. Click &quot;Add New Match&quot; to create one.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {matches.map((m: any) => {
            const teamAName = m.teamA?.name || m.team1 || "Team A";
            const teamBName = m.teamB?.name || m.team2 || "Team B";
            const teamASets = m.teamA?.setsWon ?? 0;
            const teamBSets = m.teamB?.setsWon ?? 0;
            const teamALogo = m.teamA?.logo || m.team1Logo;
            const teamBLogo = m.teamB?.logo || m.team2Logo;
            const status = m.status || "Upcoming";
            const teamAPlayers = Array.isArray(m.teamA?.players) ? m.teamA.players : [];
            const teamBPlayers = Array.isArray(m.teamB?.players) ? m.teamB.players : [];

            return (
              <div
                key={m._id}
                className="bg-[#111823] p-5 sm:p-6 rounded-3xl border border-white/10 hover:border-cyan-500/40 transition-all shadow-xl space-y-4"
              >
                {/* Top Bar */}
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <FaTrophy className="text-amber-400 text-lg shrink-0" />
                    <div>
                      <span className="text-sm font-bold text-white block">
                        {m.tournamentName || m.tournament || "Volleyball Tournament"}
                      </span>
                      <span className="text-xs text-cyan-400 font-semibold">
                        {m.matchType || "Match"} • {m.matchFormat || "Best of 3 Sets"}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                      status.toLowerCase() === "live"
                        ? "bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse"
                        : status.toLowerCase() === "upcoming"
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    }`}
                  >
                    {status}
                  </span>
                </div>

                {/* Teams and Set Scores */}
                <div className="py-4 grid grid-cols-11 items-center gap-2 sm:gap-4">
                  {/* Team A */}
                  <div className="col-span-5 flex flex-col items-center text-center space-y-1.5 sm:space-y-2">
                    <div className="w-full">
                      <span className="text-[10px] sm:text-[11px] text-cyan-400 font-bold uppercase tracking-wider block truncate">
                        {m.teamA?.shortName || "Team A"}
                      </span>
                      <h4 className="font-extrabold text-white text-xs sm:text-base md:text-lg truncate max-w-full sm:max-w-[200px] mx-auto">
                        {teamAName}
                      </h4>
                    </div>

                    <div
                      className="w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center shrink-0 overflow-hidden border-2 shadow-lg"
                      style={{
                        backgroundColor: `${m.teamA?.jerseyColor || "#2563eb"}25`,
                        borderColor: m.teamA?.jerseyColor || "#2563eb",
                        boxShadow: `0 0 20px ${m.teamA?.jerseyColor || "#2563eb"}30`,
                      }}
                    >
                      {teamALogo ? (
                        <img
                          src={teamALogo}
                          alt={teamAName}
                          className="w-10 h-10 sm:w-16 sm:h-16 md:w-18 md:h-18 object-contain"
                        />
                      ) : (
                        <span className="font-black text-xl sm:text-3xl text-white">
                          {m.teamA?.shortName || teamAName.charAt(0) || "A"}
                        </span>
                      )}
                    </div>

                    <p className="text-lg sm:text-2xl md:text-3xl font-black text-cyan-300">
                      {teamASets} <span className="text-[10px] sm:text-xs font-normal text-gray-400 block sm:inline">Sets</span>
                    </p>
                  </div>

                  {/* VS Middle */}
                  <div className="col-span-1 text-center flex flex-col items-center justify-center py-2">
                    <span className="text-[10px] sm:text-xs font-black text-amber-400 bg-white/5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-white/10">
                      VS
                    </span>
                    {m.venue && (
                      <span className="text-[9px] sm:text-[11px] text-gray-400 mt-1 sm:mt-2 hidden sm:flex items-center gap-1">
                        <FaMapMarkerAlt className="text-orange-400" /> {m.venue}
                      </span>
                    )}
                  </div>

                  {/* Team B */}
                  <div className="col-span-5 flex flex-col items-center text-center space-y-1.5 sm:space-y-2">
                    <div className="w-full">
                      <span className="text-[10px] sm:text-[11px] text-orange-400 font-bold uppercase tracking-wider block truncate">
                        {m.teamB?.shortName || "Team B"}
                      </span>
                      <h4 className="font-extrabold text-white text-xs sm:text-base md:text-lg truncate max-w-full sm:max-w-[200px] mx-auto">
                        {teamBName}
                      </h4>
                    </div>

                    <div
                      className="w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center shrink-0 overflow-hidden border-2 shadow-lg"
                      style={{
                        backgroundColor: `${m.teamB?.jerseyColor || "#ea580c"}25`,
                        borderColor: m.teamB?.jerseyColor || "#ea580c",
                        boxShadow: `0 0 20px ${m.teamB?.jerseyColor || "#ea580c"}30`,
                      }}
                    >
                      {teamBLogo ? (
                        <img
                          src={teamBLogo}
                          alt={teamBName}
                          className="w-10 h-10 sm:w-16 sm:h-16 md:w-18 md:h-18 object-contain"
                        />
                      ) : (
                        <span className="font-black text-xl sm:text-3xl text-white">
                          {m.teamB?.shortName || teamBName.charAt(0) || "B"}
                        </span>
                      )}
                    </div>

                    <p className="text-lg sm:text-2xl md:text-3xl font-black text-orange-300">
                      {teamBSets} <span className="text-[10px] sm:text-xs font-normal text-gray-400 block sm:inline">Sets</span>
                    </p>
                  </div>
                </div>

                {/* Set-by-Set Pills */}
                {m.sets && m.sets.length > 0 && m.sets.some((s: any) => s.teamAScore || s.teamBScore) && (
                  <div className="flex flex-wrap items-center justify-center gap-2 bg-black/25 p-2.5 rounded-2xl border border-white/5">
                    {m.sets.map((s: any, idx: number) => (
                      (s.teamAScore || s.teamBScore) ? (
                        <span
                          key={idx}
                          className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-gray-300"
                        >
                          Set {s.setNumber}: <strong className="text-cyan-300">{s.teamAScore || 0}</strong> - <strong className="text-orange-300">{s.teamBScore || 0}</strong>
                        </span>
                      ) : null
                    ))}
                  </div>
                )}

                {/* Squad counts & Result banner */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-400 bg-white/5 px-4 py-2 rounded-xl">
                  <span className="flex items-center gap-1.5">
                    <FaUsers className="text-cyan-400" /> {teamAName}: {teamAPlayers.length} players | {teamBName}: {teamBPlayers.length} players
                  </span>
                  <span className="flex items-center gap-1.5">
                    <FaCalendarAlt className="text-cyan-400" />
                    {m.date ? new Date(m.date).toLocaleDateString() : "TBD"} {m.time ? `• ${m.time}` : ""}
                  </span>
                </div>

                {m.result && (
                  <div className="text-xs font-bold text-cyan-200 bg-linear-to-r from-cyan-500/10 to-blue-500/10 px-4 py-2 rounded-xl text-center border border-cyan-500/20">
                    🏆 {m.result}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/5">
                  <button
                    onClick={() => handleOpenModal(m)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 text-xs font-bold transition-all cursor-pointer"
                  >
                    <FaEdit /> Edit Match & Sets
                  </button>
                  <button
                    onClick={() =>
                      handleDelete(m._id, `${teamAName} vs ${teamBName}`)
                    }
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-bold transition-all cursor-pointer"
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md overflow-hidden">
          <div className="relative bg-[#0e1622] border border-white/10 rounded-2xl sm:rounded-3xl w-full max-w-3xl max-h-[88vh] flex flex-col shadow-2xl overflow-hidden animate-fadeIn">
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-[#0e1622] shrink-0">
              <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2.5">
                <FaVolleyballBall className="text-amber-400 text-xl shrink-0" />
                <span>{editingMatch ? "Edit Volleyball Match" : "Add New Volleyball Match"}</span>
              </h3>
              <button
                type="button"
                onClick={handleCloseModal}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center text-sm font-bold transition-all cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} id="match-form" className="flex-1 overflow-y-auto min-h-0 p-4 sm:p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase mb-1">
                    Tournament Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.tournamentName}
                    onChange={(e) =>
                      setFormData({ ...formData, tournamentName: e.target.value })
                    }
                    placeholder="e.g. Volleyball Cup 2026"
                    className="w-full bg-[#070b10] border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-hidden focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase mb-1">
                    Match Type
                  </label>
                  <input
                    type="text"
                    value={formData.matchType}
                    onChange={(e) =>
                      setFormData({ ...formData, matchType: e.target.value })
                    }
                    placeholder="e.g. Final / Semi Final / League"
                    className="w-full bg-[#070b10] border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-hidden focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase mb-1">
                    Status *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="w-full bg-[#070b10] border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-hidden focus:border-cyan-400 cursor-pointer"
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="Live">Live</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    className="w-full bg-[#070b10] border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-hidden focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) =>
                      setFormData({ ...formData, time: e.target.value })
                    }
                    className="w-full bg-[#070b10] border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-hidden focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase mb-1">
                    Match Format
                  </label>
                  <select
                    value={formData.matchFormat}
                    onChange={(e) =>
                      setFormData({ ...formData, matchFormat: e.target.value })
                    }
                    className="w-full bg-[#070b10] border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-hidden focus:border-cyan-400 cursor-pointer"
                  >
                    <option value="Best of 3">Best of 3 Sets</option>
                    <option value="Best of 5">Best of 5 Sets</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase mb-1">
                    Venue *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.venue}
                    onChange={(e) =>
                      setFormData({ ...formData, venue: e.target.value })
                    }
                    placeholder="e.g. Mohisherghop Court"
                    className="w-full bg-[#070b10] border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-hidden focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* Set Scores */}
              <div className="bg-[#070b10] p-4 rounded-2xl border border-white/10 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-black text-white flex items-center gap-1.5 uppercase">
                      <FaVolleyballBall className="text-cyan-400" /> Volleyball Set Scores
                    </h4>
                    <p className="text-[11px] text-gray-400">
                      Enter set points (Set 1 to Set 5). Total sets won calculate automatically.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleAddSet}
                      disabled={formData.sets.length >= 5}
                      className="px-2.5 py-1 text-xs font-bold rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 disabled:opacity-30 transition-colors cursor-pointer"
                    >
                      + Add Set
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveSet}
                      disabled={formData.sets.length <= 1}
                      className="px-2.5 py-1 text-xs font-bold rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 disabled:opacity-30 transition-colors cursor-pointer"
                    >
                      - Remove Set
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                  {formData.sets.map((set, idx) => (
                    <div
                      key={idx}
                      className="bg-[#0e1622] p-2.5 rounded-xl border border-white/10 text-center"
                    >
                      <span className="block text-[11px] font-bold text-gray-300 mb-1.5 uppercase">
                        Set {set.setNumber}
                      </span>
                      <div className="flex items-center justify-center gap-1.5">
                        <div>
                          <span className="text-[10px] text-cyan-400 font-bold block truncate max-w-[45px]">
                            {formData.teamA.shortName || "A"}
                          </span>
                          <input
                            type="number"
                            min="0"
                            value={set.teamAScore}
                            onChange={(e) =>
                              handleSetScoreChange(idx, "teamAScore", e.target.value)
                            }
                            placeholder="0"
                            className="w-12 text-center bg-[#070b10] border border-white/10 rounded-lg py-1 text-white text-xs font-bold focus:outline-hidden focus:border-cyan-400"
                          />
                        </div>
                        <span className="text-gray-500 font-bold text-xs">:</span>
                        <div>
                          <span className="text-[10px] text-orange-400 font-bold block truncate max-w-[45px]">
                            {formData.teamB.shortName || "B"}
                          </span>
                          <input
                            type="number"
                            min="0"
                            value={set.teamBScore}
                            onChange={(e) =>
                              handleSetScoreChange(idx, "teamBScore", e.target.value)
                            }
                            placeholder="0"
                            className="w-12 text-center bg-[#070b10] border border-white/10 rounded-lg py-1 text-white text-xs font-bold focus:outline-hidden focus:border-orange-400"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between bg-white/5 p-2.5 rounded-xl border border-white/5 text-xs">
                  <span className="font-bold text-gray-300">Total Sets Won:</span>
                  <div className="flex items-center gap-3">
                    <span className="font-black text-cyan-300">
                      {formData.teamA.name || "Team A"}: {formData.teamA.setsWon}
                    </span>
                    <span className="font-black text-orange-300">
                      {formData.teamB.name || "Team B"}: {formData.teamB.setsWon}
                    </span>
                  </div>
                </div>
              </div>

              {/* Team A & Team B */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Team A */}
                <div className="bg-[#070b10] p-4 rounded-2xl border border-white/10 space-y-3">
                  <h4 className="text-xs font-black text-cyan-400 uppercase tracking-wider">
                    Team A Details
                  </h4>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1">
                      Team A Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.teamA.name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          teamA: { ...formData.teamA, name: e.target.value },
                        })
                      }
                      placeholder="e.g. Aro Ekdin"
                      className="w-full bg-[#0e1622] border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-hidden focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1">
                      Short Name
                    </label>
                    <input
                      type="text"
                      value={formData.teamA.shortName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          teamA: { ...formData.teamA, shortName: e.target.value },
                        })
                      }
                      placeholder="e.g. AE"
                      className="w-full bg-[#0e1622] border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-hidden focus:border-cyan-400"
                    />
                  </div>

                  <div className="bg-[#0e1622] p-3 rounded-xl border border-white/10">
                    <label className="block text-[11px] font-bold text-gray-300 uppercase mb-2 flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-cyan-400">
                        <FaPalette /> Team A Jersey Color
                      </span>
                      <span
                        className="w-4 h-4 rounded-full border border-white/40 shadow-sm"
                        style={{ backgroundColor: formData.teamA.jerseyColor }}
                      ></span>
                    </label>

                    <div className="flex flex-wrap items-center gap-2">
                      {PRESET_COLORS.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              teamA: { ...formData.teamA, jerseyColor: color },
                            })
                          }
                          className={`w-6 h-6 rounded-full border-2 transition-all cursor-pointer ${
                            formData.teamA.jerseyColor.toLowerCase() === color.toLowerCase()
                              ? "scale-125 border-white shadow-lg ring-2 ring-cyan-400/50"
                              : "border-transparent opacity-80 hover:opacity-100 hover:scale-110"
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                      
                      <label
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-bold text-gray-300 cursor-pointer transition-colors"
                        title="Pick Custom Color"
                      >
                        <input
                          type="color"
                          value={formData.teamA.jerseyColor}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              teamA: { ...formData.teamA, jerseyColor: e.target.value },
                            })
                          }
                          className="w-5 h-5 rounded-md border-0 bg-transparent cursor-pointer p-0"
                        />
                        <span>Pick Color</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1">
                      Team A Logo
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setTeamALogoFile(e.target.files ? e.target.files[0] : null)}
                      className="w-full text-[11px] text-gray-400 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[11px] file:font-semibold file:bg-cyan-500/20 file:text-cyan-300 hover:file:bg-cyan-500/30 cursor-pointer"
                    />
                    <input
                      type="url"
                      value={formData.teamA.logo}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          teamA: { ...formData.teamA, logo: e.target.value },
                        })
                      }
                      placeholder="Or paste image URL"
                      className="w-full bg-[#0e1622] border border-white/10 rounded-xl px-3 py-1.5 text-white text-xs mt-1.5"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-cyan-300 uppercase mb-1">
                      Team A Players (Comma separated)
                    </label>
                    <textarea
                      rows={2}
                      value={formData.teamA.players}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          teamA: { ...formData.teamA, players: e.target.value },
                        })
                      }
                      placeholder="e.g. Shanto, Sakib, Rakib, Tanvir, Hasan, Rifat"
                      className="w-full bg-[#0e1622] border border-white/10 rounded-xl px-3 py-1.5 text-white text-xs focus:outline-hidden focus:border-cyan-400"
                    />
                  </div>
                </div>

                {/* Team B */}
                <div className="bg-[#070b10] p-4 rounded-2xl border border-white/10 space-y-3">
                  <h4 className="text-xs font-black text-orange-400 uppercase tracking-wider">
                    Team B Details
                  </h4>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1">
                      Team B Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.teamB.name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          teamB: { ...formData.teamB, name: e.target.value },
                        })
                      }
                      placeholder="e.g. Challenger Team"
                      className="w-full bg-[#0e1622] border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-hidden focus:border-orange-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1">
                      Short Name
                    </label>
                    <input
                      type="text"
                      value={formData.teamB.shortName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          teamB: { ...formData.teamB, shortName: e.target.value },
                        })
                      }
                      placeholder="e.g. CT"
                      className="w-full bg-[#0e1622] border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-hidden focus:border-orange-400"
                    />
                  </div>

                  <div className="bg-[#0e1622] p-3 rounded-xl border border-white/10">
                    <label className="block text-[11px] font-bold text-gray-300 uppercase mb-2 flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-orange-400">
                        <FaPalette /> Team B Jersey Color
                      </span>
                      <span
                        className="w-4 h-4 rounded-full border border-white/40 shadow-sm"
                        style={{ backgroundColor: formData.teamB.jerseyColor }}
                      ></span>
                    </label>

                    <div className="flex flex-wrap items-center gap-2">
                      {PRESET_COLORS.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              teamB: { ...formData.teamB, jerseyColor: color },
                            })
                          }
                          className={`w-6 h-6 rounded-full border-2 transition-all cursor-pointer ${
                            formData.teamB.jerseyColor.toLowerCase() === color.toLowerCase()
                              ? "scale-125 border-white shadow-lg ring-2 ring-orange-400/50"
                              : "border-transparent opacity-80 hover:opacity-100 hover:scale-110"
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                      
                      <label
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-bold text-gray-300 cursor-pointer transition-colors"
                        title="Pick Custom Color"
                      >
                        <input
                          type="color"
                          value={formData.teamB.jerseyColor}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              teamB: { ...formData.teamB, jerseyColor: e.target.value },
                            })
                          }
                          className="w-5 h-5 rounded-md border-0 bg-transparent cursor-pointer p-0"
                        />
                        <span>Pick Color</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1">
                      Team B Logo
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setTeamBLogoFile(e.target.files ? e.target.files[0] : null)}
                      className="w-full text-[11px] text-gray-400 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[11px] file:font-semibold file:bg-orange-500/20 file:text-orange-300 hover:file:bg-orange-500/30 cursor-pointer"
                    />
                    <input
                      type="url"
                      value={formData.teamB.logo}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          teamB: { ...formData.teamB, logo: e.target.value },
                        })
                      }
                      placeholder="Or paste image URL"
                      className="w-full bg-[#0e1622] border border-white/10 rounded-xl px-3 py-1.5 text-white text-xs mt-1.5"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-orange-300 uppercase mb-1">
                      Team B Players (Comma separated)
                    </label>
                    <textarea
                      rows={2}
                      value={formData.teamB.players}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          teamB: { ...formData.teamB, players: e.target.value },
                        })
                      }
                      placeholder="e.g. Player 1, Player 2, Player 3, Player 4"
                      className="w-full bg-[#0e1622] border border-white/10 rounded-xl px-3 py-1.5 text-white text-xs focus:outline-hidden focus:border-orange-400"
                    />
                  </div>
                </div>
              </div>

              {/* Result, MOTM & Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase mb-1">
                    Match Result Summary
                  </label>
                  <input
                    type="text"
                    value={formData.result}
                    onChange={(e) =>
                      setFormData({ ...formData, result: e.target.value })
                    }
                    placeholder="e.g. Team A won 3-1 sets"
                    className="w-full bg-[#070b10] border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-hidden focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase mb-1">
                    Player of the Match / Best Spiker
                  </label>
                  <input
                    type="text"
                    value={formData.manOfTheMatch}
                    onChange={(e) =>
                      setFormData({ ...formData, manOfTheMatch: e.target.value })
                    }
                    placeholder="e.g. Sakib (Best Spiker)"
                    className="w-full bg-[#070b10] border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-hidden focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase mb-1">
                    Match Notes
                  </label>
                  <input
                    type="text"
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    placeholder="e.g. Toss result, ground condition"
                    className="w-full bg-[#070b10] border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-hidden focus:border-cyan-400"
                  />
                </div>
              </div>
            </form>

            <div className="flex items-center justify-end gap-3 p-4 sm:p-5 border-t border-white/10 bg-[#090e17] shrink-0">
              <button
                type="button"
                onClick={handleCloseModal}
                disabled={isUploading}
                className="px-4 py-2 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 font-bold text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="match-form"
                disabled={isUploading}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-linear-to-r from-blue-500 to-cyan-400 text-slate-950 font-black text-xs hover:opacity-90 transition-all shadow-lg disabled:opacity-50 hover:scale-105 cursor-pointer"
              >
                {isUploading ? (
                  <>
                    <FaSpinner className="animate-spin" /> Uploading & Saving...
                  </>
                ) : editingMatch ? (
                  "Save Changes"
                ) : (
                  "Create Match"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function ManageMatchesPage() {
  return (
    <AdminRoute>
      <ManageMatchesContent />
    </AdminRoute>
  );
}
