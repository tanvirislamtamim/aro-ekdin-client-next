"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxios from "./useAxios";
import useAxiosSecure from "./useAxiosSecure";
import {
  CourtPlayer,
  DEFAULT_LINEUP_PLAYERS,
  FormationType,
} from "../components/VolleyballCourt/courtData";

export interface CourtLineupData {
  _id?: string;
  type: string;
  players: CourtPlayer[];
  formation?: FormationType;
  captainId?: string | null;
  liberoId?: string | null;
  netHeight?: "men" | "women";
  notes?: string;
  updatedAt?: string | null;
  updatedBy?: string | null;
}

const STORAGE_KEY = "aro_ekdin_court_lineup_v2";

export function useCourtLineup() {
  const axiosPublic = useAxios();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // Helper to load from local storage
  const getLocalLineup = (): CourtLineupData | null => {
    if (typeof window === "undefined") return null;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.players && parsed.players.length === 6) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Failed to parse local court lineup", e);
    }
    return null;
  };

  const {
    data: lineupData,
    isLoading,
    isError,
    refetch,
  } = useQuery<CourtLineupData>({
    queryKey: ["court-lineup"],
    queryFn: async () => {
      // 1. Try fetching from remote DB
      try {
        const res = await axiosPublic.get("/court-lineup");
        if (res.data && res.data.players && res.data.players.length === 6) {
          if (typeof window !== "undefined") {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(res.data));
          }
          return res.data;
        }
      } catch (err) {
        console.warn("Could not fetch court lineup from remote DB, checking local cache", err);
      }

      // 2. Fallback to local storage if DB call failed or returned empty
      const local = getLocalLineup();
      if (local) return local;

      // 3. Fallback to default
      return {
        type: "active_starting_six",
        players: DEFAULT_LINEUP_PLAYERS,
        formation: "standard",
        netHeight: "men",
      };
    },
    staleTime: 0, // Always fresh
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  // Listen for storage or custom events for real-time multi-tab / navigation sync
  useEffect(() => {
    const handleSync = () => {
      queryClient.invalidateQueries({ queryKey: ["court-lineup"] });
    };

    window.addEventListener("court-lineup-updated", handleSync);
    window.addEventListener("storage", handleSync);
    return () => {
      window.removeEventListener("court-lineup-updated", handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, [queryClient]);

  // Mutation to save lineup to DB & local storage
  const updateLineupMutation = useMutation({
    mutationFn: async (payload: Partial<CourtLineupData>) => {
      const fullPayload: CourtLineupData = {
        type: "active_starting_six",
        players: payload.players || DEFAULT_LINEUP_PLAYERS,
        formation: payload.formation || "standard",
        captainId: payload.captainId || null,
        liberoId: payload.liberoId || null,
        netHeight: payload.netHeight || "men",
        notes: payload.notes || "",
        updatedAt: new Date().toISOString(),
      };

      // 1. Instantly save to local storage
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(fullPayload));
        window.dispatchEvent(new CustomEvent("court-lineup-updated"));
      }

      // 2. Persist to MongoDB backend
      try {
        const res = await axiosSecure.put("/court-lineup", fullPayload);
        return res.data;
      } catch (err) {
        console.warn("Backend PUT /court-lineup returned error, saved locally:", err);
        return { success: true, localSaved: true };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["court-lineup"] });
    },
  });

  const players: CourtPlayer[] =
    lineupData?.players && lineupData.players.length === 6
      ? lineupData.players
      : DEFAULT_LINEUP_PLAYERS;

  return {
    lineupData,
    players,
    formation: lineupData?.formation || "standard",
    netHeight: lineupData?.netHeight || "men",
    isLoading,
    isError,
    refetch,
    updateLineup: updateLineupMutation.mutateAsync,
    isUpdating: updateLineupMutation.isPending,
  };
}

export default useCourtLineup;

