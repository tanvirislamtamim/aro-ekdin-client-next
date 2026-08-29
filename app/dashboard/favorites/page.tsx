"use client";

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';
import PlayerCard from '../../(main)/players/PlayerCard';
import { Player } from '../../../types';

const FavoritePlayers = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data: favorites = [], isLoading, refetch } = useQuery<Player[]>({
        queryKey: ['favorites', user?.email],
        queryFn: async () => {
            if (!user?.email) return [];
            const res = await axiosSecure.get('/favorites');
            return res.data;
        },
        enabled: !!user?.email
    });

    return (
        <div className="min-h-screen bg-[#0b0f12] text-white p-4 md:p-8">
            <style>{`
                @keyframes cardEntrance {
                    from { opacity: 0; transform: translateY(40px) scale(0.95); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                .animate-card-load {
                    opacity: 0;
                    animation: cardEntrance 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
                }
            `}</style>
            
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl font-extrabold pb-2 bg-linear-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent inline-block">
                        My Favorite Players
                    </h1>
                    <div className="h-1 w-20 bg-cyan-300 mx-auto mt-4 rounded-full opacity-80"></div>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
                        {[...Array(4)].map((_, i) => (
                            <PlayerCard key={i} player={null} />
                        ))}
                    </div>
                ) : favorites.length === 0 ? (
                    <div className="text-center text-gray-400 mt-16 text-lg">
                        You haven&apos;t added any favorite players yet.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
                        {favorites.map((player, index) => (
                            <div 
                                key={player._id} 
                                className="animate-card-load w-full flex justify-center"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <PlayerCard 
                                  player={player} 
                                  index={index} 
                                  isFavorite={true}
                                  refetchFavorites={refetch}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FavoritePlayers;
