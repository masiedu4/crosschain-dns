"use client";

import { Button } from "@/components/ui/button";
import Game from "./Game";
import { useState } from "react";
import { FaKeyboard, FaClock, FaStar, FaBan, FaTrophy, FaGamepad } from "react-icons/fa";
import { IoMdRefresh } from "react-icons/io";
import { useRouter } from 'next/navigation';
import { FaRegCirclePlay } from "react-icons/fa6";
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
    return (
      <div className="w-[600px] flex flex-col justify-center p-6 border rounded-[12px] gap-6 border-custom-border bg-secondary-bg">
        <div className="flex justify-between items-center self-stretch">
          <p className="text-white text-xl font-semibold">Game Rules</p>
        </div>

        <div className="flex flex-col gap-4">
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
            <FaStar className="text-2xl text-green-400 mt-1" />
            <p className="text-white">
              Bonus points are awarded for finding special words. Keep an eye out for these high-value targets!
            </p>
          </div>

          <div className="flex items-start gap-4">
            <IoMdRefresh className="text-2xl text-purple-400 mt-1" />
            <p className="text-white">
              You can shuffle the letters at any time if you're stuck. This might help you see new word possibilities.
            </p>
          </div>

          <div className="flex items-start gap-4">
            <FaBan className="text-2xl text-red-400 mt-1" />
            <p className="text-white">
              Proper nouns, abbreviations, and hyphenated words are not allowed. Only standard dictionary words count.
            </p>
          </div>
        </div>

        <div className="flex justify-center mt-4">
          <Button 
            onClick={() => setGameStarted(true)}
            className="flex px-6 gap-1.5 justify-center border rounded-[100px] border-custom-border items-center w-24 h-10 bg-primary-bg"
          >

            Start 
          </Button>
        </div>
      </div>
    );
  };

  const NoGameCreated = () => {
    return (
      <div className="w-[600px] flex flex-col justify-center p-6 border rounded-[12px] gap-6 border-custom-border bg-secondary-bg text-white">
        <div className="flex justify-between items-center self-stretch">
          <h2 className="text-2xl font-semibold">No Game Created</h2>
        </div>
        <p className="text-lg">
          You have not created a game yet. Click the button below to create a new game.
        </p>
        <div className="flex justify-center mt-4">
          <Button 
            onClick={() => router.push('/play')}
            className="flex px-6 gap-1.5 justify-center border rounded-[100px] border-custom-border items-center w-24 h-10 bg-secondary-bg"
          >
            Create New Game
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