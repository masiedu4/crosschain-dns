import { Address } from "viem";
import { dictionary } from "./dictionary";
import { Leaderboard } from "./leaderboard";

interface Transaction {
  timestamp: number;
  amount: number;
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


}

interface GameStats {
  totalPoints: number;
  gamesPlayed: number;
  totalWordsWon: number;
  totalBonusWordsWon: number;
  lastGamePoints: number;
}

class TrieNode {
  children: Map<string, TrieNode> = new Map();
  isEndOfWord: boolean = false;
}

class Trie {
  root: TrieNode = new TrieNode();

  insert(word: string): void {
    let node = this.root;
    for (const char of word) {
      if (!node.children.has(char)) {
        node.children.set(char, new TrieNode());
      }
      node = node.children.get(char)!;
    }
    node.isEndOfWord = true;
  }

  search(word: string): boolean {
    let node = this.root;
    for (const char of word) {
      if (!node.children.has(char)) {
        return false;
      }
      node = node.children.get(char)!;
    }
    return node.isEndOfWord;
  }
}

// Initialize trie with dictionary words
const dictionaryTrie = new Trie();
dictionary.forEach((word) => dictionaryTrie.insert(word.toLowerCase()));

export class Player {
  private stats: GameStats = {
    totalPoints: 0,
    gamesPlayed: 0,
    totalWordsWon: 0,
    totalBonusWordsWon: 0,
    lastGamePoints: 0,
  };
  private gameHistory: GameData[] = [];
  private currentGame: InternalGameData | null = null;
  private stakeStatus: boolean = false;
  private transactions: Transaction[] = [];

  constructor(private readonly address: Address) {}

  getAddress(): Address {
    return this.address;
  }

  addTransaction(amount: number, isWithdrawal: boolean): void {
    this.transactions.push({
      timestamp: Math.floor(Date.now() / 1000),
      amount: isWithdrawal ? -amount : amount,
    });
  }

  getTransactions(): Transaction[] {
    return [...this.transactions];
  }

  getStakeStatus(): boolean {
    return this.stakeStatus;
  }

  setStakeStatus(status: boolean): void {
    this.stakeStatus = status;
  }

  getTotalPoints(): number {
    return this.stats.totalPoints;
  }

  getGamesPlayed(): number {
    return this.stats.gamesPlayed;
  }

  getLastGamePoints(): number {
    return this.stats.lastGamePoints;
  }

  resetPoints(): void {
    this.stats = {
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
  
    try {
      // Flatten and clean the submitted words array
      const cleanedWords = wordsSubmitted
        .flatMap((word) => word.split(/[,"\s]+/))
        .filter((word) => word.length > 0);
  
      const wordsWon = this.verifyWords(
        cleanedWords,
        this.currentGame.scrambled_letters
      );
  
      const bonusWordsWon = this.verifyWords(
        cleanedWords,
        this.currentGame.scrambled_letters,
        new Set(this.currentGame.original_words)
      );
  
      const pointsEarned = this.calculatePoints(
        wordsWon.size - bonusWordsWon.size,
        false
      );
      const bonusPointsEarned = this.calculatePoints(bonusWordsWon.size, true);
      const totalPointsEarned = pointsEarned + bonusPointsEarned;
  
      // Update current game data
      this.currentGame.is_ended = true;
      this.currentGame.type = "end_game";
      this.currentGame.words_won = Array.from(wordsWon);
      this.currentGame.bonus_words_won = Array.from(bonusWordsWon);
      this.currentGame.points_earned = pointsEarned;
      this.currentGame.bonus_points_earned = bonusPointsEarned;
  
      // Update player stats
      this.stats.totalPoints += totalPointsEarned;
      this.stats.gamesPlayed++;
      this.stats.totalWordsWon += wordsWon.size;
      this.stats.totalBonusWordsWon += bonusWordsWon.size;
      this.stats.lastGamePoints = totalPointsEarned;
  
      // Prepare game result
      const gameResult: GameResult = {
        ...this.currentGame,
        words_submitted: cleanedWords,
        original_words: this.currentGame.original_words,
      };
  
      // Add to game history
      this.gameHistory.push({ ...this.currentGame });
  
      // Update leaderboard
      Leaderboard.updateLeaderboard();
  
      // Reset current game
      this.currentGame = null;
  
      return gameResult;
    } catch (error) {
      // If an error occurs, ensure the current game is reset
      this.currentGame = null;
      throw error;
    }
  }

  getGameHistory(): GameData[] {
    return this.gameHistory;
  }

  getPlayerProfile(): {
    gameHistory: GameData[];
    transactions: Transaction[];
  } {
    return {
      gameHistory: this.gameHistory,
      transactions: this.transactions,
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

  private calculatePoints(wordCount: number, isBonus: boolean): number {
    const basePoints = wordCount * (isBonus ? 6 : 3);
    return this.stakeStatus ? basePoints * 2 : basePoints;
  }

  private generateWordsAndScramble(duration: number): {
    words: string[];
    scrambled_letters: string;
  } {
    const wordCount = this.getWordCountForDuration(duration);
    const words = this.getRandomWords(wordCount, 4, 8);
    const scrambled_letters = this.scrambleWords(words);
    return { words, scrambled_letters };
  }

  private getWordCountForDuration(duration: number): number {
    const durationMap: { [key: number]: number } = { 40: 4, 60: 3, 80: 2 };
    const count = durationMap[duration];
    if (!count) throw new Error("Invalid duration");
    return count;
  }

  private getRandomWords(
    count: number,
    minLength: number,
    maxLength: number
  ): string[] {
    const filteredWords = dictionary.filter(
      (word) => word.length >= minLength && word.length <= maxLength
    );
    return Array.from(
      { length: count },
      () =>
        filteredWords[
          Math.floor(Math.random() * filteredWords.length)
        ] as string
    );
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
    scrambledLetters: string,
    bonusWords?: Set<string>
  ): Set<string> {
    const availableLetters = this.getLetterCounts(scrambledLetters);
    const verifiedWords = new Set<string>();

    const words = submittedWords
      .flatMap((word) => word.split(/[,"\s]+/))
      .filter((word) => word.length > 0);

    for (const word of words) {
      const lowercaseWord = word.toLowerCase();
      const isInDictionary = bonusWords
        ? bonusWords.has(lowercaseWord)
        : dictionaryTrie.search(lowercaseWord);

      if (
        isInDictionary &&
        this.canFormWord(lowercaseWord, new Map(availableLetters))
      ) {
        verifiedWords.add(lowercaseWord);
      }
    }

    return verifiedWords;
  }

  private canFormWord(
    word: string,
    availableLetters: Map<string, number>
  ): boolean {
    const wordLetters = this.getLetterCounts(word);
    for (const [letter, count] of wordLetters) {
      if (
        !availableLetters.has(letter) ||
        availableLetters.get(letter)! < count
      ) {
        return false;
      }
      availableLetters.set(letter, availableLetters.get(letter)! - count);
    }
    return true;
  }

  private getLetterCounts(word: string): Map<string, number> {
    return word.split("").reduce((acc, letter) => {
      acc.set(letter, (acc.get(letter) || 0) + 1);
      return acc;
    }, new Map<string, number>());
  }


 
}
