import React from "react";
import { inspect } from "@/data/inspect";
import { processLeaderboardData } from "@/lib/utils";
import PlayContent from "./(components)/PlayContent";

export default async function Play() {
  try {
    const leaderboardData = await inspect("leaderboard/normal");

    if (!leaderboardData.reports || leaderboardData.reports.length === 0) {
      throw new Error("No leaderboard data available");
    }

    const payload1 = leaderboardData.reports[0].payload;

    const normalRank = processLeaderboardData(payload1);

    return <PlayContent leaderboardData={normalRank} />;
  } catch (error) {
    console.error("Error fetching or processing leaderboard data:", error);
    return (
      <PlayContent error="Error loading leaderboard data. Please try again later." />
    );
  }
}
