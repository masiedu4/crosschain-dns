import React from "react";
import { Button } from "@/components/ui/button";
import { TbSquareLetterAFilled } from "react-icons/tb";
import { FaTrophy } from "react-icons/fa6";

const GameModes = ({ openSetGame }: { openSetGame: () => void }) => {
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
          className="bg-primary-bg gap-1 rounded-[100px]"
          onClick={openSetGame}
        >
          <TbSquareLetterAFilled className="text-white" />
          <span className="text-base font-semibold">Play now</span>
        </Button>
      </div>
    </div>
  );
};

export default GameModes;