import { Player } from "./player";
import { Address } from "viem";
import { GameData } from "./player";

export class Leaderboard {
  static players: Map<string, Player> = new Map();
  private static leaderboard: LeaderboardEntry[] = [];

  static getOrCreatePlayer(address: Address): Player {
    const key = address.toLowerCase();
    if (!this.players.has(key)) {
      const player = new Player(address);
      this.players.set(key, player);
      this.updateLeaderboard();
    }
    return this.players.get(key)!;
  }

  static updateLeaderboard(): void {
    const allPlayers = Array.from(this.players.values());
    
    this.leaderboard = this.createLeaderboardForPlayers(allPlayers);
  }

  private static createLeaderboardForPlayers(players: Player[]): LeaderboardEntry[] {
    return players
      .map((player) => ({
        address: player.getAddress(),
        gamesPlayed: player.getGamesPlayed(),
        totalPoints: player.getTotalPoints(),
        lastGamePoints: player.getLastGamePoints(),
      }))
      .sort((a, b) => b.totalPoints - a.totalPoints);
  }

  static getLeaderboard(): LeaderboardEntry[] {
    return this.leaderboard;
  }

  static getPlayerRank(address: Address): number {
    const player = this.players.get(address.toLowerCase());
    if (!player) {
      throw new Error(`No player found with address ${address}`);
    }
    return this.leaderboard.findIndex((entry) => entry.address === address) + 1;
  }

  static getPlayerGameHistory(address: Address): GameData[] {
    const player = this.players.get(address.toLowerCase());
    if (!player) {
      throw new Error(`No player found with address ${address}`);
    }
    return player.getGameHistory();
  }
}

interface LeaderboardEntry {
  address: Address;
  gamesPlayed: number;
  totalPoints: number;
  lastGamePoints: number;
}