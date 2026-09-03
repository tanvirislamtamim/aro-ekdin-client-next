import { User as FirebaseUser } from "firebase/auth";

export interface Player {
  _id: string;
  name: string;
  position: string;
  img: string;
  jersey?: string | number;
  id?: string | number;
  age?: string | number;
  height?: string;
  weight?: string;
  work?: string;
  Birthdate?: string;
  DominantHand?: string;
  phone?: string;
  facebook?: string;
  instagram?: string;
  whatsapp?: string;
  nationality?: string;
}

export interface PlayerFormData {
  name: string;
  position: string;
  imgFile?: FileList;
  jersey: string;
  id: string;
  age: string;
  height: string;
  weight: string;
  work: string;
  Birthdate: string;
  DominantHand: string;
  phone: string;
  facebook: string;
  instagram: string;
  whatsapp: string;
}

export interface PhotoItem {
  _id: string;
  url: string;
  title: string;
  year: number | string;
  category: "new" | "old" | string;
  public_id?: string;
}

export interface MatchSet {
  setNumber: number;
  teamAScore: number | string;
  teamBScore: number | string;
}

export interface MatchStatPlayer {
  name: string;
  points: number | string;
  spikes: number | string;
  blocks: number | string;
  aces: number | string;
}

export interface MatchTeam {
  name: string;
  logo: string;
  color: string;
}

export interface Match {
  _id: string;
  tournamentName: string;
  matchType: string;
  matchFormat?: string;
  date: string;
  time: string;
  venue: string;
  status: "Live" | "Upcoming" | "Completed" | string;
  notes?: string;
  result?: string;
  manOfTheMatch?: string;
  teamA: MatchTeam;
  teamB: MatchTeam;
  sets: MatchSet[];
  teamAStats?: MatchStatPlayer[];
  teamBStats?: MatchStatPlayer[];
}

export interface CommentItem {
  _id: string;
  playerId: string;
  userEmail: string;
  userName: string;
  userPhoto?: string;
  text: string;
  createdAt: string | Date;
}

export interface UserRoleData {
  role: "user" | "admin" | "developer" | string;
}

export interface UserDocument {
  _id: string;
  email: string;
  name?: string;
  role?: "user" | "admin" | "developer" | string;
  photoURL?: string;
  createdAt?: string | Date;
}

export interface AuthContextType {
  user: FirebaseUser | null;
  loading: boolean;
  createUser: (email: string, password: string) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signInWithGoogle: () => Promise<any>;
  updateProfile: (profileInfo: { displayName?: string; photoURL?: string }) => Promise<any>;
  logOut: () => Promise<void>;
}
