"use client";

import React, { useState } from "react";
import { AlertTriangle } from "lucide-react";
import GameModes from "./GameModes";
import SetGame from "./SetGame";
import Leaderboard from "./Leaderboard";

type PlayContentProps = {
  normalLeaderboard?: any;
  stakedLeaderboard?: any;
  error?: string;
};

const ErrorDisplay: React.FC<{ message: string }> = ({ message }) => (
  <div className="w-full p-6 bg-red-100 border-l-4 border-red-500 rounded-md shadow-md">
    <div className="flex items-center">
      <div className="flex-shrink-0">
        <AlertTriangle className="h-5 w-5 text-red-500" />
      </div>
      <div className="ml-3">
        <h3 className="text-sm font-medium text-red-800">Error</h3>
        <div className="mt-2 text-sm text-red-700">
          <p>{message}</p>
        </div>
      </div>
    </div>
  </div>
);

const PlayContent: React.FC<PlayContentProps> = ({
  normalLeaderboard,
  stakedLeaderboard,
  error,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="w-[900px] mx-auto flex flex-col p-20 gap-6 justify-center items-center">
      <div
        className={`w-full transition-opacity duration-300 ${
          isModalOpen ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <GameModes openSetGame={openModal} />
      </div>
      {isModalOpen && <SetGame onClose={closeModal} />}
      <div
        className={`w-full transition-opacity duration-300 ${
          isModalOpen ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        {error ? (
          <ErrorDisplay message={error} />
        ) : (
          <Leaderboard
            normalLeaderboardData={normalLeaderboard}
            stakedLeaderBoardData={stakedLeaderboard}
          />
        )}
      </div>
    </div>
  );
};

export default PlayContent;