import { Address, hexToString } from "viem";
import { inspect } from "@/data/inspect";
import GameWrapper from "./(components)/GameWrapper";
import { fetchLatestStartGame } from "@/data/query";

export default async function Page({
  params,
}: {
  params: { address: string | Address };
}) {
  try {
    // const response = await inspect(`current/${params.address}`);

    const gameData = await fetchLatestStartGame(params.address)
   
    if (!gameData) {
      console.log("No game data available");
      return (
        <GameWrapper
          game_id={null}
          scrambled_letters={null}
          duration={null}
      
        />
      );
    }



    // Ensure all required fields are present
    if (
      !gameData.game_id ||
      !gameData.scrambled_letters ||
      !gameData.duration
    ) {
      console.log("Incomplete game data", gameData);
      return (
        <GameWrapper
          game_id={null}
          scrambled_letters={null}
          duration={null}

        />
      );
    }

    return (
      <div>
        <GameWrapper
          game_id={gameData.game_id}
          scrambled_letters={gameData.scrambled_letters}
          duration={gameData.duration}
        />
      </div>
    );
  } catch (error) {
    console.error("Error fetching or parsing game data:", error);
    return (
      <GameWrapper
        game_id={null}
        scrambled_letters={null}
        duration={null}

      />
    );
  }
}