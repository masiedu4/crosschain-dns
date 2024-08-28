import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Address, hexToString, Hex } from "viem";
import {
  RankedLeaderboardEntry,
  LeaderboardEntry,
} from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function processLeaderboardData(payload: Hex): RankedLeaderboardEntry[] {
  const decodedPayload = hexToString(payload);

  const leaderboardEntries: LeaderboardEntry[] = JSON.parse(decodedPayload);

  const sortedEntries = leaderboardEntries.sort(
    (a, b) => b.totalPoints - a.totalPoints
  );

  return sortedEntries.map((entry, index) => ({
    ...entry,
    rank: index + 1,
  }));
}

export const truncateAddress = (addr: string | Address | undefined) => {
  if (!addr) return "";
  return `${addr.slice(0, 7)}...${addr.slice(-4)}`;
};


export function convertUnixToDate(unixTimestamp: number): string {
  const date = new Date(unixTimestamp * 1000);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}