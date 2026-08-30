"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxios from "./useAxios";
import useAxiosSecure from "./useAxiosSecure";
import {
  CourtPlayer,
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

export function useCourtLineup() {
  const axiosPublic = useAxios();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // 1. Fetch direct from MongoDB via backend GET /court-lineup
  const {
    data: lineupData,
    isLoading,
    isError,
    refetch,
  } = useQuery<CourtLineupData>({
    queryKey: ["court-lineup"],
    queryFn: async () => {
      const res = await axiosPublic.get("/court-lineup");
      return res.data;
    },
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });

  // 2. Persist direct to MongoDB via backend POST /court-lineup
  const updateLineupMutation = useMutation({
    mutationFn: async (payload: Partial<CourtLineupData>) => {
      const fullPayload: CourtLineupData = {
        type: "active_starting_six",
        players: payload.players || [],
        formation: payload.formation || "standard",
        captainId: payload.captainId || null,
        liberoId: payload.liberoId || null,
        netHeight: payload.netHeight || "men",
        notes: payload.notes || "",
        updatedAt: new Date().toISOString(),
      };

      try {
        const res = await axiosSecure.post("/court-lineup", fullPayload);
        return res.data;
      } catch (postErr) {
        const res = await axiosSecure.put("/court-lineup", fullPayload);
        return res.data;
      }
    },
    onSuccess: () => {
      // Invalidate queries so all devices immediately fetch fresh MongoDB data
      queryClient.invalidateQueries({ queryKey: ["court-lineup"] });
    },
  });

  const players: CourtPlayer[] = lineupData?.players || [];

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
