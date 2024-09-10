"use client";

import { Button } from "@/components/ui/button";
import Game from "./Game";
import { useState } from "react";
import { FaKeyboard, FaClock, FaStar, FaTrophy, FaGamepad, FaPlus, FaInfoCircle, FaCoins, FaBrain, FaChartLine } from "react-icons/fa";
import { IoMdRefresh } from "react-icons/io";
import { useRouter } from 'next/navigation';
import { TbSquareLetterAFilled } from "react-icons/tb";
import { FaCircleInfo } from "react-icons/fa6";
import { motion } from 'framer-motion';


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
  
    const gameTypes = [
      { icon: FaGamepad, text: "Normal Game", description: "Play for free and compete on the leaderboard" },
      { icon: FaCoins, text: "Stake & Play", description: "Stake tokens for a chance to win prizes" },
    ];
  
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-[600px] flex flex-col justify-center p-8 border rounded-[16px] gap-6 border-custom-border bg-secondary-bg text-white shadow-lg"
      >
        <div className="flex justify-between items-center self-stretch mb-2">
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <FaGamepad className="text-yellow-400" />
            No Active Game
          </h2>
        </div>
        
        <div className="bg-primary-bg/10 p-6 rounded-lg">
          <p className="text-lg flex items-start gap-3 mb-4">
            <FaInfoCircle className="text-blue-400 mt-1 flex-shrink-0 text-xl" />
            <span>You don't have an active game. Ready to challenge yourself? Start a new word game now!</span>
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="flex flex-col items-center text-center p-4 bg-primary-bg/20 rounded-lg">
              <FaBrain className="text-3xl mb-2 text-yellow-400" />
              <p className="text-sm">Challenge your vocabulary</p>
            </div>
            <div className="flex flex-col items-center text-center p-4 bg-primary-bg/20 rounded-lg">
              <FaClock className="text-3xl mb-2 text-yellow-400" />
              <p className="text-sm">Race against time</p>
            </div>
            <div className="flex flex-col items-center text-center p-4 bg-primary-bg/20 rounded-lg">
              <FaTrophy className="text-3xl mb-2 text-yellow-400" />
              <p className="text-sm">Compete for high scores</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-400/20 to-purple-500/20 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-3">Choose Your Game Type</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {gameTypes.map((type, index) => (
              <div key={index} className="flex flex-col items-center text-center p-4 bg-primary-bg/30 rounded-lg transition-all duration-300 hover:bg-primary-bg/40">
                <type.icon className="text-3xl mb-2 text-yellow-400" />
                <p className="text-base font-semibold mb-1">{type.text}</p>
                <p className="text-sm">{type.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex flex-col items-center mt-4">
          <Button 
            onClick={() => router.push('/play')}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="flex px-8 gap-3 justify-center items-center h-12 bg-primary-bg hover:bg-primary-bg-hover text-white font-semibold rounded-full transition-all duration-300 ease-in-out transform hover:scale-105 text-lg"
          >
            <FaPlus className={`${isHovered ? 'rotate-180' : ''} transition-transform duration-300`} />
            <span>New Game</span>
          </Button>
          <p className="text-secondary-text mt-4 text-sm">Join thousands of players already enjoying our word games!</p>
        </div>
      </motion.div>
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