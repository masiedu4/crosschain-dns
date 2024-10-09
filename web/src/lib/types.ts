import { Address } from "viem";

export interface InspectOutput {
  status?: string;
  exception_payload?: null | string;
  reports?: any[];
  processed_input_count?: number;
}

export interface GameData {
  type: string;
  game_id: number;
  scrambled_letters: string;
  timestamp: number;
  duration: number;
  is_ended: boolean;
  words_won: string[];
  bonus_words_won: string[];
  points_earned: number;
  bonus_points_earned: number;
  is_staked: boolean;
}

export interface GameResult extends GameData {
  words_submitted: string[];
  original_words: string[];

  additional_possible_words_count: number;
}

export interface UserProfileStore {
  address: Address | null;
  profile: PlayerProfile | null;
  isLoading: boolean;
  error: string | null;
  usdcBalance: string;
  fetchProfile: (address: Address) => Promise<void>;
  resetProfile: () => void;
  getProcessedGameHistory: () => ProcessedGameRecord[];
  getWithdrawals: () => Transaction[];
  getEarnings: () => Transaction[];
}

export interface LeaderboardEntry {
  address: string;
  gamesPlayed: number;
  totalPoints: number;
  lastGamePoints: number;
}

export interface RankedLeaderboardEntry extends LeaderboardEntry {
  rank: number;
}

export interface ProcessedGameRecord {
  timestamp: number;
  total_points: number;
  is_staked: boolean;
}

interface Transaction {
  timestamp: number;
  amount: number;
}

export interface PlayerProfile {
  gameHistory: GameData[];
  withdrawals: Transaction[];
  earnings: Transaction[];
}
