"use client";

import { Button } from "@/components/ui/button";
import Game from "./Game";
import { useState } from "react";
import { FaKeyboard, FaClock, FaStar, FaTrophy, FaGamepad, FaPlus, FaInfoCircle, FaCoins } from "react-icons/fa";
import { IoMdRefresh } from "react-icons/io";
import { useRouter } from 'next/navigation';
import { TbSquareLetterAFilled } from "react-icons/tb";
import { FaCircleInfo } from "react-icons/fa6";

type GameDataNullable = {
  game_id: number | null;
  scrambled_letters: string | null;
  duration: number | null;

};

type GameData = {
  game_id: number;
  scrambled_letters: string;
  duration: number;
  is_staked: boolean;
};

const GameWrapper: React.FC<GameDataNullable> = ({
  game_id,
  scrambled_letters,
  duration,

  
}) => {
  const router = useRouter();
  const [gameStarted, setGameStarted] = useState(false);

  const gameData: GameDataNullable = {
    game_id,
    scrambled_letters,
    duration,

  };

  const isGameDataValid = (data: GameDataNullable): data is GameData => {
    return data.game_id !== null && 
           data.scrambled_letters !== null && 
           data.duration !== null 
  };

  const GameRules = ({ is_staked }: { is_staked: boolean }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <div className="w-[650px] flex flex-col justify-center p-6 border rounded-[12px] gap-6 border-custom-border bg-secondary-bg">
        <div className="flex  gap-2 items-center self-stretch">
          <FaCircleInfo className="w-6 text-yellow-400" />
          <p className="text-white text-xl font-semibold">Game Rules</p>
        </div>

        <div className="flex  text-lg flex-col gap-5">
          <div className="flex items-start gap-4">
            {is_staked ? (
              <FaTrophy className="text-2xl text-yellow-400 mt-1" />
            ) : (
              <FaGamepad className="text-2xl text-blue-400 mt-1" />
            )}
            <p className="text-white">
              {is_staked 
                ? "This is a staked game. All points accrued will make you eligible for prize pool rewards!"
                : "This is a normal game. Points earned will not qualify for prize pool rewards, but you can still compete for high scores!"}
            </p>
          </div>

          <div className="flex items-start gap-4">
            <FaKeyboard className="text-2xl text-blue-400 mt-1" />
            <p className="text-white">
              Form as many words as possible using the given letters. Each letter can be used multiple times.
            </p>
          </div>

          <div className="flex items-start gap-4">
            <FaClock className="text-2xl text-yellow-400 mt-1" />
            <p className="text-white">
              You have {duration} seconds to find as many words as you can. The timer starts as soon as you begin the game.
            </p>
          </div>

          <div className="flex items-start gap-4">
          <FaCoins className="text-2xl text-green-400 mt-1" />
          <p className="text-white">
            Earn 3 points for each word you form. Special words from the original set earn 6 bonus points each!
          </p>
        </div>

          <div className="flex items-start gap-4">
            <FaStar className="text-2xl text-green-400 mt-1" />
            <p className="text-white">
            Look out for the special words! They're hidden in the scrambled letters and worth double points.
            </p>
          </div>

          <div className="flex items-start gap-4">
            <IoMdRefresh className="text-2xl text-purple-400 mt-1" />
            <p className="text-white">
            Stuck? You can shuffle the letters anytime to see new word possibilities.
            </p>
          </div>

        </div>

        <div className="flex justify-center mt-4">
        
        <Button
          className="flex px-6 gap-2 justify-center items-center h-10 bg-primary-bg hover:bg-primary-bg-hover text-white font-semibold rounded-full transition-all duration-300 ease-in-out transform hover:scale-105"
          onClick={() => setGameStarted(true)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <TbSquareLetterAFilled
            className={`${isHovered ? "rotate-180" : ""} transition-transform duration-300`}
          />
          <span className="text-base font-semibold">Start</span>
        </Button>
        </div>
      </div>
    );
  };

  const NoGameCreated = () => {
    const router = useRouter();
    const [isHovered, setIsHovered] = useState(false);
  
    return (
      <div className="w-[600px] flex flex-col justify-center p-6 border rounded-[12px] gap-6 border-custom-border bg-secondary-bg text-white">
        <div className="flex justify-between items-center self-stretch">
          <h2 className="text-2xl font-semibold flex items-center gap-3">
            <FaGamepad className="text-yellow-400" />
            No Active Game
          </h2>
        </div>
        <p className="text-lg flex items-start gap-3">
          <FaInfoCircle className="text-blue-400 mt-1 flex-shrink-0" />
          <span>Ready to challenge yourself? Create a new word game and start forming words to earn points!</span>
        </p>
        <div className="flex justify-center mt-4">
          <Button 
            onClick={() => router.push('/play')}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="flex px-6 gap-2 justify-center items-center h-10 bg-primary-bg hover:bg-primary-bg-hover text-white font-semibold rounded-full transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            <FaPlus className={`${isHovered ? 'rotate-180' : ''} transition-transform duration-300`} />
            <span>New Game</span>
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="w-[1000px] mx-auto flex flex-col p-20 gap-2 justify-center items-center">
      {isGameDataValid(gameData) ? (
        gameStarted ? (
          <Game {...gameData} />
        ) : (
          <GameRules is_staked={gameData.is_staked} />
        )
      ) : (
        <NoGameCreated />
      )}
    </div>
  );
};

export default GameWrapper;