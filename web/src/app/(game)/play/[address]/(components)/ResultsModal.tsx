import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FaStar, FaCheckCircle, FaTrophy, FaBolt, FaTimesCircle } from "react-icons/fa";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { GameResult } from "@/lib/types";
import { useRouter } from "next/navigation";
import { MdLeaderboard } from "react-icons/md";
import { BsTwitterX } from "react-icons/bs";
import { GiSpellBook } from "react-icons/gi";

interface ResultsModalProps {
  gameResult: GameResult;
  onClose: () => void;
}

const ResultsModal: React.FC<ResultsModalProps> = ({ gameResult, onClose }) => {
  const [isHovered, setIsHovered] = useState(false);
  const totalWordsFormed = gameResult.words_submitted.length;
  const correctWords = gameResult.words_won.length + gameResult.bonus_words_won.length;
  const totalScore = gameResult.points_earned + gameResult.bonus_points_earned;
  const invalidWords = totalWordsFormed - correctWords;

  const getWordStyle = (word: string) => {
    if (gameResult.original_words.includes(word)) return "bg-[#4E6AD7] border-yellow-400";
    if (gameResult.words_won.includes(word)) return "bg-green-500";
    return "bg-red-500";
  };

  const router = useRouter();

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-secondary-bg border border-custom-border">
        <div className="flex flex-col justify-center p-6 gap-6">
          <div className="flex justify-between items-center self-stretch">
            <h2 className="text-white text-xl font-bold flex items-center gap-2">
              <FaTrophy className="text-yellow-400" />
              Game Results
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4 items-start self-stretch bg-primary-bg/20 p-4 rounded-lg">
            <div className="flex flex-col items-start gap-1">
              <p className="text-secondary-text text-base font-medium flex items-center gap-2">
                <GiSpellBook className="text-blue-400" /> Total Words
              </p>
              <p className="text-white text-xl font-bold">{totalWordsFormed}</p>
            </div>
            <div className="flex flex-col items-start gap-1">
              <p className="text-secondary-text text-base font-medium flex items-center gap-2">
                <FaCheckCircle className="text-green-400" /> Correct Words
              </p>
              <p className="text-white text-xl font-bold">{correctWords}</p>
            </div>
            <div className="flex flex-col items-start gap-1">
              <p className="text-secondary-text text-base font-medium flex items-center gap-2">
                <FaBolt className="text-yellow-400" /> Total Score
              </p>
              <p className="text-white text-xl font-bold">{totalScore}</p>
            </div>
            <div className="flex flex-col items-start gap-1">
              <p className="text-secondary-text text-base font-medium flex items-center gap-2">
                <FaTimesCircle className="text-red-400" /> Invalid Words
              </p>
              <p className="text-white text-xl font-bold">{invalidWords}</p>
            </div>
          </div>

          <div className="flex flex-col gap-2 items-start self-stretch">
            <h3 className="text-white text-lg font-semibold">Your Words</h3>
            <div className="flex flex-wrap gap-2 p-4 items-center self-stretch border border-custom-border rounded-lg bg-primary-bg/10">
              {gameResult.words_submitted.map((word, index) => (
                <div
                  key={index}
                  className={`flex items-center border rounded-md ${getWordStyle(word)} py-1 px-2 transition-all duration-300 hover:scale-105`}
                >
                  <p className="text-white text-sm font-medium">{word.toUpperCase()}</p>
                  {gameResult.original_words.includes(word) && (
                    <FaStar className="text-yellow-400 ml-1" size={12} />
                  )}
                </div>
              ))}
            </div>
            <p className="text-base text-white flex items-center gap-2">
              <FaStar className="text-yellow-400" />
              {gameResult.additional_possible_words_count + gameResult.sample_possible_words.length} more words were possible!
            </p>
          </div>

          <div className="flex gap-3 items-center justify-center bg-primary-bg/20 p-3 rounded-lg">
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-green-500 rounded-sm"></div>
              <span className="text-white text-sm">Valid Words</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-[#4E6AD7] flex items-center justify-center rounded-sm">
                <FaStar className="text-yellow-400" size={8} />
              </div>
              <span className="text-white text-sm">Bonus Words</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-red-500 rounded-sm"></div>
              <span className="text-white text-sm">Invalid Words</span>
            </div>
          </div>

          <div className="flex gap-2 justify-center">
            <Button
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onClick={() => router.push("/play")}
              className="flex px-6 gap-2 justify-center items-center h-12 bg-primary-bg hover:bg-primary-bg-hover text-white font-semibold rounded-full transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              <MdLeaderboard
                className={`${isHovered ? "rotate-180" : ""} transition-transform duration-300`}
              />
              <span>View Leaderboard</span>
            </Button>
         
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResultsModal;