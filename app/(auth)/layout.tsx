import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Account",
    robots: {
        index: false,
        follow: false,
    },
};

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="bg-[#0a0a0a] min-h-screen flex flex-col relative overflow-hidden">
            {/* Animated Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-150 h-150 bg-linear-to-r from-blue-400/10 via-cyan-300/10 to-indigo-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-150 h-150 bg-linear-to-r from-blue-400/5 via-cyan-300/5 to-indigo-400/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 animate-pulse" style={{animationDelay: '1s'}}></div>
                <div className="absolute top-1/2 left-1/2 w-100 h-100 bg-linear-to-r from-blue-500/5 via-cyan-400/5 to-indigo-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
            </div>

            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
                style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                    backgroundSize: '40px 40px'
                }}>
            </div>

            {/* Top Logo Section */}
            <div className='relative p-6 md:p-10'>
                <Link href="/" className="inline-flex items-center gap-3 group">
                    <div className="relative">
                        {/* Logo Glow Effect */}
                        <div className="absolute inset-0 bg-linear-to-r from-blue-400/30 via-cyan-300/30 to-indigo-400/30 blur-xl rounded-full group-hover:from-blue-400/50 group-hover:via-cyan-300/50 group-hover:to-indigo-400/50 transition-all duration-500"></div>
                        <img
                            src="https://res.cloudinary.com/do8awe7fc/image/upload/q_auto/f_auto/v1777145975/Logo_qzb1xk.jpg"
                            alt="Aro Ekdin Logo"
                            className="relative w-12 h-12 md:w-14 md:h-14 rounded-full object-cover border-2 border-white/20 shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:border-blue-400/50 group-hover:shadow-blue-400/20"
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-blue-400 via-cyan-300 to-indigo-400 tracking-tight">
                            Aro Ekdin
                        </span>
                        <span className="text-xs text-gray-500 tracking-[0.2em] uppercase">Volleyball Community</span>
                    </div>
                </Link>
            </div>

            {/* Main Content Wrapper */}
            <div className="relative grow flex items-center justify-center p-4">
                <div className="container max-w-6xl mx-auto">
                    <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-8 lg:gap-20">
                        
                        {/* Left Side: Form Content */}
                        <div className='flex-1 w-full max-w-md flex justify-center mt-12 lg:justify-start z-10'>
                            <div className="w-full">
                                {children}
                            </div>
                        </div>

                        {/* Right Side: Realistic Volleyball Animation Section */}
                        <div className='flex-1 flex justify-center items-center z-10 mb-8 lg:mb-0'>
                            <div className="relative w-64 h-72 sm:w-80 sm:h-88 lg:w-125 lg:h-125">
                                <div className="absolute inset-0 bg-linear-to-br from-blue-600/20 via-cyan-500/15 to-indigo-600/20 rounded-full blur-3xl animate-pulse"></div>
                                
                                <div className="absolute top-[15%] left-[20%] w-24 h-24 sm:w-36 sm:h-36 lg:w-48 lg:h-48 bg-blue-500/15 rounded-full blur-3xl animate-pulse-slow"></div>
                                <div className="absolute bottom-[20%] right-[15%] w-28 h-28 sm:w-40 sm:h-40 lg:w-56 lg:h-56 bg-cyan-500/15 rounded-full blur-3xl animate-pulse-slower"></div>
                                <div className="absolute top-[40%] right-[25%] w-20 h-20 sm:w-28 sm:h-28 lg:w-40 lg:h-40 bg-indigo-500/10 rounded-full blur-3xl animate-float"></div>

                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="relative w-40 h-40 sm:w-56 sm:h-56 lg:w-80 lg:h-80">
                                        <div className="absolute inset-0 animate-volleyball-bounce">
                                            <div className="relative w-full h-full animate-spin-slow">
                                                <img 
                                                    src="https://pngimg.com/uploads/volleyball/volleyball_PNG39.png" 
                                                    alt="Realistic Volleyball"
                                                    className="w-full h-full object-contain drop-shadow-2xl filter"
                                                    style={{
                                                        filter: 'drop-shadow(0 25px 25px rgba(0,0,0,0.5)) drop-shadow(0 0 50px rgba(59,130,246,0.3))',
                                                    }}
                                                />
                                                <div className="absolute inset-0 bg-linear-to-br from-blue-400/20 via-transparent to-indigo-400/20 rounded-full blur-2xl -z-10"></div>
                                            </div>
                                        </div>

                                        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-4 lg:w-40 lg:h-6 bg-black/50 rounded-full blur-lg animate-shadow-pulse"></div>

                                        {[...Array(15)].map((_, i) => (
                                            <div
                                                key={i}
                                                className="absolute rounded-full"
                                                style={{
                                                    width: `${3 + (i % 4)}px`,
                                                    height: `${3 + (i % 4)}px`,
                                                    background: `radial-gradient(circle, ${['#60a5fa', '#22d3ee', '#818cf8', '#a78bfa'][i % 4]}, transparent)`,
                                                    top: `${10 + ((i * 17) % 80)}%`,
                                                    left: `${10 + ((i * 23) % 80)}%`,
                                                    boxShadow: `0 0 ${4 + (i % 4)}px ${['#60a5fa', '#22d3ee', '#818cf8'][i % 3]}`
                                                }}
                                            ></div>
                                        ))}

                                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-36 h-36 sm:w-52 sm:h-52 lg:w-72 lg:h-72">
                                            <div className="absolute inset-0 border-2 border-blue-400/10 rounded-full animate-ping opacity-20"></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-48 h-48 sm:w-64 sm:h-64 lg:w-96 lg:h-96 rounded-full border border-white/5 animate-spin-slow">
                                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 lg:w-3 lg:h-3 bg-blue-400/50 rounded-full blur-sm"></div>
                                    </div>
                                    <div className="absolute w-40 h-40 sm:w-56 sm:h-56 lg:w-80 lg:h-80 rounded-full border border-white/3 animate-spin-slow">
                                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-1.5 h-1.5 lg:w-2 lg:h-2 bg-cyan-400/50 rounded-full blur-sm"></div>
                                    </div>
                                </div>

                                <div className="absolute -bottom-18 lg:-bottom-19 left-1/2 transform -translate-x-1/2 w-56 sm:w-64 lg:w-72">
                                    <div className="backdrop-blur-md bg-white/5 rounded-2xl p-3 sm:p-4 lg:p-5 border border-white/10 shadow-2xl">
                                        <div className="flex items-center gap-3 mb-2 lg:mb-3">
                                            <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-linear-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                                                <svg className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93z"/>
                                                </svg>
                                            </div>
                                            <h2 className="text-base lg:text-lg font-bold text-transparent bg-clip-text bg-linear-to-r from-blue-400 via-cyan-300 to-indigo-400">
                                                Aro Ekdin
                                            </h2>
                                        </div>
                                        <p className="text-gray-400 text-[11px] lg:text-xs leading-relaxed">
                                            Join the ultimate volleyball community. Spike, serve, and soar to new heights!
                                        </p>
                                        <div className="flex gap-2 mt-2 lg:mt-3">
                                            <span className="px-2 py-1 text-[10px] bg-blue-500/20 text-blue-300 rounded-full border border-blue-500/20">#Volleyball</span>
                                            <span className="px-2 py-1 text-[10px] bg-cyan-500/20 text-cyan-300 rounded-full border border-cyan-500/20">#Community</span>
                                            <span className="px-2 py-1 text-[10px] bg-indigo-500/20 text-indigo-300 rounded-full border border-indigo-500/20">#Sports</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            
            {/* Footer */}
            <div className="relative p-6 text-center z-10">
                <div className="flex items-center justify-center gap-4 mb-2">
                    <div className="h-px w-12 bg-linear-to-r from-transparent to-white/10"></div>
                    <span className="text-gray-500 text-sm">© {new Date().getFullYear()} Aro Ekdin. All rights reserved.</span>
                    <div className="h-px w-12 bg-linear-to-l from-transparent to-white/10"></div>
                </div>
                <div className="flex items-center justify-center gap-4 text-xs text-gray-600">
                    <Link href="/" className="hover:text-blue-400 transition-colors duration-300">Home</Link>
                    <span>•</span>
                    <Link href="/about" className="hover:text-cyan-300 transition-colors duration-300">About</Link>
                    <span>•</span>
                    <Link href="/matches" className="hover:text-indigo-400 transition-colors duration-300">Matches</Link>
                </div>
            </div>
        </div>
    );
}
