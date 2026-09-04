"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import LoadingSpinner from "../../../components/LoadingSpinner/LoadingSpinner";

const VideosClient = () => {
  const API_KEY =
    process.env.NEXT_PUBLIC_YOUTUBE_API_KEY ||
    "AIzaSyAe0og_1m6ea7zazPI96pjK-bRz4rfAb24";
  const CHANNEL_ID =
    process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID || "UCf9PIYP6I_lU46BGcNB3u9w";

  const { data: videos = [], isLoading } = useQuery({
    queryKey: ["youtubeVideos"],
    queryFn: async () => {
      try {
        const res = await axios.get("/api/youtube");
        if (res.data?.items) {
          return res.data.items;
        }
      } catch (err) {
        console.warn("Server route error, trying direct client fetch:", err);
      }

      const directRes = await axios.get(
        "https://www.googleapis.com/youtube/v3/search",
        {
          params: {
            key: API_KEY,
            channelId: CHANNEL_ID,
            part: "snippet",
            order: "date",
            maxResults: 20,
            type: "video",
          },
        }
      );
      return directRes.data.items || [];
    },
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="bg-linear-to-br from-gray-900 via-slate-900 to-black min-h-screen p-8 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-linear-to-br from-blue-400/20 via-cyan-300/10 to-indigo-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-linear-to-tr from-blue-400/20 via-cyan-300/10 to-indigo-400/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl md:text-6xl font-black mb-4">
            <span className="bg-linear-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent">
              YouTube Videos & Highlights
            </span>
          </h1>
          <div className="flex items-center justify-center gap-2 text-gray-400">
            <div className="h-px w-12 bg-linear-to-r from-transparent via-blue-400 to-transparent"></div>
            <span className="text-sm uppercase tracking-widest">
              Latest Match Clips & Practice Sessions
            </span>
            <div className="h-px w-12 bg-linear-to-r from-transparent via-indigo-400 to-transparent"></div>
          </div>
        </div>

        {/* Videos Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video: any) => {
            const videoId = video.id?.videoId;
            const isLive = video.snippet?.liveBroadcastContent === "live";

            if (!videoId) return null;

            return (
              <div
                key={videoId}
                className="group relative bg-linear-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-800 hover:border-blue-400/30 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-400/10 hover:-translate-y-1"
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-linear-to-br from-blue-400/0 via-cyan-300/0 to-indigo-400/0 group-hover:from-blue-400/5 group-hover:via-cyan-300/5 group-hover:to-indigo-400/5 transition-all duration-500 pointer-events-none"></div>

                {/* Content Section */}
                <div className="p-6 relative">
                  {/* LIVE Badge */}
                  {isLive && (
                    <div className="flex items-center gap-2 mb-4">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                      </span>
                      <span className="bg-linear-to-r from-red-500 to-red-600 text-white px-4 py-1.5 rounded-full text-xs font-bold tracking-wider">
                        LIVE
                      </span>
                    </div>
                  )}

                  {/* Title */}
                  <h2 className="text-white text-lg font-bold line-clamp-2 mb-4 group-hover:text-transparent group-hover:bg-linear-to-r group-hover:from-blue-400 group-hover:via-cyan-300 group-hover:to-indigo-400 group-hover:bg-clip-text transition-all duration-300">
                    {video.snippet.title}
                  </h2>

                  {/* Date & Channel Info */}
                  <div className="flex items-center gap-3 mb-5">
                    <div className="flex items-center gap-1.5 text-gray-400 text-sm">
                      <svg
                        className="w-4 h-4 text-blue-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      {new Date(video.snippet.publishedAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </div>
                    <div className="h-1 w-1 bg-gray-600 rounded-full"></div>
                    <div className="flex items-center gap-1.5 text-gray-400 text-sm">
                      <svg
                        className="w-4 h-4 text-cyan-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      {video.snippet.channelTitle}
                    </div>
                  </div>

                  {/* Video Player */}
                  <div className="relative group/player">
                    <div className="absolute -inset-0.5 bg-linear-to-r from-blue-400 via-cyan-300 to-indigo-400 rounded-xl opacity-0 group-hover/player:opacity-75 blur transition-all duration-300"></div>
                    <iframe
                      className="relative w-full h-60 rounded-xl"
                      src={`https://www.youtube.com/embed/${videoId}`}
                      title={video.snippet.title}
                      allowFullScreen
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-5">
                    <a
                      href={`https://www.youtube.com/watch?v=${videoId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-linear-to-r from-blue-400/10 via-cyan-300/10 to-indigo-400/10 hover:from-blue-400/20 hover:via-cyan-300/20 hover:to-indigo-400/20 border border-gray-700 hover:border-blue-400/50 text-gray-300 hover:text-white rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 group/btn cursor-pointer"
                    >
                      <svg
                        className="w-4 h-4 group-hover/btn:scale-110 transition-transform"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                      </svg>
                      Watch on YouTube
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {videos.length === 0 && !isLoading && (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-linear-to-br from-blue-400/20 via-cyan-300/20 to-indigo-400/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-12 h-12 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-400 mb-2">
              No Videos Found
            </h3>
            <p className="text-gray-500">Check back later for new content</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideosClient;
