'use client'
import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
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
import { useAccount } from "wagmi";
import { MdLeaderboard, MdSportsScore, MdEmojiEvents, MdInfo } from "react-icons/md";
import { FaMedal, FaGamepad, FaTrophy, FaSync } from "react-icons/fa";

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

  return (
    <div className="w-full flex p-6 flex-col items-start gap-6 bg-secondary-bg rounded-[12px] border border-custom-border shadow-lg">
      <div className="flex flex-col gap-4 items-start w-full">
        <div className="flex justify-between items-center w-full">
          <div className="flex gap-2 items-center">
            <MdLeaderboard className="text-3xl text-yellow-400" />
            <h2 className="text-2xl font-bold text-white">Leaderboards</h2>
          </div>
          <div className="flex gap-2">
            <Button
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${!isStaked ? "bg-primary-bg text-white" : "bg-secondary-bg text-gray-400 hover:bg-primary-bg hover:text-white"}`}
              onClick={toggleStaked}
            >
              <FaGamepad />
              Normal Game
            </Button>
            <Button
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${isStaked ? "bg-primary-bg text-white" : "bg-secondary-bg text-gray-400 hover:bg-primary-bg hover:text-white"}`}
              onClick={toggleStaked}
            >
              <FaTrophy />
              Stake and Play
            </Button>
          </div>
        </div>
      </div>
      <div className="w-full h-[300px] overflow-y-auto custom-scrollbar bg-primary-bg/10 rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-primary-bg/20">
              <TableHead className="sticky top-0 z-10 text-white">Rank</TableHead>
              <TableHead className="sticky top-0 z-10 text-white">Player</TableHead>
              <TableHead className="sticky top-0 z-10 text-white">Games</TableHead>
              <TableHead className="sticky top-0 z-10 text-white">Total Points</TableHead>
              <TableHead className="sticky top-0 z-10 text-white">Last Game Points</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.map((data: RankedLeaderboardEntry) => (
              <TableRow 
                key={data.address}
                className={`text-white transition-colors duration-200 hover:bg-primary-bg/5 ${data.address.toLowerCase() === address?.toLowerCase() ? "bg-primary-bg/20" : ""}`}
              >
                <TableCell className="font-medium">
                  {data.rank <= 3 ? (
                    <FaMedal className={`inline mr-2 ${data.rank === 1 ? "text-yellow-400" : data.rank === 2 ? "text-gray-400" : "text-yellow-600"}`} />
                  ) : null}
                  {data.rank}
                </TableCell>
                <TableCell>
                  {data.address.toLowerCase() === address?.toLowerCase() ? <span className="font-bold text-primary-bg">You</span> : truncateAddress(data.address)}
                </TableCell>
                <TableCell>{data.gamesPlayed}</TableCell>
                <TableCell className="font-semibold">{data.totalPoints}</TableCell>
                <TableCell>{data.lastGamePoints}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="w-full flex items-center gap-3 p-4 bg-yellow-500 bg-opacity-20 rounded-lg text-yellow-500 font-medium transition-all duration-300 hover:bg-opacity-30">
        <MdInfo className="text-3xl" />
        <div>
          <p className="font-bold">Leaderboard Update</p>
          <p>The leaderboard refreshes after every 10 games played.</p>
        </div>
        <FaSync className="text-3xl ml-auto animate-spin-slow" />
      </div>

      {!userEntry && (
        <div className="w-full flex items-center gap-3 p-4 bg-yellow-500 bg-opacity-20 rounded-lg text-yellow-500 font-medium transition-all duration-300 hover:bg-opacity-30">
          <MdSportsScore className="text-3xl" />
          <div>
            <p className="font-bold">Not on the leaderboard yet?</p>
            <p>Play a game and claim your spot among the champions!</p>
          </div>
          <MdEmojiEvents className="text-3xl ml-auto animate-pulse" />
        </div>
      )}
    </div>
  );
};

export default Leaderboard;