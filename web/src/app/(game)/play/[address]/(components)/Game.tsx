import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useUserProfileStore } from "@/store/useUserProfileStore";
import {
  FaBackspace,
  FaHourglassEnd,
  FaExclamationTriangle,
} from "react-icons/fa";
import { Shuffle } from "lucide-react";
import { useWriteInputBoxAddInput } from "@/hooks/generated";
import { useToast } from "@/components/ui/use-toast";
import { stringToHex } from "viem";
import { useRouter } from "next/navigation";
import { fetchNoticeByGameId } from "@/data/query";
import { GameResult } from "@/lib/types";
import ResultsModal from "./ResultsModal";

type GameData = {
  game_id: number;
  scrambled_letters: string;
  duration: number;
};

const Game: React.FC<GameData> = ({ game_id, scrambled_letters, duration }) => {
  const { writeContractAsync, isPending, isSuccess } =
    useWriteInputBoxAddInput();

  const { toast } = useToast();

  const router = useRouter();

  const [letters, setLetters] = useState<string[]>([]);
  const [currentWord, setCurrentWord] = useState<string>("");
  const [words, setWords] = useState<string[]>([]);
  const [submittedWords, setSubmittedWords] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(duration);
  const [gameEnded, setGameEnded] = useState<boolean>(false);
  const [showExhaustedDialog, setShowExhaustedDialog] =
    useState<boolean>(false);
  const [gameResult, setGameResult] = useState<GameResult | null>(null);
  const [showResultsModal, setShowResultsModal] = useState(false);

  const { profile } = useUserProfileStore();

  useEffect(() => {
    const storedAttempt = localStorage.getItem(`gameAttempt_${game_id}`);
    if (storedAttempt === "true") {
      setShowExhaustedDialog(true);
    } else {
      setLetters(scrambled_letters.split(""));
    }
  }, [game_id, scrambled_letters]);

  useEffect(() => {
    if (showExhaustedDialog) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setGameEnded(true);
          localStorage.setItem(`gameAttempt_${game_id}`, "true");
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showExhaustedDialog, game_id]);

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (gameEnded || showExhaustedDialog) return;

      if (event.key === "Enter") {
        if (currentWord.length > 0) {
          setWords((prev) => [...prev, currentWord]);
          setCurrentWord("");
        }
      } else if (event.key === "Backspace") {
        setCurrentWord((prev) => prev.slice(0, -1));
      } else if (letters.includes(event.key.toLowerCase())) {
        setCurrentWord((prev) => prev + event.key.toLowerCase());
      }
    },
    [currentWord, letters, gameEnded, showExhaustedDialog]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  const handleSubmit = async () => {
    const data = { operation: "end_game", wordsSubmitted: words };

    try {
      await writeContractAsync({
        args: [
          "0xab7528bb862fb57e8a2bcd567a2e929a0be56a5e",
          stringToHex(JSON.stringify(data)),
        ],
      });

      toast({
        title: "Submitting answers",
        description: "Please hold on!",
        variant: "info",
      });

      // Wait for a short period to allow the notice to be processed
      await new Promise((resolve) => setTimeout(resolve, 10000));

      // Fetch the notice for the current game
      const result = await fetchNoticeByGameId(game_id);

      if (result) {
        toast({
          title: `You scored ${result.bonus_points_earned + result.points_earned}`,
          variant: "success",
        });
        setGameResult(result);
        setShowResultsModal(true);
      } else {
        toast({
          title: "Error",
          description: "Could not find game results. Please try again later.",
          variant: "warning",
        });
      }
    } catch (error) {
      console.error("Error submitting game:", error);
      toast({
        title: "Error",
        description: `${error}`,
        variant: "destructive",
      });
    }
  };

  const handleShuffle = () => {
    if (!gameEnded && !showExhaustedDialog) {
      setLetters((prev) => [...prev].sort(() => Math.random() - 0.5));
    }
  };

  const handleLetterClick = (letter: string) => {
    if (!gameEnded && !showExhaustedDialog) {
      setCurrentWord((prev) => prev + letter);
    }
  };

  const handleBackspace = () => {
    if (!gameEnded && !showExhaustedDialog) {
      setCurrentWord((prev) => prev.slice(0, -1));
    }
  };

  const handleEnter = () => {
    if (!gameEnded && !showExhaustedDialog && currentWord.length > 0) {
      setWords((prev) => [...prev, currentWord]);
      setCurrentWord("");
    }
  };

  if (showExhaustedDialog) {
    return (
      <Dialog open={true} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-[425px] bg-secondary-bg border border-custom-border">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
              <FaExclamationTriangle className="text-red-500" />
              Attempt Exhausted
            </DialogTitle>
            <DialogDescription>
              <div className="pt-4 text-white">
                <p className="mb-4">
                  You have already attempted this game. Unfortunately, you
                  cannot play this game again.
                </p>
                <p className="mb-4">
                  But don't worry! There are always new challenges waiting for
                  you.
                </p>
                <Button
                  onClick={() => router.push("/play")}
                  className="w-full flex justify-center items-center gap-2 rounded-full bg-primary-bg hover:bg-blue-600 transition-colors"
                >
                  <span className="text-white font-semibold">
                    Start a New Game
                  </span>
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="py-8 px-24 rounded-[12px] flex flex-col gap-[34px] border border-custom-border bg-secondary-bg">
      <div className="flex flex-col items-center gap-4 self-stretch">
        <div className="flex flex-col items-center gap-1">
          <p className="text-4xl text-white font-semibold">
            00:{timeLeft.toString().padStart(2, "0")}
          </p>
        </div>

        <div className="w-full flex h-[140px] p-4 border bg-[#1F2331] rounded-[4px] border-custom-border gap-[11px] flex-wrap justify-center items-start overflow-y-auto">
          {words.map((word, index) => (
            <p
              key={index}
              className="text-sm font-semibold text-white uppercase"
            >
              {word}
            </p>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 self-stretch ">
        <div className="w-full flex items-start justify-center gap-2">
          <div className="bg-[#1F2331] rounded-md w-64 h-10 border border-custom-border py-[7px] px-2 min-w-[100px] text-center uppercase">
            {currentWord}
          </div>
          <Button
            className="px-3 bg-[#4E6AD7] justify-center items-center rounded-md"
            onClick={handleBackspace}
            disabled={gameEnded}
          >
            <FaBackspace width={32} height={32} />
          </Button>
        </div>

        <div className="flex flex-col items-center gap-4 self-stretch">
          <div className="flex gap-2.5 self-stretch items-center justify-center flex-wrap">
            {letters.map((letter, index) => (
              <Button
                key={index}
                className={`w-12 h-12 flex flex-col items-center justify-center rounded-[4px] ${
                  currentWord.includes(letter) ? "bg-[#263052]" : "bg-[#4E6AD7]"
                }`}
                onClick={() => handleLetterClick(letter)}
                disabled={gameEnded}
              >
                <p className="text-3xl uppercase font-bold">{letter}</p>
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Button
              className="flex px-3 gap-1.5 justify-center items-center rounded-[4px] w-24 h-10 bg-[#4E6AD7]"
              onClick={handleShuffle}
              disabled={gameEnded}
            >
              <Shuffle width={30} height={30} />
            </Button>
            <Button
              className=" flex px-3 gap-1.5 justify-center items-center rounded-[4px] w-24 h-10 bg-[#4E6AD7]"
              onClick={handleEnter}
              disabled={gameEnded}
            >
              <p className="text-xl font-semibold text-white">ENTER</p>
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={gameEnded && !showResultsModal} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-[425px] bg-secondary-bg border border-custom-border">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
              <FaHourglassEnd className="text-yellow-400" />
              Game Over
            </DialogTitle>
            <DialogDescription>
              <div className="pt-4 text-white">
                <p className="mb-4">
                  Your time is up! Are you ready to see how well you did?
                </p>
                <Button
                  className="w-full flex justify-center items-center gap-2 rounded-full bg-primary-bg hover:bg-blue-600 transition-colors"
                  onClick={handleSubmit}
                >
                  <span className="text-white font-semibold">View Results</span>
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {showResultsModal && gameResult && (
        <ResultsModal
          gameResult={gameResult}
          onClose={() => {
            setShowResultsModal(false);
            router.push("/play");
          }}
        />
      )}
    </div>
  );
};

export default Game;