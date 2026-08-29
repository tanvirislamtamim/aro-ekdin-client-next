"use client";

import React, { useState } from 'react';
import PlayerCard from './PlayerCard';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';
import { Player } from '../../../types';

const PlayersPage = () => {
    const [selectedPosition, setSelectedPosition] = useState("All");
    const [searchText, setSearchText] = useState("");
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();

    const { data: players = [], isLoading, isError } = useQuery<Player[]>({
        queryKey: ['players'],
        queryFn: async () => {
            const res = await axiosSecure.get('/players'); 
            return res.data;
        }
    });

    const { data: favorites = [], refetch: refetchFavorites } = useQuery<Player[]>({
        queryKey: ['favorites', user?.email],
        queryFn: async () => {
            if (!user?.email) return [];
            const res = await axiosSecure.get('/favorites');
            return res.data;
        },
        enabled: !!user?.email
    });

    // Filter + Search Logic
    const filteredPlayers = players.filter(player => {
        const matchPosition =
            selectedPosition === "All" || player.position === selectedPosition;

        const matchSearch =
            player.name.toLowerCase().includes(searchText.toLowerCase());

        return matchPosition && matchSearch;
    });

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            <style>{`
                @keyframes cardEntrance {
                    from { opacity: 0; transform: translate3d(0, 40px, 0) scale(0.95); }
                    to { opacity: 1; transform: translate3d(0, 0, 0) scale(1); }
                }
                .animate-card-load {
                    opacity: 0;
                    animation: cardEntrance 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
                    will-change: transform, opacity;
                    -webkit-backface-visibility: hidden;
                    backface-visibility: hidden;
                }
            `}</style>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight pb-2 bg-linear-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent inline-block">
                        All Players
                    </h1>
                    <div className="h-1 w-20 bg-cyan-300 mx-auto mt-4 rounded-full opacity-80"></div>
                </div>

                <div className="flex justify-center mb-6">
                    <input
                        type="text"
                        placeholder="Search player by name..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        className="w-full max-w-md px-4 py-2 rounded-full bg-gray-900 border border-gray-600 focus:border-cyan-300 outline-none text-white placeholder-gray-400"
                    />
                </div>

                <div className="flex flex-wrap justify-center gap-3 mb-10">
                    {["All", "Setter", "Libero", "Middle Blocker", "Outside Hitter", "Opposite Hitter"].map(pos => (
                        <button
                            key={pos}
                            onClick={() => setSelectedPosition(pos)}
                            className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-300 cursor-pointer 
                                ${selectedPosition === pos 
                                    ? "bg-cyan-400 text-black border-cyan-400" 
                                    : "border-gray-600 hover:border-cyan-300 hover:text-cyan-300"
                                }`}
                        >
                            {pos}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
                    {isLoading || isError
                        ? [...Array(8)].map((_, i) => (
                            <PlayerCard key={i} player={null} />
                        ))
                        : filteredPlayers.map((player, index) => (
                            <div
                                key={player._id}
                                className="animate-card-load w-full flex justify-center"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <PlayerCard 
                                  player={player} 
                                  index={index} 
                                  isFavorite={favorites.some(fav => fav._id === player._id)}
                                  refetchFavorites={refetchFavorites}
                                />
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    );
};

export default PlayersPage;
