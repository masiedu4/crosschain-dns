import { Player } from "./player";
import { Address } from "viem";
import { GameData } from "./player";

export class Leaderboard {
  static players: Map<string, Player> = new Map();
  private static normalLeaderboard: LeaderboardEntry[] = [];
  private static stakedLeaderboard: LeaderboardEntry[] = [];

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

    // Update normal leaderboard
    this.normalLeaderboard = this.createLeaderboardForPlayers(
      allPlayers.filter((player) => !player.getStakeStatus())
    );

    // Update staked leaderboard
    this.stakedLeaderboard = this.createLeaderboardForPlayers(
      allPlayers.filter((player) => player.getStakeStatus())
    );
  }

  private static createLeaderboardForPlayers(
    players: Player[]
  ): LeaderboardEntry[] {
    return players
      .map((player) => ({
        address: player.getAddress(),
        gamesPlayed: player.getGamesPlayed(),
        totalPoints: player.getTotalPoints(),
        lastGamePoints: player.getLastGamePoints(),
      }))
      .sort((a, b) => b.totalPoints - a.totalPoints);
  }

  static getNormalLeaderboard(): LeaderboardEntry[] {
    return this.normalLeaderboard;
  }

  static getStakedLeaderboard(): LeaderboardEntry[] {
    return this.stakedLeaderboard;
  }

  static getPlayerRank(address: Address): number {
    const player = this.players.get(address.toLowerCase());
    if (!player) {
      throw new Error(`No player found with address ${address}`);
    }
    const leaderboard = player.getStakeStatus()
      ? this.stakedLeaderboard
      : this.normalLeaderboard;
    return leaderboard.findIndex((entry) => entry.address === address) + 1;
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
