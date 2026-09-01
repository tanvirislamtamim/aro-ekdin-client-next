"use client";

import React, { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Float } from "@react-three/drei";
import * as THREE from "three";
import { CourtPlayer, FORMATIONS_MAP, FormationType, OPPONENT_POSITIONS } from "./courtData";
import { Player3DMarker } from "./Player3DMarker";

export type CameraPreset = "orbit" | "topdown" | "spike" | "server";

interface VolleyballCourtSceneProps {
  players: CourtPlayer[];
  formation: FormationType;
  selectedPlayer: CourtPlayer | null;
  onSelectPlayer: (player: CourtPlayer) => void;
  showOpponent: boolean;
  cameraPreset: CameraPreset;
  netHeight?: "men" | "women";
}

// Net Mesh Texture

// Procedural Net Mesh Texture
function createNetTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.clearRect(0, 0, 128, 128);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.75)";
    ctx.lineWidth = 3;
    // Grid pattern
    for (let i = 0; i <= 128; i += 16) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 128);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(128, i);
      ctx.stroke();
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(36, 4);
  return texture;
}

// Antenna striped texture (10cm alternating red and white stripes)
function createAntennaTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 32;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    for (let i = 0; i < 256; i += 32) {
      ctx.fillStyle = (i / 32) % 2 === 0 ? "#ef4444" : "#ffffff";
      ctx.fillRect(0, i, 32, 32);
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// Camera Manager for smooth view transitions
function CameraController({ preset }: { preset: CameraPreset }) {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);

  const targetCoords = useMemo(() => {
    switch (preset) {
      case "topdown":
        return { pos: new THREE.Vector3(0, 22, 0.1), target: new THREE.Vector3(0, 0, 0) };
      case "spike":
        return { pos: new THREE.Vector3(0, 4.5, -6), target: new THREE.Vector3(0, 1.8, 3) };
      case "server":
        return { pos: new THREE.Vector3(0, 5.5, 15), target: new THREE.Vector3(0, 1.2, 0) };
      case "orbit":
      default:
        return { pos: new THREE.Vector3(12, 11, 17), target: new THREE.Vector3(0, 0.5, 2) };
    }
  }, [preset]);

  useFrame((_, delta) => {
    camera.position.lerp(targetCoords.pos, delta * 3);
    if (controlsRef.current) {
      controlsRef.current.target.lerp(targetCoords.target, delta * 3);
      controlsRef.current.update();
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.06}
      maxPolarAngle={Math.PI / 2 - 0.05} // Don't allow camera to go underground
      minDistance={4}
      maxDistance={32}
    />
  );
}

export const VolleyballCourtScene: React.FC<VolleyballCourtSceneProps> = ({
  players,
  formation,
  selectedPlayer,
  onSelectPlayer,
  showOpponent,
  cameraPreset,
  netHeight = "men",
}) => {
  const netTexture = useMemo(() => createNetTexture(), []);
  const ballTexture = useMemo(() => {
    if (typeof window === "undefined") return null;
    const loader = new THREE.TextureLoader();
    const tex = loader.load("/volleyball-ball.png");
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);
  const antennaTexture = useMemo(() => createAntennaTexture(), []);

  // Compute 3D target coordinates for each player based on current rotational position & formation
  const formationOffsets = FORMATIONS_MAP[formation];

  // Net height: 2.43m (Men) / 2.24m (Women)
  const actualNetHeight = netHeight === "women" ? 2.24 : 2.43;
  const netCenterY = actualNetHeight - 0.5; // Net is 1m high, center is height - 0.5m

  return (
    <>
      <CameraController preset={cameraPreset} />

      {/* Enhanced Lighting System — Stadium Atmosphere */}
      <ambientLight intensity={0.45} color="#c8d8f0" />
      {/* Main overhead key light */}
      <directionalLight
        position={[8, 18, 8]}
        intensity={1.4}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={60}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
        color="#ffffff"
      />
      <directionalLight position={[-8, 14, -8]} intensity={0.6} color="#dde8ff" />
      {/* 4 corner stadium floodlights */}
      <spotLight position={[-9, 16, 12]}  intensity={2.2} angle={0.45} penumbra={0.6} color="#e0f0ff" castShadow={false} />
      <spotLight position={[ 9, 16, 12]}  intensity={2.2} angle={0.45} penumbra={0.6} color="#e0f0ff" castShadow={false} />
      <spotLight position={[-9, 16, -12]} intensity={2.2} angle={0.45} penumbra={0.6} color="#e0f0ff" castShadow={false} />
      <spotLight position={[ 9, 16, -12]} intensity={2.2} angle={0.45} penumbra={0.6} color="#e0f0ff" castShadow={false} />
      {/* Cyan accent glow from under the net */}
      <pointLight position={[0, 2.8, 0]}  intensity={1.2} color="#06b6d4" distance={8} />
      {/* Warm team side fill */}
      <pointLight position={[0, 4, 9]}    intensity={0.6} color="#22d3ee" distance={12} />
      <pointLight position={[0, 4, -9]}   intensity={0.5} color="#f43f5e" distance={10} />

      {/* 3D ARENA & COURT GEOMETRY */}
      <group position={[0, 0, 0]}>
        {/* ─── STADIUM BLEACHERS (4 sides) ─── */}
        {/* Long side stands (along Z axis, left and right of court) */}
        {([-1, 1] as const).map((side) => (
          <group key={`stand-side-${side}`} position={[side * 12, 0, 0]}>
            {[0, 1, 2, 3].map((row) => (
              <mesh key={row} position={[side * row * 0.6, row * 1.1, 0]} receiveShadow>
                <boxGeometry args={[1.4, 0.28, 26]} />
                <meshStandardMaterial
                  color={row % 2 === 0 ? "#0f172a" : "#0c1524"}
                  roughness={0.85}
                  metalness={0.05}
                />
              </mesh>
            ))}
            {/* Railing */}
            <mesh position={[side * 2.5, 4.8, 0]}>
              <boxGeometry args={[0.06, 0.5, 26]} />
              <meshStandardMaterial color="#1e40af" metalness={0.8} roughness={0.2} />
            </mesh>
            {/* Colored seat blocks for visual interest */}
            {[-10, -6, -2, 2, 6, 10].map((zOff, i) => (
              <mesh key={`seat-${i}`} position={[side * 0.4, 1.25, zOff]}>
                <boxGeometry args={[1.0, 0.18, 3.2]} />
                <meshStandardMaterial
                  color={i % 3 === 0 ? "#1d4ed8" : i % 3 === 1 ? "#0e7490" : "#1e3a8a"}
                  roughness={0.7}
                />
              </mesh>
            ))}
          </group>
        ))}

        {/* End stands (along X axis, behind team & opponent baselines) */}
        {([-1, 1] as const).map((side) => (
          <group key={`stand-end-${side}`} position={[0, 0, side * 14]}>
            {[0, 1, 2].map((row) => (
              <mesh key={row} position={[0, row * 1.0, side * row * 0.55]} receiveShadow>
                <boxGeometry args={[22, 0.26, 1.2]} />
                <meshStandardMaterial
                  color={row % 2 === 0 ? "#0f172a" : "#0c1524"}
                  roughness={0.85}
                />
              </mesh>
            ))}
            {/* Colored seats */}
            {[-8, -4, 0, 4, 8].map((xOff, i) => (
              <mesh key={`eseat-${i}`} position={[xOff, 1.12, side * 0.5]}>
                <boxGeometry args={[3.5, 0.16, 1.0]} />
                <meshStandardMaterial
                  color={i % 2 === 0 ? "#1e3a8a" : "#0e7490"}
                  roughness={0.7}
                />
              </mesh>
            ))}
          </group>
        ))}

        {/* Stadium floor / arena base */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.15, 0]} receiveShadow>
          <planeGeometry args={[32, 40]} />
          <meshStandardMaterial color="#060d1a" roughness={0.9} metalness={0.0} />
        </mesh>

        {/* 1. Surrounding Free Zone Floor (Navy / Royal Blue Surrounding) */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
          <planeGeometry args={[22, 30]} />
          <meshStandardMaterial
            color="#0b1a3a"
            roughness={0.5}
            metalness={0.15}
          />
        </mesh>

        {/* Free Zone Boundary glow line */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <planeGeometry args={[19, 28]} />
          <meshBasicMaterial color="#1e3a8a" wireframe transparent opacity={0.18} />
        </mesh>

        {/* 2. Main Playing Court (9m x 18m) — glossy resin finish */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]} receiveShadow castShadow>
          <planeGeometry args={[9, 18]} />
          <meshStandardMaterial
            color="#c96820"
            roughness={0.28}
            metalness={0.08}
            envMapIntensity={0.6}
          />
        </mesh>

        {/* 3. Official FIVB Lines & Markings (5cm / 0.05m width standard) */}
        <group position={[0, 0.01, 0]}>
          {/* Side lines (Left x=-4.5 & Right x=4.5) */}
          <mesh position={[-4.5, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.06, 18]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <mesh position={[4.5, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.06, 18]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>

          {/* End lines (Baselines: Team z=9, Opponent z=-9) */}
          <mesh position={[0, 0, 9]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[9, 0.06]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <mesh position={[0, 0, -9]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[9, 0.06]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>

          {/* Centre Line under the net (z = 0) */}
          <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[9, 0.08]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>

          {/* Attack Lines / 3-Meter Lines (Team side z=3, Opponent side z=-3) */}
          <mesh position={[0, 0, 3]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[9, 0.06]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <mesh position={[0, 0, -3]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[9, 0.06]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>

          {/* 🎯 FIVB Rule 1.3.4 & Diagram D2: 5 Broken Lines (15cm x 5cm, 20cm apart) extending 1.75m from sidelines */}
          {[-1, 1].map((sideZ) => {
            const zPos = sideZ * 3; // Attack line at z=3 and z=-3
            return (
              <React.Fragment key={`attack-ext-${sideZ}`}>
                {/* Left sideline extension (x = -4.5 to -6.25) */}
                {[0, 1, 2, 3, 4].map((i) => (
                  <mesh
                    key={`l-ext-${sideZ}-${i}`}
                    position={[-4.5 - 0.2 - i * 0.35 - 0.075, 0, zPos]}
                    rotation={[-Math.PI / 2, 0, 0]}
                  >
                    <planeGeometry args={[0.15, 0.05]} />
                    <meshBasicMaterial color="#ffffff" />
                  </mesh>
                ))}
                {/* Right sideline extension (x = 4.5 to 6.25) */}
                {[0, 1, 2, 3, 4].map((i) => (
                  <mesh
                    key={`r-ext-${sideZ}-${i}`}
                    position={[4.5 + 0.2 + i * 0.35 + 0.075, 0, zPos]}
                    rotation={[-Math.PI / 2, 0, 0]}
                  >
                    <planeGeometry args={[0.15, 0.05]} />
                    <meshBasicMaterial color="#ffffff" />
                  </mesh>
                ))}
              </React.Fragment>
            );
          })}

          {/* 🎯 FIVB Rule 1.4.2 & Diagram D2: Service Zone lateral tick marks (15cm long, 20cm behind baseline) */}
          {/* Team Service Zone Ticks (z = 9.20m to 9.35m) */}
          <mesh position={[-4.5, 0, 9.275]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.05, 0.15]} />
            <meshBasicMaterial color="#22c55e" />
          </mesh>
          <mesh position={[4.5, 0, 9.275]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.05, 0.15]} />
            <meshBasicMaterial color="#22c55e" />
          </mesh>

          {/* Opponent Service Zone Ticks (z = -9.20m to -9.35m) */}
          <mesh position={[-4.5, 0, -9.275]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.05, 0.15]} />
            <meshBasicMaterial color="#ef4444" />
          </mesh>
          <mesh position={[4.5, 0, -9.275]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.05, 0.15]} />
            <meshBasicMaterial color="#ef4444" />
          </mesh>
        </group>

        {/* 4. NET SYSTEM & POSTS (FIVB Rule 2 & Diagram D3) */}
        <group position={[0, 0, 0]}>
          {/* Metallic Net Posts (1m outside sideline at x = -5.5 and 5.5, height 2.55m) */}
          <mesh position={[-5.5, 1.28, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 2.55, 16]} />
            <meshStandardMaterial color="#0284c7" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[5.5, 1.28, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 2.55, 16]} />
            <meshStandardMaterial color="#0284c7" metalness={0.9} roughness={0.2} />
          </mesh>

          {/* Protective Post Padding (FIVB Rule 2.5.1) */}
          <mesh position={[-5.5, 0.8, 0]}>
            <cylinderGeometry args={[0.16, 0.16, 1.6, 16]} />
            <meshStandardMaterial color="#0369a1" roughness={0.5} />
          </mesh>
          <mesh position={[5.5, 0.8, 0]}>
            <cylinderGeometry args={[0.16, 0.16, 1.6, 16]} />
            <meshStandardMaterial color="#0369a1" roughness={0.5} />
          </mesh>

          {/* Net Mesh (1m height centered at netCenterY) */}
          <mesh position={[0, netCenterY, 0]}>
            <planeGeometry args={[9.5, 1]} />
            <meshStandardMaterial
              map={netTexture}
              transparent
              opacity={0.85}
              side={THREE.DoubleSide}
              roughness={0.5}
            />
          </mesh>

          {/* Net Top White Band (7cm wide canvas at actualNetHeight) */}
          <mesh position={[0, actualNetHeight + 0.035, 0]}>
            <boxGeometry args={[9.6, 0.07, 0.04]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.3} />
          </mesh>

          {/* Net Bottom White Band (5cm wide at actualNetHeight - 1m) */}
          <mesh position={[0, actualNetHeight - 0.975, 0]}>
            <boxGeometry args={[9.6, 0.05, 0.04]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.3} />
          </mesh>

          {/* Side Bands (5cm wide placed vertically directly above sidelines at x=-4.5 and x=4.5) */}
          <mesh position={[-4.5, netCenterY, 0]}>
            <boxGeometry args={[0.05, 1.0, 0.02]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
          <mesh position={[4.5, netCenterY, 0]}>
            <boxGeometry args={[0.05, 1.0, 0.02]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>

          {/* Aerial Antennas (Rule 2.4: 1.80m rod, top 80cm above net with 10cm red/white stripes) */}
          {/* Left Antenna at outer edge of side band x = -4.5 */}
          <mesh position={[-4.5, actualNetHeight - 0.1, 0]}>
            <cylinderGeometry args={[0.012, 0.012, 1.8, 8]} />
            <meshStandardMaterial map={antennaTexture} />
          </mesh>
          {/* Right Antenna at outer edge of side band x = 4.5 */}
          <mesh position={[4.5, actualNetHeight - 0.1, 0]}>
            <cylinderGeometry args={[0.012, 0.012, 1.8, 8]} />
            <meshStandardMaterial map={antennaTexture} />
          </mesh>

          {/* 🎯 1st Referee Chair / Stand (Opposite to scorer, height 50cm above net at x = -6.2) */}
          <group position={[-6.2, 0, 0]}>
            {/* Ladder Frame */}
            <mesh position={[0, 1.3, 0]}>
              <cylinderGeometry args={[0.04, 0.04, 2.6, 8]} />
              <meshStandardMaterial color="#475569" metalness={0.7} />
            </mesh>
            {/* Referee Platform (eye-level 50cm above net) */}
            <mesh position={[0.3, actualNetHeight + 0.3, 0]}>
              <boxGeometry args={[0.7, 0.08, 0.7]} />
              <meshStandardMaterial color="#0284c7" />
            </mesh>
            {/* Referee Stand Shield */}
            <mesh position={[0.3, actualNetHeight + 0.65, 0.35]}>
              <boxGeometry args={[0.7, 0.6, 0.04]} />
              <meshStandardMaterial color="#0369a1" />
            </mesh>
          </group>

          {/* 🎯 Scorer's Table & Substitution Zone Structure (On Right side x = 6.2) */}
          <group position={[6.2, 0, 0]}>
            <mesh position={[0, 0.45, 0]}>
              <boxGeometry args={[0.8, 0.9, 2.4]} />
              <meshStandardMaterial color="#1e293b" metalness={0.5} roughness={0.4} />
            </mesh>
            {/* Scorer Screen */}
            <mesh position={[-0.2, 0.95, 0]}>
              <boxGeometry args={[0.05, 0.3, 0.5]} />
              <meshStandardMaterial color="#06b6d4" />
            </mesh>
          </group>
        </group>

        {/* 5. 3D VOLLEYBALL (Realistic Ball matching Login Form animated above the Net) */}
        <Float speed={2.2} rotationIntensity={2} floatIntensity={0.9}>
          <group position={[1.2, 2.7, 0.5]}>
            <mesh castShadow receiveShadow>
              <sphereGeometry args={[0.24, 64, 64]} />
              <meshStandardMaterial
                map={ballTexture || undefined}
                color={ballTexture ? "#ffffff" : "#fbbf24"}
                roughness={0.35}
                metalness={0.05}
              />
            </mesh>
            {/* Ball Glow Ring */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
              <ringGeometry args={[0.26, 0.32, 32]} />
              <meshBasicMaterial color="#38bdf8" transparent opacity={0.5} side={THREE.DoubleSide} />
            </mesh>
          </group>
        </Float>

        {/* 6. TEAM ARO EKDIN PLAYERS (6 Positions) */}
        {players.map((player) => {
          const posIdx = player.currentPosition;
          const coord = formationOffsets[posIdx] || { x: 0, z: 4.5 };
          const targetPos: [number, number, number] = [coord.x, 0.05, coord.z];

          return (
            <Player3DMarker
              key={player.id}
              player={player}
              targetPos={targetPos}
              positionIndex={posIdx}
              isSelected={selectedPlayer?.id === player.id}
              onSelect={onSelectPlayer}
            />
          );
        })}

        {/* 7. OPPONENT TEAM (Ghost / Hologram Markers when enabled) */}
        {showOpponent && (
          <group>
            {Object.entries(OPPONENT_POSITIONS).map(([posStr, posCoord]) => {
              const posNumber = parseInt(posStr, 10);
              return (
                <group key={`opp-${posNumber}`} position={[posCoord.x, 0.05, posCoord.z]}>
                  {/* Opponent Floor Disc */}
                  <mesh rotation={[-Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[0.45, 0.55, 24]} />
                    <meshBasicMaterial color="#f43f5e" transparent opacity={0.4} side={THREE.DoubleSide} />
                  </mesh>
                  {/* Opponent Ghost Marker */}
                  <mesh position={[0, 0.8, 0]}>
                    <cylinderGeometry args={[0.3, 0.38, 1.4, 16, 1, true]} />
                    <meshBasicMaterial color="#f43f5e" transparent opacity={0.1} side={THREE.DoubleSide} />
                  </mesh>
                </group>
              );
            })}
          </group>
        )}
      </group>
    </>
  );
};
