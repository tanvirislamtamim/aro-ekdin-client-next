"use client";

import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { CourtPlayer } from "./courtData";

interface Player3DMarkerProps {
  player: CourtPlayer;
  targetPos: [number, number, number];
  positionIndex: number;
  isSelected: boolean;
  onSelect: (player: CourtPlayer) => void;
}

export const Player3DMarker: React.FC<Player3DMarkerProps> = ({
  player,
  targetPos,
  positionIndex,
  isSelected,
  onSelect,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Smooth lerping to target position
  useFrame((state, delta) => {
    if (groupRef.current) {
      // Lerp position on X, Y, Z
      groupRef.current.position.x = THREE.MathUtils.damp(
        groupRef.current.position.x,
        targetPos[0],
        5,
        delta
      );
      groupRef.current.position.y = THREE.MathUtils.damp(
        groupRef.current.position.y,
        targetPos[1] + (hovered || isSelected ? 0.3 : 0),
        5,
        delta
      );
      groupRef.current.position.z = THREE.MathUtils.damp(
        groupRef.current.position.z,
        targetPos[2],
        5,
        delta
      );
    }

    if (ringRef.current) {
      ringRef.current.rotation.z += delta * (hovered || isSelected ? 2.5 : 0.8);
    }
  });

  const isCaptain = player.role.toLowerCase().includes("captain");
  const isLibero = player.role.toLowerCase().includes("libero");
  const isServer = positionIndex === 1;

  // High-contrast color palette per position
  const POSITION_COLORS: Record<number, { glow: string; text: string; bg: string; badge: string; roleLabel: string }> = {
    1: { glow: "#10b981", text: "#34d399", bg: "#064e3b", badge: "bg-emerald-500 text-slate-950 border-emerald-300", roleLabel: "P1 • SERVER" },
    2: { glow: "#f59e0b", text: "#fbbf24", bg: "#78350f", badge: "bg-amber-500 text-slate-950 border-amber-300", roleLabel: "P2 • RIGHT FRONT" },
    3: { glow: "#06b6d4", text: "#22d3ee", bg: "#164e63", badge: "bg-cyan-400 text-slate-950 border-cyan-200", roleLabel: "P3 • MIDDLE FRONT" },
    4: { glow: "#f43f5e", text: "#fb7185", bg: "#881337", badge: "bg-rose-500 text-white border-rose-300", roleLabel: "P4 • LEFT FRONT" },
    5: { glow: "#a855f7", text: "#c084fc", bg: "#581c87", badge: "bg-purple-500 text-white border-purple-300", roleLabel: "P5 • LEFT BACK" },
    6: { glow: "#3b82f6", text: "#60a5fa", bg: "#1e3a8a", badge: "bg-blue-500 text-white border-blue-300", roleLabel: "P6 • MIDDLE BACK" },
  };

  const currentTheme = POSITION_COLORS[positionIndex] || POSITION_COLORS[1];
  const glowColor = currentTheme.glow;

  return (
    <group
      ref={groupRef}
      position={[targetPos[0], targetPos[1], targetPos[2]]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(player);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "auto";
      }}
    >
      {/* 3D Court Floor Position Ring Indicator */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.02, 0]}
      >
        <ringGeometry args={[0.55, 0.72, 32]} />
        <meshBasicMaterial
          color={glowColor}
          transparent
          opacity={hovered || isSelected ? 0.95 : 0.6}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Rotating Cyber Accent Ring */}
      <mesh
        ref={ringRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.03, 0]}
      >
        <ringGeometry args={[0.76, 0.82, 6]} />
        <meshBasicMaterial
          color={glowColor}
          transparent
          opacity={hovered || isSelected ? 0.9 : 0.4}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Position Number Floor Disc */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.015, 0]}
      >
        <circleGeometry args={[0.52, 32]} />
        <meshBasicMaterial
          color="#020617"
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Cylinder Hologram Light Pillar */}
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.45, 0.55, 1.2, 24, 1, true]} />
        <meshBasicMaterial
          color={glowColor}
          transparent
          opacity={hovered || isSelected ? 0.3 : 0.12}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 2D/3D Interactive Floating Html Avatar & Info Card */}
      <Html
        position={[0, 1.5, 0]}
        center
        distanceFactor={11}
        className="pointer-events-auto select-none touch-manipulation"
        zIndexRange={[100, 0]}
      >
        <div
          onClick={(e) => {
            e.stopPropagation();
            onSelect(player);
          }}
          onTouchEnd={(e) => {
            e.stopPropagation();
            onSelect(player);
          }}
          className={`flex flex-col items-center cursor-pointer transition-all duration-300 ${
            hovered || isSelected ? "scale-105 sm:scale-115 -translate-y-1 sm:-translate-y-2" : "scale-100"
          }`}
        >
          {/* Prominent Top Position Banner - Hidden on mobile */}
          <div
            className={`hidden sm:flex px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-black tracking-wider uppercase shadow-xl mb-1 items-center gap-1 sm:gap-1.5 border-2 ${currentTheme.badge}`}
          >
            <span>{currentTheme.roleLabel}</span>
            {isCaptain && <span className="px-1 bg-black text-amber-300 rounded font-black text-[8px] sm:text-[9px]">C</span>}
            {isLibero && <span className="px-1 bg-black text-emerald-300 rounded font-black text-[8px] sm:text-[9px]">L</span>}
          </div>

          {/* Main Circular Player Avatar with Jersey Badge */}
          <div className="relative group">
            {/* Glowing outer aura */}
            <div
              className={`absolute -inset-1 sm:-inset-2 rounded-full blur-xs sm:blur-md transition-opacity duration-300 ${
                hovered || isSelected ? "opacity-100" : "opacity-60"
              }`}
              style={{ backgroundColor: glowColor }}
            />

            {/* Photo Avatar Ring */}
            <div
              className="relative w-9 h-9 sm:w-16 sm:h-16 rounded-full p-0.5 bg-slate-950 border sm:border-2 shadow-2xl"
              style={{ borderColor: glowColor }}
            >
              <img
                src={player.img}
                alt={player.name}
                className="w-full h-full rounded-full object-cover bg-slate-950"
                loading="eager"
              />

              {/* Jersey Number Floating Badge */}
              <div
                className="absolute -top-1 -right-1 sm:-top-1.5 sm:-right-1.5 w-4 h-4 sm:w-7 sm:h-7 rounded-full bg-slate-950 font-black text-[8px] sm:text-xs flex items-center justify-center border sm:border-2 shadow-lg tracking-tighter text-white"
                style={{ borderColor: glowColor, color: currentTheme.text }}
              >
                {player.jersey}
              </div>
            </div>
          </div>

          {/* Player Name and Role Floating Tag */}
          <div className="mt-0.5 sm:mt-1.5 flex flex-col items-center">
            <div className="px-1.5 sm:px-3 py-0.2 sm:py-0.5 rounded-full bg-slate-950/95 border border-white/20 shadow-2xl flex items-center gap-1">
              <span className="text-white text-[8.5px] sm:text-xs font-bold sm:font-black tracking-tight whitespace-nowrap">
                {player.name}
              </span>
              {isCaptain && <span className="sm:hidden px-1 bg-amber-400 text-black rounded font-black text-[7px] leading-tight">C</span>}
              {isLibero && <span className="sm:hidden px-1 bg-emerald-400 text-black rounded font-black text-[7px] leading-tight">L</span>}
            </div>
            <span
              className="text-[7px] sm:text-[10px] font-bold uppercase tracking-wider px-1.5 sm:px-2.5 py-0.2 sm:py-0.5 rounded-full mt-0.5 backdrop-blur-md whitespace-nowrap bg-slate-900 border"
              style={{
                color: currentTheme.text,
                borderColor: `${glowColor}60`,
              }}
            >
              {player.role}
            </span>
          </div>
        </div>
      </Html>
    </group>
  );
};
