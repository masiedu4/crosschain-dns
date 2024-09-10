import { createApp } from "@deroll/app";
import { createRouter } from "@deroll/router";
import { createWallet } from "@deroll/wallet";
import { Leaderboard } from "./leaderboard";
import {  hexToString, stringToHex } from "viem";

// create app
const app = createApp({ url: "http://127.0.0.1:8080/host-runner" });

// create wallet
const wallet = createWallet();

const router = createRouter({ app });

let gameId: number = 1;

app.addAdvanceHandler(wallet.handler);
app.addInspectHandler(router.handler);

app.addAdvanceHandler(async (data) => {
  const sender = data.metadata.msg_sender;
  const payload = data.payload;

  const player = Leaderboard.getOrCreatePlayer(sender);

  try {
    const { operation, duration, wordsSubmitted } = JSON.parse(
      hexToString(payload)
    );
    switch (operation) {
      case "start_game":
        const currentGame = player.startGame(gameId, duration);

        gameId++;

        try {
          const payload = JSON.stringify(currentGame);

          await app.createNotice({
            payload: stringToHex(payload),
          });

          console.log("Notice created successfully", payload);
        } catch (noticeError) {
          console.error("Error creating notice:", noticeError);
        }

        break;

      case "end_game":
        const endGame = player.endGame(wordsSubmitted);

        try {
          // update game state
          const gameStatistics = JSON.stringify(endGame);

          // fetch leaderboard
          const leaderboardPayload = {
            type: "normal_leaderboard",
            data: Leaderboard.getNormalLeaderboard(),
          };

          const stakedLeaderboardPayload = {
            type:"staked_leaderboard",
            data: Leaderboard.getStakedLeaderboard()
          }
          

          // fetch game history
          const gameHistory = {
            type: "game_history",
            data: player.getGameHistory(),
          };

          await app.createNotice({
            payload: stringToHex(gameStatistics),
          });

          await app.createNotice({
            payload: stringToHex(JSON.stringify(leaderboardPayload)),
          });

          await app.createNotice({
            payload: stringToHex(JSON.stringify(stakedLeaderboardPayload)),
          });

          await app.createNotice({
            payload: stringToHex(JSON.stringify(gameHistory)),
          });

          console.log(
            "Game ended successfully with statistics",
            gameStatistics,
            Leaderboard.getNormalLeaderboard(),
            Leaderboard.getStakedLeaderboard()
          );
        } catch (error) {}

      default:
        console.log("Unknown operation:", operation);
        break;
    }
  } catch (error) {
    console.error("Error processing advance:", error);
  }

  return Promise.resolve("accept");
});

// start app
app.start().catch((e) => process.exit(1));
