import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Address } from "viem";
import {
  RankedLeaderboardEntry,
  LeaderboardEntry,
} from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function processLeaderboardData(leaderboard: LeaderboardEntry[]): RankedLeaderboardEntry[] {
  const sortedEntries = [...leaderboard].sort(
    (a: LeaderboardEntry, b: LeaderboardEntry) => b.totalPoints - a.totalPoints
  );

  return sortedEntries.map((entry: LeaderboardEntry, index: number): RankedLeaderboardEntry => ({
    ...entry,
    rank: index + 1,
  }));
}

export const truncateAddress = (addr: string | Address | undefined) => {
  if (!addr) return "";
  return `${addr.slice(0, 7)}...${addr.slice(-4)}`;
};


export const convertUnixToDate = (timestamp: number): string => {
  const date = new Date(timestamp * 1000); // Convert Unix timestamp to milliseconds
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  });
};