import { create } from "zustand";
import { inspect } from "@/data/inspect";
import { Address, hexToString } from "viem";
import {
  UserProfile,
  UserProfileStore,
  ProcessedGameRecord,
  GameData,
} from "../lib/types";

const processGameHistory = (gameHistory: GameData[]): ProcessedGameRecord[] => {
  return gameHistory.map((game) => ({
    timestamp: game.timestamp,
    total_points: game.points_earned + game.bonus_points_earned,
  }));
};

export const useUserProfileStore = create<UserProfileStore>((set, get) => ({
  address: null,
  profile: null,
  isLoading: false,
  error: null,
  fetchProfile: async (address: Address) => {
    set({ isLoading: true, error: null });
    try {
      const response = await inspect(`player/${address}`);

      if (!response) {
        throw new Error("Failed to fetch user profile");
      }

      if (!response.reports || response.reports.length === 0) {
        throw new Error("No profile data available");
      }

      const hexProfile = response.reports[0].payload;

      let profile: UserProfile;
      try {
        profile = JSON.parse(hexToString(hexProfile));
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        throw new Error(
          `Failed to parse profile data: ${(parseError as Error).message}`
        );
      }

      set({ profile, address, isLoading: false });
    } catch (error) {
      console.error("Profile fetch error:", error);
      set({ error: (error as Error).message, isLoading: false });
    }
  },
  resetProfile: () => set({ profile: null, address: null, error: null }),

  getProcessedGameHistory: () => {
    const profile = get().profile;
    if (!profile) return [];
    return processGameHistory(profile.gameHistory);
  },
}));
