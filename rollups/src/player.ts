import { Address } from "viem";
import { dictionary } from "./dictionary";
import { Leaderboard } from "./leaderboard";

interface Transaction {
  timestamp: number;
  amount: number;
}

interface PlayerProfile {
  gameHistory: GameData[];
  withdrawals: Transaction[];
  earnings: Transaction[];
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

interface InternalGameData extends GameData {
  original_words: string[];
}

export interface GameResult extends GameData {
  words_submitted: string[];
  original_words: string[];
  sample_possible_words: string[];
  additional_possible_words_count: number;
}

interface GameStats {
  totalPoints: number;
  gamesPlayed: number;
  totalWordsWon: number;
  totalBonusWordsWon: number;
  lastGamePoints: number;
}

export class Player {
  private normalStats: GameStats = {
    totalPoints: 0,
    gamesPlayed: 0,
    totalWordsWon: 0,
    totalBonusWordsWon: 0,
    lastGamePoints: 0,
  };
  private stakedStats: GameStats = {
    totalPoints: 0,
    gamesPlayed: 0,
    totalWordsWon: 0,
    totalBonusWordsWon: 0,
    lastGamePoints: 0,
  };
  private gameHistory: GameData[] = [];
  private currentGame: InternalGameData | null = null;
  private stakeStatus: boolean = false;
  private earnings: Transaction[] = [];
  private withdrawals: Transaction[] = [];
  private gameResetTimer: NodeJS.Timeout | null = null;

  constructor(private readonly address: Address) {}

  getAddress(): Address {
    return this.address;
  }

  addEarning(amount: number): void {
    this.earnings.push({
      timestamp: Math.floor(Date.now() / 1000),
      amount,
    });
  }

  addWithdrawal(amount: number): void {
    this.withdrawals.push({
      timestamp: Math.floor(Date.now() / 1000),
      amount,
    });
  }

  getEarnings(): Transaction[] {
    return [...this.earnings];
  }

  getWithdrawals(): Transaction[] {
    return [...this.withdrawals];
  }

  getStakeStatus(): boolean {
    return this.stakeStatus;
  }

  setStakeStatus(status: boolean): void {
    this.stakeStatus = status;
  }

  getTotalPoints(): number {
    return this.stakeStatus
      ? this.stakedStats.totalPoints
      : this.normalStats.totalPoints;
  }

  getGamesPlayed(): number {
    return this.stakeStatus
      ? this.stakedStats.gamesPlayed
      : this.normalStats.gamesPlayed;
  }

  getLastGamePoints(): number {
    return this.stakeStatus
      ? this.stakedStats.lastGamePoints
      : this.normalStats.lastGamePoints;
  }

  resetStakedPoints(): void {
    this.stakedStats = {
      totalPoints: 0,
      gamesPlayed: 0,
      totalWordsWon: 0,
      totalBonusWordsWon: 0,
      lastGamePoints: 0,
    };
  }

  startGame(
    game_id: number,
    duration: number
  ): Omit<
    GameData,
    "words_won" | "bonus_words_won" | "points_earned" | "bonus_points_earned"
  > {
    if (this.currentGame) {
      throw new Error("Player already has an active game");
    }

    const { words, scrambled_letters } =
      this.generateWordsAndScramble(duration);

    this.currentGame = {
      type: "start_game",
      game_id,
      scrambled_letters,
      original_words: words,
      timestamp: Math.floor(Date.now() / 1000),
      duration,
      is_ended: false,
      words_won: [],
      bonus_words_won: [],
      points_earned: 0,
      bonus_points_earned: 0,
      is_staked: this.stakeStatus,
    };

    // Set a timer to reset the game after 5 minutes
    this.gameResetTimer = setTimeout(
      () => {
        this.resetCurrentGame();
      },
      5 * 60 * 1000
    ); // 5 minutes in milliseconds

    return {
      type: this.currentGame.type,
      game_id: this.currentGame.game_id,
      scrambled_letters: this.currentGame.scrambled_letters,
      timestamp: this.currentGame.timestamp,
      duration: this.currentGame.duration,
      is_ended: this.currentGame.is_ended,
      is_staked: this.currentGame.is_staked,
    };
  }

  endGame(wordsSubmitted: string[]): GameResult {
    if (!this.currentGame) {
      throw new Error("No active game for this player");
    }

    // Clear the game reset timer
    if (this.gameResetTimer) {
      clearTimeout(this.gameResetTimer);
      this.gameResetTimer = null;
    }

    const wordsWon = this.verifyWords(
      wordsSubmitted,
      dictionary,
      this.currentGame.scrambled_letters
    );
    const bonusWordsWon = this.verifyWords(
      wordsSubmitted,
      this.currentGame.original_words,
      this.currentGame.scrambled_letters
    );

    const pointsEarned = this.calculateNormalPoints(
      wordsWon.length - bonusWordsWon.length
    );
    const bonusPointsEarned = this.calculateBonusPoints(bonusWordsWon.length);
    const totalPointsEarned = pointsEarned + bonusPointsEarned;

    this.currentGame.is_ended = true;
    this.currentGame.type = "end_game";
    this.currentGame.words_won = wordsWon;
    this.currentGame.bonus_words_won = bonusWordsWon;
    this.currentGame.points_earned = pointsEarned;
    this.currentGame.bonus_points_earned = bonusPointsEarned;

    const stats = this.stakeStatus ? this.stakedStats : this.normalStats;
    stats.totalPoints += totalPointsEarned;
    stats.gamesPlayed++;
    stats.totalWordsWon += wordsWon.length;
    stats.totalBonusWordsWon += bonusWordsWon.length;
    stats.lastGamePoints = totalPointsEarned;

    const { sampleWords, additionalCount } = this.getSamplePossibleWords(
      this.currentGame.scrambled_letters,
      dictionary,
      5
    );

    const gameResult: GameResult = {
      ...this.currentGame,
      words_submitted: wordsSubmitted,
      original_words: this.currentGame.original_words,
      sample_possible_words: sampleWords,
      additional_possible_words_count: additionalCount,
    };

    this.gameHistory.push(this.currentGame);
    Leaderboard.updateLeaderboard();
    this.currentGame = null;

    return gameResult;
  }

