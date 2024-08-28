import { createApp } from "@deroll/app";
import { createRouter } from "@deroll/router";
import { createWallet } from "@deroll/wallet";
import { Leaderboard } from "./leaderboard";
import { Address, hexToString, stringToHex } from "viem";

// create app
const app = createApp({ url: "http://127.0.0.1:8080/host-runner" });

// create wallet
const wallet = createWallet();

const router = createRouter({ app });

// get current game
router.add<{ address: Address }>(
  "current/:address",
  ({ params: { address } }) => {
    const player = Leaderboard.getOrCreatePlayer(address);
    const gameHistory = player.getCurrentGame();

    const gameData = JSON.stringify(gameHistory);

    return gameData;
  }
);

function getPlayerProfile(address: Address) {
  const player = Leaderboard.getOrCreatePlayer(address);

  return {
    gameHistory: player.getGameHistory(),
  };
}

// Modified route to use the new getPlayerProfile
router.add<{ address: Address }>(
  "player/:address",
  ({ params: { address } }) => {
    const playerProfile = getPlayerProfile(address);
    return JSON.stringify(playerProfile);
  }
);

//get leaderboard
router.add("leaderboard", () => {
  const leaderboard = Leaderboard.getLeaderboard();
  return JSON.stringify(leaderboard);
});

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

          await app.createReport({
            payload: stringToHex(payload),
          });

          console.log("Report created successfully", payload);
        } catch (noticeError) {
          console.error("Error creating notice:", noticeError);
        }

        break;

      case "end_game":
        const endGame = player.endGame(wordsSubmitted);

        try {
          const gameStatistics = JSON.stringify(endGame);

          await app.createNotice({
            payload: stringToHex(gameStatistics),
          });

          console.log(
            "Game ended successfully with statistics",
            gameStatistics,
            Leaderboard.getLeaderboard()
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