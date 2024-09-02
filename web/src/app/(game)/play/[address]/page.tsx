import { Address, hexToString } from "viem";
import { inspect } from "@/data/inspect";
import GameWrapper from "./(components)/GameWrapper";

export default async function Page({
  params,
}: {
  params: { address: string | Address };
}) {
  try {
    const response = await inspect(`current/${params.address}`);

    if (!response.reports || response.reports.length === 0) {
      console.log("No game data available");
      return (
        <GameWrapper
          game_id={null}
          scrambled_letters={null}
          duration={null}
          is_staked={null}
        />
      );
    }

    const gameData = hexToString(response.reports[0].payload);
    const parsedGameData = JSON.parse(gameData);

    // Ensure all required fields are present
    if (
      !parsedGameData.game_id ||
      !parsedGameData.scrambled_letters ||
      !parsedGameData.duration
    ) {
      console.log("Incomplete game data", parsedGameData);
      return (
        <GameWrapper
          game_id={null}
          scrambled_letters={null}
          duration={null}
          is_staked={null}
        />
      );
    }

    return (
      <div>
        <GameWrapper
          game_id={parsedGameData.game_id}
          scrambled_letters={parsedGameData.scrambled_letters}
          duration={parsedGameData.duration}
          is_staked={parsedGameData.is_staked}
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
        is_staked={null}
      />
    );
  }
}
