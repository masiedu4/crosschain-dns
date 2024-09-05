import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { TbSquareLetterAFilled } from "react-icons/tb";


const GameModes = ({ openSetGame }: { openSetGame: () => void }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div className="w-full flex gap-2">
      {/* normal game*/}
      <div className="w-full flex p-6 flex-col items-start gap-6 bg-secondary-bg rounded-[12px] border border-custom-border">
        <div className="gap-1 flex flex-col self-stretch items-start">
          <p className="text-xl font-semibold">Normal game</p>
          <p className="text-base font-medium text-secondary-text">
            Play for fun, 10x your skills and claim the leaderboard!
          </p>
        </div>

        <Button
          className="flex px-6 gap-2 justify-center items-center h-10 bg-primary-bg hover:bg-primary-bg-hover text-white font-semibold rounded-full transition-all duration-300 ease-in-out transform hover:scale-105"
          onClick={openSetGame}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <TbSquareLetterAFilled
            className={`${isHovered ? "rotate-180" : ""} transition-transform duration-300`}
          />
          <span className="text-base font-semibold">Play now</span>
        </Button>
      </div>
    </div>
  );
};

export default GameModes;
