"use client";

import React, { useState } from "react";
import GameModes from "./GameModes";
import SetGame from "./SetGame";
import Leaderboard from "./Leaderboard";

type PlayContentProps = {
  leaderboardData?: any;
  error?: string;
};

const PlayContent: React.FC<PlayContentProps> = ({
  leaderboardData,
  error,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="w-[900px] mx-auto flex flex-col p-20 gap-2 justify-center items-center">
      <div
        className={`w-full transition-opacity duration-300 ${isModalOpen ? "opacity-0 pointer-events-none" : "opacity-100"}`}
      >
        <GameModes openSetGame={openModal} />
      </div>
      {isModalOpen && <SetGame onClose={closeModal} />}
      <div
        className={`w-full transition-opacity duration-300 ${isModalOpen ? "opacity-0 pointer-events-none" : "opacity-100"}`}
      >
        {error ? (
          <div>{error}</div>
        ) : (
          <Leaderboard leaderboardData={leaderboardData} />
        )}
      </div>
    </div>
  );
};

export default PlayContent;
