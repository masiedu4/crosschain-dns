import { create } from "zustand";
import { Address } from "viem";
import {
  UserProfileStore,
  ProcessedGameRecord,
  GameData,
} from "../lib/types";
import { fetchLatestGameHistory } from "@/data/query";

const processGameHistory = (gameHistory: GameData[]): ProcessedGameRecord[] => {
  return gameHistory
    .map((game) => ({
      timestamp: game.timestamp,
      total_points: game.points_earned + game.bonus_points_earned,
    }))
    .sort((a, b) => b.timestamp - a.timestamp);
};

export const useUserProfileStore = create<UserProfileStore>((set, get) => ({
  address: null,
  profile: null,
  isLoading: false,
  error: null,
  fetchProfile: async (address: Address) => {
    set({ isLoading: true, error: null });
    try {
      const gameHistory = await fetchLatestGameHistory(address);

      if (gameHistory === null) {
        // Instead of throwing an error, we'll set an empty game history
        set({
          profile: { gameHistory: [] },
          address,
          isLoading: false,
          error: "No game history found for this address",
        });
      } else {
        set({
          profile: { gameHistory },
          address,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error("Profile fetch error:", error);
      set({
        error: `Failed to fetch profile: ${(error as Error).message}`,
        isLoading: false,
        profile: null,
      });
    }
  },
  resetProfile: () => set({ profile: null, address: null, error: null }),

  getProcessedGameHistory: () => {
    const profile = get().profile;
    if (!profile) return [];
    return processGameHistory(profile.gameHistory);
  },
}));
