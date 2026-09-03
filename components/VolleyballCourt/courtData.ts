export interface CourtPlayer {
  id: string;
  jersey: string;
  name: string;
  role: string;
  detailedPosition: string;
  img: string;
  stats: {
    spikes: number;
    blocks: number;
    aces: number;
    digs: number;
  };
  bio: string;
  currentPosition: number; // 1 to 6 (Rotational court position)
}

export interface PositionCoord {
  x: number; // lateral (left - to right +)
  y: number; // height (ground level)
  z: number; // depth (net is at z=0, team baseline is at z=9)
  label: string;
  shortLabel: string;
  zone: string;
}

// Standard Volleyball 6-Zone Court Coordinates (in 3D world units: Court is 9m wide x 18m long, half court is 9m x 9m)
// Scale: 1 unit = 1 meter approx. Net is at z=0. Team Aro Ekdin is on z > 0 (front court z=0 to 3, back court z=3 to 9).
export const COURT_POSITIONS: Record<number, PositionCoord> = {
  1: { x: 2.7, y: 0.05, z: 6.5, label: "Position 1 - Right Back", shortLabel: "P1", zone: "Serve / Back Right Defense" },
  2: { x: 2.7, y: 0.05, z: 2.0, label: "Position 2 - Right Front", shortLabel: "P2", zone: "Opposite / Right Net Attack" },
  3: { x: 0.0, y: 0.05, z: 1.8, label: "Position 3 - Middle Front", shortLabel: "P3", zone: "Middle Blocker / Quick Attack" },
  4: { x: -2.7, y: 0.05, z: 2.0, label: "Position 4 - Left Front", shortLabel: "P4", zone: "Outside Hitter / Left Wing Spike" },
  5: { x: -2.7, y: 0.05, z: 6.5, label: "Position 5 - Left Back", shortLabel: "P5", zone: "Libero / Left Back Reception" },
  6: { x: 0.0, y: 0.05, z: 6.8, label: "Position 6 - Middle Back", shortLabel: "P6", zone: "Deep Defense / Pipe Attack" },
};

// Opponent Team Positions (Ghost/Mirror positions on the other side: z < 0)
export const OPPONENT_POSITIONS: Record<number, PositionCoord> = {
  1: { x: -2.7, y: 0.05, z: -6.5, label: "Opponent P1", shortLabel: "OP1", zone: "Opponent Server" },
  2: { x: -2.7, y: 0.05, z: -2.0, label: "Opponent P2", shortLabel: "OP2", zone: "Opponent Right Front" },
  3: { x: 0.0, y: 0.05, z: -1.8, label: "Opponent P3", shortLabel: "OP3", zone: "Opponent Middle" },
  4: { x: 2.7, y: 0.05, z: -2.0, label: "Opponent P4", shortLabel: "OP4", zone: "Opponent Left Front" },
  5: { x: 2.7, y: 0.05, z: -6.5, label: "Opponent P5", shortLabel: "OP5", zone: "Opponent Left Back" },
  6: { x: 0.0, y: 0.05, z: -6.8, label: "Opponent P6", shortLabel: "OP6", zone: "Opponent Middle Back" },
};

