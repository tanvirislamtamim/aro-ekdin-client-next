"use client";

import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = () => {
  const brandColor = "#CAEB66"; // lime-green color

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0a0a] overflow-hidden">
      {/* Volleyball Section Container */}
      <div className="relative w-96 h-96 flex items-center justify-center">
        {/* Animated Glow Background */}
        <motion.div 
          className="absolute inset-10 bg-linear-to-br from-blue-600/20 via-cyan-500/15 to-indigo-600/20 rounded-full blur-3xl"
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Floating Light Orbs */}
        <motion.div 
          className="absolute top-[15%] left-[20%] w-36 h-36 bg-blue-500/10 rounded-full blur-3xl"
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-[20%] right-[15%] w-44 h-44 bg-cyan-500/10 rounded-full blur-3xl"
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Decorative Orbit Rings */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div 
            className="w-80 h-80 rounded-full border border-white/5 relative"
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-blue-400/40 rounded-full blur-xs"></div>
          </motion.div>
          
          <motion.div 
            className="absolute w-64 h-64 rounded-full border border-white/5 relative"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-cyan-400/40 rounded-full blur-xs"></div>
          </motion.div>
        </div>

        {/* Main Volleyball Container with Bouncing Effect */}
        <motion.div 
          className="relative w-48 h-48 z-10 flex items-center justify-center"
          animate={{ y: [0, -25, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Rotating Volleyball Image */}
          <motion.div 
            className="relative w-40 h-40"
            animate={{ rotate: 360 }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          >
            <img 
              src="https://pngimg.com/uploads/volleyball/volleyball_PNG39.png" 
              alt="Realistic Volleyball"
              className="w-full h-full object-contain"
              style={{
                filter: 'drop-shadow(0 15px 15px rgba(0,0,0,0.6)) drop-shadow(0 0 30px rgba(59,130,246,0.25))',
              }}
            />
            
            {/* Additional Glow Effect Behind Ball */}
            <div className="absolute inset-0 bg-linear-to-br from-blue-400/10 via-transparent to-indigo-400/10 rounded-full blur-xl -z-10"></div>
          </motion.div>

          {/* Dynamic Shadow */}
          <motion.div 
            className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-24 h-3 bg-black/60 rounded-full blur-md -z-10"
            animate={{ scaleX: [1, 0.7, 1], opacity: [0.6, 0.3, 0.6] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Floating Particles Around Ball */}
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: `${3 + (i % 3)}px`,
                height: `${3 + (i % 3)}px`,
                background: `radial-gradient(circle, ${['#60a5fa', '#22d3ee', '#818cf8'][i % 3]}, transparent)`,
                top: `${20 + (i * 7) % 60}%`,
                left: `${20 + (i * 11) % 60}%`,
                boxShadow: `0 0 6px ${['#60a5fa', '#22d3ee'][i % 2]}`
              }}
              animate={{
                y: [0, -15 - (i % 5) * 5, 0],
                opacity: [0.2, 0.8, 0.2]
              }}
              transition={{
                duration: 2 + (i % 3),
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.2
              }}
            />
          ))}
        </motion.div>
      </div>

      {/* Loading Text */}
      <motion.h2
        className="mt-4 text-xl font-bold tracking-[0.2em] uppercase"
        style={{ color: brandColor }}
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        Loading
      </motion.h2>

      {/* Bottom Progress Bar */}
      <div className="w-48 h-1 mt-4 overflow-hidden bg-gray-800 rounded-full">
        <motion.div
          className="h-full"
          style={{ backgroundColor: brandColor }}
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
      </div>
    </div>
  );
};

export default LoadingSpinner;
