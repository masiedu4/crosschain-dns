import { createApp } from "@deroll/app";
import { createRouter } from "@deroll/router";
import { createWallet } from "@deroll/wallet";
import { Leaderboard } from "./leaderboard";
import { Address, hexToString, stringToHex } from "viem";
import { Player, GameResult } from "./player";

const app = createApp({ url: "http://127.0.0.1:5004" });
const wallet = createWallet();
const router = createRouter({ app });

let gameId: number = 1;
let totalGamesPlayed: number = 0;
const playerCache = new Map<string, Player>();

router.add<{ address: Address }>(
  "balance/:address",
  ({ params: { address } }) => {
    const balance = wallet.erc20BalanceOf("0x", address);
    return balance.toString();
  }
);

app.addAdvanceHandler(wallet.handler);
app.addInspectHandler(router.handler);

app.addAdvanceHandler(async (data) => {
  const sender = data.metadata.msg_sender;
  const payload = data.payload;

  let player = playerCache.get(sender);
  if (!player) {
    player = new Player(sender);
    playerCache.set(sender, player);
  }

  try {
    const { operation, duration, wordsSubmitted } = JSON.parse(
      hexToString(payload)
    );

    switch (operation) {
      case "start_game":
        const currentGame = player.startGame(gameId, duration);
        gameId++;

        await app.createNotice({
          payload: stringToHex(JSON.stringify(currentGame)),
        });
        break;

      case "end_game":
        let endGame: GameResult;
        try {
          if (!player.hasActiveGame()) {
            return Promise.resolve("reject");
          }

          endGame = player.endGame(wordsSubmitted);
        } catch (endGameError) {
          return Promise.resolve("reject");
        }

        totalGamesPlayed++;

        // Combine game statistics and player profile

        const gameAndProfileData = {
          ...endGame,
          playerProfile: player.getPlayerProfile(),
        };

        try {
          await app.createNotice({
            payload: stringToHex(JSON.stringify(gameAndProfileData)),
          });
        } catch (noticeError) {
          return Promise.resolve("reject");
        }

        // Update leaderboards every 10 games
        if (totalGamesPlayed % 10 === 0) {
          try {
            const leaderboardData = {
              type: "leaderboard",
              normalLeaderboard: Leaderboard.getNormalLeaderboard(),
              stakedLeaderboard: Leaderboard.getStakedLeaderboard(),
            };

            await app.createNotice({
              payload: stringToHex(JSON.stringify(leaderboardData)),
            });
          } catch (leaderboardError) {
            console.error(
              "Error creating leaderboard notice:",
              leaderboardError
            );
          }
        }

        break;
      default:
        break;
    }
  } catch (error) {
    console.error("Error processing advance:", error);
  }

  return Promise.resolve("accept");
});

app.start().catch((e) => process.exit(1));
