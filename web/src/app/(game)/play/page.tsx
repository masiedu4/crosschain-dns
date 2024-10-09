import React from "react";
import { processLeaderboardData } from "@/lib/utils";
import PlayContent from "./(components)/PlayContent";
import { fetchLatestNormalLeaderboard, fetchLatestStakedLeaderboard } from "@/data/query";

export default async function Play() {
  try {
    const leaderboardData = await fetchLatestNormalLeaderboard();
    const leaderboardData2 = await fetchLatestStakedLeaderboard()

    if (!leaderboardData) {
      throw new Error("No leaderboard data available");
    }

    return (
      <PlayContent
        normalLeaderboard={processLeaderboardData(leaderboardData.data)}
        stakedLeaderboard={processLeaderboardData(leaderboardData2.data)}
      />
    );
  } catch (error) {
    console.error("Error fetching or processing leaderboard data:", error);
    return (
      <PlayContent />
    );
  }
}
