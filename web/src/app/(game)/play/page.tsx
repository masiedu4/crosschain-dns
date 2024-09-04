import React from "react";
import { processLeaderboardData } from "@/lib/utils";
import PlayContent from "./(components)/PlayContent";
import { fetchLatestLeaderboard } from "@/data/query";

export default async function Play() {
  try {
    const leaderboardData = await fetchLatestLeaderboard();    

    if (!leaderboardData) {
      throw new Error("No leaderboard data available");
    }

    return <PlayContent leaderboardData={processLeaderboardData(leaderboardData.data)} />;
  } catch (error) {
    console.error("Error fetching or processing leaderboard data:", error);
    return (
      <PlayContent error="Error loading leaderboard data. Please try again later." />
    );
  }
}
