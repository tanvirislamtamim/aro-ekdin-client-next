"use client";

import React from "react";
import { motion } from "framer-motion";
import { Bot } from "lucide-react";

interface AroFloatingButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

export const AroFloatingButton: React.FC<AroFloatingButtonProps> = ({
  isOpen,
  onClick,
}) => {
  return (
    <div className="fixed bottom-28 sm:bottom-8 right-4 sm:right-8 z-50 flex items-center">
      {/* Main Floating Trigger */}
      <motion.button
        id="aro-ai-trigger-btn"
        aria-label="Open Aro AI Assistant"
        onClick={onClick}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        className="relative group w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center cursor-pointer shadow-2xl transition-all duration-300"
      >
        {/* Animated Glow Rings */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 opacity-80 blur-md group-hover:opacity-100 group-hover:blur-lg transition-all duration-500 animate-pulse" />

        {/* Center Button Body */}
        <div className="relative w-full h-full rounded-full bg-gradient-to-br from-[#0f172a] via-[#020617] to-[#030712] border-2 border-cyan-400/60 flex items-center justify-center p-2.5 sm:p-3 text-cyan-300 group-hover:border-cyan-300 group-hover:text-white transition-colors overflow-hidden">
          {/* Subtle Background Radial */}
          <div className="absolute inset-0 bg-radial from-cyan-500/20 to-transparent" />

          {/* Icon */}
          <div className="relative flex items-center justify-center">
            <Bot className="w-6 h-6 sm:w-7 sm:h-7 text-cyan-400 group-hover:text-cyan-200 transition-colors" />
            <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-emerald-400 ring-2 ring-black animate-pulse" />
          </div>
        </div>
      </motion.button>
    </div>
  );
};

export default AroFloatingButton;
