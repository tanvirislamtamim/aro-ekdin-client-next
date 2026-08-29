"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FaHeart } from "react-icons/fa";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { Player } from "../../../types";

interface PlayerCardProps {
  player: Player | null;
  index?: number;
  isFavorite?: boolean;
  refetchFavorites?: () => void;
}

const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  index = 0,
  isFavorite = false,
  refetchFavorites,
}) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const handleFavoriteToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user || !player) return;
    try {
      if (isFavorite) {
        await axiosSecure.delete(`/favorites/${player._id}`);
      } else {
        await axiosSecure.post('/favorites', { playerId: player._id });
      }
      if (refetchFavorites) {
        refetchFavorites();
      }
    } catch (err) {
      console.error("Error toggling favorite:", err);
    }
  };

  // Skeleton Loader (when no player)
  if (!player) {
    return (
      <div className="flex justify-center w-full p-2">
        <div className="w-full max-w-[320px] min-h-80 rounded-2xl p-6 bg-gray-900 animate-pulse flex flex-col items-center justify-between">
          <div className="w-full flex flex-col items-center">
            <div className="h-28 w-28 rounded-full bg-gray-700 mb-5"></div>
            <div className="h-6 w-3/4 bg-gray-700 rounded mb-3"></div>
            <div className="flex gap-2 mb-4">
              <div className="h-6 w-20 bg-gray-700 rounded-full"></div>
              <div className="h-6 w-24 bg-gray-700 rounded-full"></div>
            </div>
            <div className="w-12 h-1 bg-gray-700 rounded mb-4"></div>
          </div>
          <div className="w-full h-10 bg-gray-700 rounded-xl"></div>
        </div>
      </div>
    );
  }

  const { name, position, img, jersey } = player;

  return (
    <div className="flex justify-center w-full p-2">
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-card {
          opacity: 0;
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .modern-3d-card {
          transform-style: preserve-3d;
          background: linear-gradient(135deg, rgba(18, 18, 30, 0.9), rgba(8, 8, 18, 0.95));
          backdrop-filter: blur(12px);
          border: 1px solid rgba(139, 92, 246, 0.25);
          transition: transform 0.5s cubic-bezier(0.2, 0.9, 0.4, 1.1), box-shadow 0.5s ease, border-color 0.5s ease;
          will-change: transform;
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
          transform: translateZ(0);
        }

        @media (hover: hover) {
          .modern-3d-card:hover {
            transform: translate3d(0, -12px, 0) rotateX(6deg) rotateY(-4deg);
            box-shadow: 0 35px 50px -20px rgba(139, 92, 246, 0.4);
            border-color: rgba(139, 92, 246, 0.6);
          }
        }

        .player-image-container::after {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: 50%;
          padding: 2px;
          background: linear-gradient(
            to right,
            #60a5fa,
            #67e8f9,
            #818cf8
          );
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask-composite: exclude;
        }

        .buy-button {
          background: linear-gradient(
            to right,
            #60a5fa,
            #67e8f9,
            #818cf8
          );
          background-size: 200% auto;
          transition: 0.3s;
        }
        .buy-button:hover {
          background-position: right center;
        }
      `}</style>

      <div 
        className="modern-3d-card animate-card relative w-full max-w-[320px] min-h-80 rounded-2xl overflow-hidden shadow-2xl p-6 flex flex-col items-center text-center justify-between"
        style={{ animationDelay: `${index * 0.15}s` }}
      >
        {/* Favorite Button */}
        {user && (
          <button 
            onClick={handleFavoriteToggle} 
            className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/45 hover:bg-black/65 border border-white/10 hover:border-purple-400/50 hover:scale-110 active:scale-95 transition-all duration-300 shadow-md group cursor-pointer"
          >
            <FaHeart 
              className={`transition-colors duration-300 ${
                isFavorite 
                  ? "text-red-500 fill-red-500 drop-shadow-[0_0_6px_rgba(239,68,68,0.6)]" 
                  : "text-gray-400 group-hover:text-red-400"
              }`} 
              size={18} 
            />
          </button>
        )}
        
        <div className="w-full flex flex-col items-center">
          {/* Image with Skeleton */}
          <div className="player-image-container relative mb-5 h-28 w-28">
            {!imgLoaded && (
              <div className="absolute inset-0 rounded-full bg-gray-700 animate-pulse"></div>
            )}

            <img
              src={img}
              alt={name}
              loading="lazy"
              decoding="async"
              onLoad={() => setImgLoaded(true)}
              className={`w-28 h-28 rounded-full object-cover border-2 border-purple-500/40 shadow-xl transition-opacity duration-500 ${
                imgLoaded ? "opacity-100" : "opacity-0"
              }`}
            />
          </div>

          <div className="h-16 flex items-center justify-center mb-2">
            <h2 className="text-2xl font-bold text-white line-clamp-2">
              {name}
            </h2>
          </div>

          <div className="h-15 flex flex-wrap justify-center items-center gap-2 mb-4">
            <div className="px-4 py-1.5 rounded-full bg-white/5 border border-purple-500/30 text-purple-200 text-sm font-semibold">
              {position}
            </div>
            <div className="px-4 py-1.5 rounded-full bg-white/5 border border-purple-500/30 text-purple-200 text-sm font-semibold">
              Number: {jersey}
            </div>
          </div>

          <div className="w-12 h-0.5 bg-linear-to-r from-blue-400 via-cyan-300 to-indigo-400 rounded-full mt-1 mb-4"></div>
        </div>

        <div className="w-full">
          <Link href={`/players/${player._id}`}>
            <button className="buy-button w-full py-3 rounded-xl text-black font-bold shadow-lg cursor-pointer">
              View Details
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;