  getGameHistory(): GameData[] {
    return this.gameHistory;
  }

  getPlayerProfile(): PlayerProfile {
    return {
      gameHistory: this.gameHistory,
      withdrawals: this.withdrawals,
      earnings: this.earnings,
    };
  }

  getCurrentGame(): Omit<
    GameData,
    "words_won" | "bonus_words_won" | "points_earned" | "bonus_points_earned"
  > | null {
    if (!this.currentGame) return null;
    const {
      original_words,
      words_won,
      bonus_words_won,
      points_earned,
      bonus_points_earned,
      ...safeGameData
    } = this.currentGame;
    return safeGameData;
  }

  hasActiveGame(): boolean {
    return this.currentGame !== null;
  }

  private resetCurrentGame(): void {
    if (this.currentGame) {
      console.log(
        `Game ${this.currentGame.game_id} has been reset due to timeout.`
      );
      this.currentGame = null;
      this.gameResetTimer = null;
    }
  }

  private calculateNormalPoints(wordCount: number): number {
    const basePoints = wordCount * 3;
    return this.stakeStatus ? basePoints * 2 : basePoints; // Double points for staked games
  }

  private calculateBonusPoints(bonusWordCount: number): number {
    const basePoints = bonusWordCount * 6;
    return this.stakeStatus ? basePoints * 2 : basePoints; // Double points for staked games
  }

  private generateWordsAndScramble(duration: number): {
    words: string[];
    scrambled_letters: string;
  } {
    const wordCount = this.getWordCountForDuration(duration);
    const words = this.getRandomWords(dictionary, wordCount, 5, 8);
    const scrambled_letters = this.scrambleWords(words);
    return { words, scrambled_letters };
  }

  private getWordCountForDuration(duration: number): number {
    switch (duration) {
      case 20:
        return 6;
      case 30:
        return 5;
      case 40:
        return 4;
      case 50:
        return 3;
      case 60:
        return 2;
      default:
        throw new Error("Invalid duration");
    }
  }

  private getRandomWords(
    wordList: string[],
    count: number,
    minLength: number,
    maxLength: number
  ): string[] {
    const filteredWords = wordList.filter(
      (word) => word.length >= minLength && word.length <= maxLength
    );
    const shuffled = [...filteredWords].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  private scrambleWords(words: string[]): string {
    return words
      .join("")
      .split("")
      .sort(() => 0.5 - Math.random())
      .join("");
  }

  private verifyWords(
    submittedWords: string[],
    wordList: string[],
    scrambledLetters: string
  ): string[] {
    const wordSet = new Set(wordList.map((word) => word.toLowerCase()));
    const availableLetters = this.getLetterCounts(scrambledLetters);
    const verifiedWords = new Set<string>();

    submittedWords.forEach((word) => {
      const lowercaseWord = word.toLowerCase();
      if (wordSet.has(lowercaseWord) && !verifiedWords.has(lowercaseWord)) {
        const wordLetters = this.getLetterCounts(lowercaseWord);
        let isValid = true;
        for (const [letter, count] of Object.entries(wordLetters)) {
          if (!availableLetters[letter] || availableLetters[letter] < count) {
            isValid = false;
            break;
          }
        }
        if (isValid) {
          verifiedWords.add(lowercaseWord);
        }
      }
    });

    return Array.from(verifiedWords);
  }
  
  private getSamplePossibleWords(
    scrambledLetters: string,
    wordList: string[],
    sampleSize: number
  ): { sampleWords: string[]; additionalCount: number } {
    const allPossibleWords = this.findAllPossibleWords(
      scrambledLetters,
      wordList
    );
    const totalCount = allPossibleWords.length;

    const shuffled = allPossibleWords.sort(() => 0.5 - Math.random());
    const sampleWords = shuffled.slice(0, sampleSize);

    return {
      sampleWords,
      additionalCount: Math.max(0, totalCount - sampleSize),
    };
  }

  private findAllPossibleWords(
    scrambledLetters: string,
    wordList: string[]
  ): string[] {
    const availableLetters = this.getLetterCounts(scrambledLetters);
    return wordList.filter((word) => {
      const wordLetters = this.getLetterCounts(word);
      for (const [letter, count] of Object.entries(wordLetters)) {
        if (!availableLetters[letter] || availableLetters[letter] < count) {
          return false;
        }
      }
      return true;
    });
  }

  private getLetterCounts(word: string): Record<string, number> {
    return word.split("").reduce(
      (acc, letter) => {
        acc[letter] = (acc[letter] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
  }
}