// Default Starting 6 Players of "Aro Ekdin" Team
export const DEFAULT_LINEUP_PLAYERS: CourtPlayer[] = [
  {
    id: "6a148da50ae171c728e3a28f",
    jersey: "3",
    name: "Mizba Al Naim",
    role: "Middle Blocker / Captain",
    detailedPosition: "Middle Blocker & Team Leader",
    img: "https://res.cloudinary.com/do8awe7fc/image/upload/q_auto/f_auto/v1777145439/Mizba_ufaruk.png",
    stats: { spikes: 96, blocks: 94, aces: 90, digs: 90 },
    bio: "Visionary captain with devastating spike precision and clutch defensive leadership in high-pressure championship moments.",
    currentPosition: 4, // Starting at Left Front (P4)
  },
  {
    id: "6a148da50ae171c728e3a298",
    jersey: "12",
    name: "S.Sazzad",
    role: "Opposite Hitter",
    detailedPosition: "Power Attacker & Net Presence",
    img: "https://res.cloudinary.com/do8awe7fc/image/upload/q_auto/f_auto/v1777145445/Sajjad_egabvp.png",
    stats: { spikes: 98, blocks: 91, aces: 89, digs: 78 },
    bio: "Unstoppable offensive engine of the team from BKSP with explosive vertical leap and sharp cross-court power hits.",
    currentPosition: 2, // Starting at Right Front (P2)
  },
  {
    id: "6a148da50ae171c728e3a296",
    jersey: "9",
    name: "Rakib Mahmud",
    role: "Libero / Defender",
    detailedPosition: "Iron Defense & Ground Coverage",
    img: "https://res.cloudinary.com/do8awe7fc/image/upload/q_auto/f_auto/v1777145441/Rakib_wbdq0e.png",
    stats: { spikes: 85, blocks: 88, aces: 82, digs: 96 },
    bio: "Most handsome player and dominant defensive specialist with exceptional agility and clutch receptions.",
    currentPosition: 3, // Starting at Middle Front (P3)
  },
  {
    id: "6a148da50ae171c728e3a295",
    jersey: "8",
    name: "Tanvir Islam Tamim",
    role: "Setter (Playmaker)",
    detailedPosition: "Tactical Conductor & Fast Tempo Dispenser",
    img: "https://res.cloudinary.com/do8awe7fc/image/upload/q_auto/f_auto/v1777145446/Tanvir_czxdcb.jpg",
    stats: { spikes: 75, blocks: 82, aces: 95, digs: 88 },
    bio: "Masterful playmaker with deceptive dump attacks, pin-point float serves, and silky sets creating single-block opportunities.",
    currentPosition: 1, // Starting at Right Back / Server (P1)
  },
  {
    id: "6a148da50ae171c728e3a290",
    jersey: "4",
    name: "RA K IB",
    role: "Setter",
    detailedPosition: "Tactical Setter & Transition Anchor",
    img: "https://res.cloudinary.com/do8awe7fc/image/upload/q_auto/f_auto/v1777145442/Rakib2_t03bxk.png",
    stats: { spikes: 78, blocks: 80, aces: 92, digs: 89 },
    bio: "Reliable setter from Bangladesh Army known for disciplined tempo and quick tactical ball distribution.",
    currentPosition: 5, // Starting at Left Back (P5)
  },
  {
    id: "6a148da50ae171c728e3a292",
    jersey: "5",
    name: "Md Shehad",
    role: "Outside Hitter",
    detailedPosition: "Wing Spiker & Pipe Option",
    img: "https://res.cloudinary.com/do8awe7fc/image/upload/q_auto/f_auto/v1777145446/Shehad_tvxges.jpg",
    stats: { spikes: 92, blocks: 84, aces: 87, digs: 91 },
    bio: "Electric dynamic wing spiker possessing supreme stamina, sharp jump serves, and solid 6-rotation backrow presence.",
    currentPosition: 6, // Starting at Middle Back (P6)
  },
];

// Tactical Formations (Positions offset according to strategy)
export type FormationType = "standard" | "serve_receive" | "perimeter_defense";

export const FORMATIONS_MAP: Record<FormationType, Record<number, { x: number; z: number }>> = {
  standard: {
    1: { x: 2.7, z: 6.5 },
    2: { x: 2.7, z: 2.0 },
    3: { x: 0.0, z: 1.8 },
    4: { x: -2.7, z: 2.0 },
    5: { x: -2.7, z: 6.5 },
    6: { x: 0.0, z: 6.8 },
  },
  serve_receive: {
    // Classic 'W' or 3-man pass formation (Setter P1 prepares to penetrate, P4/P5/P6/P2 form reception shield)
    1: { x: 3.2, z: 4.8 }, // Setter ready to sprint to net
    2: { x: 2.2, z: 3.5 }, // Right wing ready for reception / transition
    3: { x: 0.0, z: 1.5 }, // Middle ready at net for quick
    4: { x: -3.0, z: 4.5 }, // Left outside pulled back for pass
    5: { x: -2.0, z: 6.8 }, // Libero holding deep angle
    6: { x: 0.5, z: 6.2 }, // Middle back deep receiver
  },
  perimeter_defense: {
    // Tight defensive stance covering deep corners and tips
    1: { x: 3.4, z: 7.2 }, // Deep line defender
    2: { x: 2.2, z: 1.2 }, // Up at net for block / tip cover
    3: { x: 0.0, z: 1.2 }, // Ready double block
    4: { x: -2.2, z: 1.2 }, // Left blocker
    5: { x: -3.4, z: 7.2 }, // Deep cross defender
    6: { x: 0.0, z: 5.5 }, // Shallow tip / campfire cover
  },
};

// =========================================================================
// 🔄 FIVB OFFICIAL ROTATION HELPERS (Rule 7.6.2)
// Clockwise Rotation when receiving team gains serve:
// Pos 2 -> Pos 1 (to serve)
// Pos 1 -> Pos 6
// Pos 6 -> Pos 5
// Pos 5 -> Pos 4
// Pos 4 -> Pos 3
// Pos 3 -> Pos 2
// =========================================================================

export function rotateClockwise(playersList: CourtPlayer[]): CourtPlayer[] {
  return playersList.map((p) => {
    let nextPos = 1;
    if (p.currentPosition === 1) nextPos = 6;
    else if (p.currentPosition === 6) nextPos = 5;
    else if (p.currentPosition === 5) nextPos = 4;
    else if (p.currentPosition === 4) nextPos = 3;
    else if (p.currentPosition === 3) nextPos = 2;
    else if (p.currentPosition === 2) nextPos = 1;
    return { ...p, currentPosition: nextPos };
  });
}

