"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NotFound({
  code = 404,
  title = "Page Not Found",
  message = "The page you are looking for might have been removed or is temporarily unavailable."
}: {
  code?: number;
  title?: string;
  message?: string;
}) {
  const router = useRouter();

  return (
    <div className="min-h-screen w-full bg-linear-to-br from-[#0a0f1e] via-[#03050b] to-black flex items-center justify-center p-6 relative overflow-hidden font-sans">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 50 50%22 width=%2250%22 height=%2250%22%3E%3Cpath fill=%22none%22 stroke=%22rgba(56,123,255,0.08)%22 stroke-width=%221%22 d=%22M0 0h50v50H0z%22/%3E%3C/svg%3E')] bg-repeat opacity-30 pointer-events-none"></div>
      
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[80px] -z-10"></div>
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-indigo-500/15 rounded-full blur-[70px] -z-10"></div>

      <div className="relative max-w-2xl w-full bg-black/40 backdrop-blur-xl rounded-3xl border border-blue-500/30 shadow-2xl p-8 md:p-12 text-center transition-all duration-300 hover:border-blue-400/60 hover:scale-[1.01]">
        <div className="flex justify-center items-center gap-1 md:gap-2 mb-6">
          <span className="text-7xl md:text-9xl font-black bg-linear-to-b from-slate-200 to-slate-500 bg-clip-text text-transparent">
            {String(code)[0]}
          </span>
          <div className="w-20 h-20 md:w-32 md:h-32 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full text-blue-400 drop-shadow-[0_0_8px_rgba(14,165,233,0.6)] animate-[spin_3s_ease-in-out_infinite]" style={{ willChange: "transform", transform: "translateZ(0)", backfaceVisibility: "hidden" }}>
              <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="5" fill="none" strokeDasharray="10 5" />
            </svg>
          </div>
          <span className="text-7xl md:text-9xl font-black bg-linear-to-b from-slate-200 to-slate-500 bg-clip-text text-transparent">
            {String(code)[2] || String(code)[1]}
          </span>
        </div>

        <h1 className="text-2xl md:text-4xl font-bold bg-linear-to-r from-white to-blue-200 bg-clip-text text-transparent mb-4">
          {title}
        </h1>
        <p className="text-gray-300 text-base md:text-lg max-w-md mx-auto mb-8">
          {message}
        </p>

        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <Link 
            href="/" 
            className="px-6 py-3 bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 rounded-full font-semibold text-white shadow-lg shadow-blue-500/30 transition-all duration-200 hover:-translate-y-1 flex items-center gap-2 cursor-pointer"
          >
            🏠 Home
          </Link>
          <button 
            onClick={() => router.back()} 
            className="px-6 py-3 bg-gray-800/80 hover:bg-gray-700/90 rounded-full font-semibold text-gray-200 border border-gray-700 transition-all duration-200 hover:-translate-y-1 flex items-center gap-2 backdrop-blur-sm cursor-pointer"
          >
            ◀ Previous Page
          </button>
        </div>

        <div className="flex flex-wrap justify-center gap-4 text-xs md:text-sm text-gray-400 border-t border-gray-700/50 pt-6">
          <span className="bg-black/30 px-3 py-1 rounded-full">🔍 URL is it correct?</span>
          <span className="bg-black/30 px-3 py-1 rounded-full">📧 If you have any issues, please contact support</span>
        </div>
      </div>
    </div>
  );
}
