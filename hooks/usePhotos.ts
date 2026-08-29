"use client";

import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";
import { PhotoItem } from "../types";

export const usePhotos = () => {
  const axiosSecure = useAxiosSecure();

  return useQuery<PhotoItem[]>({
    queryKey: ["photos"],
    queryFn: async () => {
      const { data } = await axiosSecure.get("/photos");
      return data;
    },
  });
};

export default usePhotos;