export function rotateCounterClockwise(playersList: CourtPlayer[]): CourtPlayer[] {
  return playersList.map((p) => {
    let nextPos = 1;
    if (p.currentPosition === 6) nextPos = 1;
    else if (p.currentPosition === 5) nextPos = 6;
    else if (p.currentPosition === 4) nextPos = 5;
    else if (p.currentPosition === 3) nextPos = 4;
    else if (p.currentPosition === 2) nextPos = 3;
    else if (p.currentPosition === 1) nextPos = 2;
    return { ...p, currentPosition: nextPos };
  });
}

// FIVB 2025-2028 Official Court Specifications
export const FIVB_COURT_SPECS = {
  courtWidth: 9, // meters
  courtLength: 18, // meters
  halfCourtLength: 9, // meters
  frontZoneLength: 3, // meters (from axis of centre line)
  backZoneLength: 6, // meters
  lineWidth: 0.05, // 5 cm
  attackLineExtension: 1.75, // meters (5 broken lines 15cm with 20cm gaps)
  serviceZoneWidth: 9, // meters behind endline
  serviceTickLength: 0.15, // 15 cm
  serviceTickOffset: 0.20, // 20 cm behind end line
  netHeightMen: 2.43, // meters
  netHeightWomen: 2.24, // meters
  netLength: 9.5, // meters (up to 10m)
  netWidth: 1.0, // meter
  antennaLength: 1.80, // meters (80cm extends above net)
  postDistance: 1.0, // meters outside sideline
  freeZoneMinSide: 3.0, // meters (5m for FIVB World/Official)
  freeZoneMinEnd: 3.0, // meters (6.5m for FIVB World/Official)
};

// Official Rules Breakdown for Interactive Modal/Drawer
export const FIVB_RULES_GUIDE = [
  {
    id: "dimensions",
    title: "1. Playing Area & Court Dimensions (Rule 1 & Diagrams D1a, D1b, D2)",
    bengaliTitle: "১. কোর্টের পরিমাপ ও জোন",
    points: [
      "The playing court is an 18 x 9 m rectangle divided equally into two 9 x 9 m courts by the centre line.",
      "Attack line is drawn 3 m back from the centre line to mark the Front Zone (3 m) and Back Zone (6 m).",
      "Attack line extends 1.75 m beyond sidelines with 5 broken lines of 15 cm each spaced 20 cm apart.",
      "Service zone is 9 m wide behind each end line, laterally marked with 15 cm short lines 20 cm behind the line.",
      "Net height: 2.43 m for men and 2.24 m for women, measured at the center of the court.",
      "Antennae: 1.80 m flexible rods; top 80 cm extends above the net with 10 cm contrasting red and white stripes."
    ]
  },
  {
    id: "rotation",
    title: "2. Rotation & Service Order (Rule 7.6 & 12.2)",
    bengaliTitle: "২. রোটেশন ও সার্ভিস ক্রম",
    points: [
      "6 players per team on the court: Front-row (Pos 4, 3, 2) and Back-row (Pos 5, 6, 1).",
      "When the receiving team wins a rally, it gains a point and the right to serve, and its players rotate one position CLOCKWISE.",
      "Player in Position 2 rotates to Position 1 to serve.",
      "Player 1 rotates to 6, 6 to 5, 5 to 4, 4 to 3, 3 to 2.",
      "Rotational order recorded on the score sheet must be maintained throughout the entire set."
    ]
  },
  {
    id: "positions",
    title: "3. Positional Rules & Faults (Rule 7.4, 7.5 & Diagram D4)",
    bengaliTitle: "৩. পজিশনাল নিয়ম ও ফাউল",
    points: [
      "At the moment the ball is hit by the server, each team must be in its rotational order.",
      "Each back-row player must have at least part of one foot further from the centre line than the front foot of the corresponding front-row player (P1 behind P2, P6 behind P3, P5 behind P4).",
      "Lateral positions: Right player (P2, P1) must be closer to right sideline than Center player (P3, P6), and Left player (P4, P5) closer to left sideline than Center player.",
      "After the service hit, players are free to move anywhere on the court and free zone to execute tactical attacks and defenses."
    ]
  },
  {
    id: "libero",
    title: "4. The Libero Player (Rule 19)",
    bengaliTitle: "৪. লিবেরো স্পেশালিস্ট নিয়ম",
    points: [
      "The Libero is a defensive specialist who must wear a contrasting colored uniform.",
      "Allowed to replace any back-row player; Libero replacements do not count as regular substitutions.",
      "The Libero may not serve, block, or attempt to block.",
      "Cannot complete an attack hit from anywhere if the ball is entirely above net height at contact.",
      "If the Libero overhand sets the ball from inside the front zone, a teammate cannot attack the ball from above net height."
    ]
  },
  {
    id: "scoring",
    title: "5. Scoring & Match Winning (Rule 6)",
    bengaliTitle: "৫. পয়েন্ট ও ম্যাচ জেতার নিয়ম",
    points: [
      "Rally Point System: The team winning each rally scores a point.",
      "Sets 1 to 4 are won by the first team to reach 25 points with at least a 2-point lead (e.g. 25-23, 26-24).",
      "Deciding 5th set is played to 15 points with a minimum 2-point lead.",
      "A match is won by the team that wins 3 sets (best of 5 sets)."
    ]
  }
];
