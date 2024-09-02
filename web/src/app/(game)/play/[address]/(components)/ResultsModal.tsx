import React from "react";
import { Button } from "@/components/ui/button";
import { FaStar } from "react-icons/fa";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { GameResult } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ResultsModalProps {
  gameResult: GameResult;
  onClose: () => void;
}

const ResultsModal: React.FC<ResultsModalProps> = ({ gameResult, onClose }) => {
  const totalWordsFormed = gameResult.words_submitted.length;
  const correctWords =
    gameResult.words_won.length + gameResult.bonus_words_won.length;
  const totalScore = gameResult.points_earned + gameResult.bonus_points_earned;
  const invalidWords = totalWordsFormed - correctWords;

  const getWordStyle = (word: string) => {
    if (gameResult.original_words.includes(word)) return "bg-[#4E6AD7]";
    if (gameResult.words_won.includes(word)) return "bg-green-500";
    return "bg-red-500";
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent
        className={cn(
          "sm:max-w-[600px] p-0 bg-secondary-bg",
          "border-none shadow-none" 
        )}
      >
        <div className=" flex flex-col justify-center p-6 border gap-6  bg-secondary-bg">
          <div className="flex justify-between items-center self-stretch">
            <p className="text-white text-xl font-semibold">Game summary</p>
          </div>

          <div className="flex flex-col gap-4 items-start self-stretch ">
            <div className="flex items-start gap-16 self-stretch">
              <div className="w-full flex flex-col items-start gap-1">
                <p className="text-secondary-text text-base font-medium">
                  Words formed
                </p>
                <p className="text-white text-sm font-medium">
                  {totalWordsFormed}
                </p>
              </div>
              <div className="w-full flex flex-col items-start gap-1">
                <p className="text-secondary-text text-base font-medium">
                  Correct words
                </p>
                <p className="text-white text-sm font-medium">{correctWords}</p>
              </div>
            </div>
            <div className="flex items-start gap-16 self-stretch">
              <div className="w-full flex flex-col items-start gap-1">
                <p className="text-secondary-text text-base font-medium">
                  Total score
                </p>
                <p className="text-white text-sm font-medium">{totalScore}</p>
              </div>
              <div className="w-full flex flex-col items-start gap-1">
                <p className="text-secondary-text text-base font-medium">
                  Invalid words
                </p>
                <p className="text-white text-sm font-medium">{invalidWords}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 items-start self-stretch">
            <div className="flex flex-wrap gap-2 p-6 items-center self-stretch border border-custom-border rounded-[8px]">
              {gameResult.words_submitted.map((word, index) => (
                <div
                  key={index}
                  className={`flex items-center border rounded-sm ${getWordStyle(word)} py-[2px] px-[4px]`}
                >
                  <p className="text-white text-sm">{word.toUpperCase()}</p>
                  {gameResult.original_words.includes(word) && (
                    <FaStar className="text-yellow-400 ml-1" size={12} />
                  )}
                </div>
              ))}
            </div>
            <p className="text-base text-white">
              There were{" "}
              {gameResult.additional_possible_words_count +
                gameResult.sample_possible_words.length}{" "}
              possible words you could have formed!
            </p>
          </div>

          <div className="flex gap-2 items-center">
            <div className="w-4 h-4 bg-green-500"></div>
            <span className="text-white text-sm">Valid words</span>
            <div className="w-4 h-4 bg-[#4E6AD7] flex items-center justify-center">
              <FaStar className="text-yellow-400" size={8} />
            </div>
            <span className="text-white text-sm">Bonus words</span>
            <div className="w-4 h-4 bg-red-500"></div>
            <span className="text-white text-sm">Invalid words</span>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={onClose}
              className="flex px-6  gap-1.5 justify-center rounded-[100px] items-center w-24 h-10 bg-[#4E6AD7]"
            >
              Play Again
            </Button>
            <Button className="flex px-6 gap-1.5 justify-center border rounded-[100px] border-custom-border items-center w-24 h-10 bg-secondary-bg">
              Share on X
            </Button>
            <Button className="flex px-6 gap-1.5 justify-center border rounded-[100px] border-custom-border items-center  w-24 h-10 bg-secondary-bg">
              Leaderboard
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResultsModal;
