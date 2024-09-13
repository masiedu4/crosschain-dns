import { create } from "zustand";
import { Address } from "viem";
import {
  UserProfileStore,
  ProcessedGameRecord,
  GameData,
  PlayerProfile,
} from "../lib/types";
import { fetchPlayerProfile } from "@/data/query";


const processGameHistory = (gameHistory: GameData[]): ProcessedGameRecord[] => {
  return gameHistory
    .map((game) => ({
      timestamp: game.timestamp,
      total_points: game.points_earned + game.bonus_points_earned,
      is_staked: game.is_staked,
    }))
    .sort((a, b) => b.timestamp - a.timestamp);
};

export const useUserProfileStore = create<UserProfileStore>((set, get) => ({
  address: null,
  profile: null,
  isLoading: false,
  usdcBalance: "",
  error: null,
  fetchProfile: async (address: Address) => {
    set({ isLoading: true, error: null });
    try {
      const playerProfile = await fetchPlayerProfile(address);
      const usdcBalance = "10";

      if (playerProfile === null) {
        set({
          profile: {
            gameHistory: [],
            withdrawals: [],
            earnings: [],
          },
          address,
          isLoading: false,
          error: "No profile found for this address",
        });
      } else {
        set({
          profile: playerProfile,
          address,
          isLoading: false,
          usdcBalance: usdcBalance,
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

  getWithdrawals: () => {
    const profile = get().profile;
    return profile?.withdrawals || [];
  },

  getEarnings: () => {
    const profile = get().profile;
    return profile?.earnings || [];
  },
}));
