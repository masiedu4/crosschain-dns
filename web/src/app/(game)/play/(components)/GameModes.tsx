import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FaGamepad, FaTrophy, FaCoins, FaMedal, FaPlay } from "react-icons/fa";

interface GameModesProps {
  openSetGame: () => void;
}

const GameModes: React.FC<GameModesProps> = ({ openSetGame }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="w-full p-6 bg-secondary-bg rounded-[12px] border border-custom-border bg-gradient-to-br from-blue-500/10 to-purple-500/10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <FaGamepad className="text-4xl text-blue-400" />
          <div>
            <h2 className="text-xl font-bold text-white">Syllable Showdown!</h2>
            <p className="text-base text-secondary-text">Choose your challenge and start playing!</p>
          </div>
        </div>
        <FaTrophy className="text-4xl text-yellow-400" />
      </div>
      
      <div className="flex items-center justify-around mb-6">
        <div className="flex flex-col items-center">
          <FaCoins className="text-3xl text-yellow-400 mb-2" />
          <span className="text-sm text-secondary-text">Earn Points</span>
        </div>
        <div className="flex flex-col items-center">
          <FaMedal className="text-3xl text-blue-400 mb-2" />
          <span className="text-sm text-secondary-text">Climb Leaderboard</span>
        </div>
        <div className="flex flex-col items-center">
          <FaGamepad className="text-3xl text-green-400 mb-2" />
          <span className="text-sm text-secondary-text">Multiple Modes</span>
        </div>
      </div>

      <div className="flex justify-center">
        <Button
          className="flex px-8 gap-2 justify-center items-center h-12 bg-primary-bg hover:bg-primary-bg-hover text-white font-semibold rounded-full transition-all duration-300 ease-in-out transform hover:scale-105"
          onClick={openSetGame}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <FaPlay 
            className={`${isHovered ? "translate-x-1" : ""} transition-transform duration-300`}
          />
          <span className="text-lg font-semibold">Play Now</span>
        </Button>
      </div>
    </div>
  );
};

export default GameModes;