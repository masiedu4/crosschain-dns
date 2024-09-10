"use client";

import { Button } from "@/components/ui/button";
import React, { useState, useEffect, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RankedLeaderboardEntry } from "@/lib/types";
import { truncateAddress } from "@/lib/utils";
import { useAccount } from "wagmi";import { MdLeaderboard } from "react-icons/md";


interface LeaderboardProps {
  stakedLeaderBoardData: RankedLeaderboardEntry[];
  normalLeaderboardData: RankedLeaderboardEntry[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({
  stakedLeaderBoardData,
  normalLeaderboardData,
}) => {
  const [isStaked, setIsStaked] = useState<boolean>(false);
  const [currentData, setCurrentData] = useState<RankedLeaderboardEntry[]>([]);

  const { address } = useAccount();

  useEffect(() => {
    const newData = isStaked ? stakedLeaderBoardData : normalLeaderboardData;
    setCurrentData(newData || []);
  }, [isStaked, stakedLeaderBoardData, normalLeaderboardData]);

  const userEntry = useMemo(() => {
    return currentData.find(entry => entry.address.toLowerCase() === address?.toLowerCase());
  }, [currentData, address]);

  const toggleStaked = (): void => {
    setIsStaked(prev => !prev);
  };

  if (!stakedLeaderBoardData || !normalLeaderboardData) {
    return <div>Loading leaderboard data...</div>;
  }

  return (
    <div className="w-full flex p-6 flex-col items-start gap-6 bg-secondary-bg rounded-[12px] border border-custom-border">
      <div className="flex flex-col gap-2 items-start">
      <div className="flex gap-2 items-center">
      <MdLeaderboard />
        <p className="text-xl font-semibold">Leaderboards</p>
        </div>
        <div className="flex gap-2 items-center self-stretch">
          <Button
            className={`bg-secondary-bg gap-1 rounded-[100px] ${!isStaked ? "bg-primary-bg" : ""}`}
            onClick={toggleStaked}
          >
            Normal game
          </Button>
          <Button
            className={`bg-secondary-bg gap-1 rounded-[100px] ${isStaked ? "bg-primary-bg" : ""}`}
            onClick={toggleStaked}
          >
            Stake and play
          </Button>
        </div>
      </div>
      <div className="w-full h-[300px] overflow-y-auto custom-scrollbar">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className=" sticky top-0 z-10">Player rank</TableHead>
              <TableHead className=" sticky top-0 z-10">Wallet address</TableHead>
              <TableHead className=" sticky top-0 z-10">Games played</TableHead>
              <TableHead className="sticky top-0 z-10">Total points</TableHead>
              <TableHead className=" sticky top-0 z-10">Last game points</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.map((data: RankedLeaderboardEntry) => (
              <TableRow 
                key={data.address}
                className={data.address.toLowerCase() === address?.toLowerCase() ? "bg-secondary-bg" : ""}
              >
                <TableCell>{data.rank}</TableCell>
                <TableCell>
                  {data.address.toLowerCase() === address?.toLowerCase() ? "You" : truncateAddress(data.address)}
                </TableCell>
                <TableCell>{data.gamesPlayed}</TableCell>
                <TableCell>{data.totalPoints}</TableCell>
                <TableCell>{data.lastGamePoints}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {!userEntry && (
        <div className="text-yellow-500">
          You are not currently on the leaderboard. Play some games to appear here!
        </div>
      )}
    </div>
  );
};

export default Leaderboard;