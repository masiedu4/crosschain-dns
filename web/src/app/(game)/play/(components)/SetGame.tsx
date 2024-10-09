"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useWriteInputBoxAddInput, useWatchInputBoxInputAddedEvent } from "@/hooks/generated";
import { Address, stringToHex } from "viem";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { FaKickstarter, FaClock, FaExclamationTriangle, FaGamepad, FaBolt, FaHourglassHalf, FaFont } from "react-icons/fa";
import { Loader2 } from "lucide-react";

const SetGame = ({ onClose }: { onClose: () => void }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEventEmitted, setIsEventEmitted] = useState(false);
  const { address } = useAccount();
  const { toast } = useToast();
  const router = useRouter();
  const { writeContractAsync, isSuccess } = useWriteInputBoxAddInput();
  const [duration, setDuration] = useState(40);
  const durations = [40, 60, 80];

  const handleSliderChange = (value: number[]) => {
    setDuration(value[0]);
  };

  const handleInputAdded = useCallback((logs: any[]) => {
    const relevantLog = logs.find(log => log.args.sender === address);
    if (relevantLog) {
      setIsEventEmitted(true);
      toast({
        title: "Input Added",
        description: "Your game input has been added to the blockchain.",
        variant: "success",
      });
    }
  }, [address, toast]);

  useWatchInputBoxInputAddedEvent({
    onLogs: handleInputAdded,
  });

  const handleCreateGame = async () => {
    const data = { operation: "start_game", duration: duration };
  
    setIsSubmitting(true);

    if (address == undefined) {
      toast({
        title: "You are not connected",
        description: "Please connect your wallet and try again!",
        variant: "warning",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      toast({
        title: "Creating game",
        description: "Please confirm the transaction in your wallet...",
        variant: "info",
      });

      await writeContractAsync({
        args: [
          "0xab7528bb862fb57e8a2bcd567a2e929a0be56a5e" as Address,
          stringToHex(JSON.stringify(data)),
        ],
      });

      toast({
        title: "Submitting",
        description: "Waiting for the transaction to be confirmed...",
        variant: "info",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `${error}`,
        variant: "warning",
      });
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (isEventEmitted) {
      toast({
        title: "Fetching game details",
        description: "Please wait while we prepare your game...",
        variant: "info",
      });

      const timer = setTimeout(() => {
        router.push(`/play/${address}`);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isEventEmitted, address, router, toast]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="bg-black bg-opacity-50 absolute inset-0 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="justify-center w-[650px] border border-custom-border bg-secondary-bg p-8 rounded-[16px] flex flex-col items-start gap-8 relative z-10 shadow-2xl">
        <div className="gap-6 flex-col flex items-start self-stretch">
          <div className="flex justify-between items-center self-stretch">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <FaGamepad className="text-yellow-400 text-3xl" />
              Game Setup
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:text-secondary-text transition-colors duration-200"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="flex flex-col items-start gap-4 self-stretch bg-primary-bg/10 p-6 rounded-lg">
            <div className="flex flex-col gap-2 self-stretch">
              <p className="text-lg text-white font-medium flex items-center gap-2">
                <FaHourglassHalf className="text-blue-400" />
                Game Duration
              </p>
              <Slider
                value={[duration]}
                durations={durations}
                defaultValue={[40]}
                max={80}
                min={40}
                step={20}
                onValueChange={handleSliderChange}
              />
              <p className="text-sm text-secondary-text text-center mt-2">
                Selected duration: {duration} seconds
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5 text-base text-white bg-primary-bg/5 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Game Rules</h3>
          <div className="flex items-start gap-3">
            <FaClock className="text-blue-400 mt-1 flex-shrink-0 text-xl" />
            <p>Shorter durations provide more letters and potential words, increasing the challenge and excitement!</p>
          </div>
          <div className="flex items-start gap-3">
            <FaExclamationTriangle className="text-yellow-400 mt-1 flex-shrink-0 text-xl" />
            <p>Creating a game initiates a blockchain transaction. Ensure your wallet is connected and has sufficient funds.</p>
          </div>
          <div className="flex items-start gap-3">
            <FaBolt className="text-green-400 mt-1 flex-shrink-0 text-xl" />
            <p>Each game is unique! The letter set changes every time, so be ready for a fresh challenge with each play.</p>
          </div>
          <div className="flex items-start gap-3">
            <FaFont className="text-purple-400 mt-1 flex-shrink-0 text-xl" />
            <p>Only words between 3 and 7 letters are accepted. Challenge yourself to find the perfect word length!</p>
          </div>
        </div>

        <Button
          className="flex px-8 gap-3 mx-auto justify-center items-center h-12 bg-primary-bg hover:bg-primary-bg-hover text-white font-semibold rounded-full transition-all duration-300 ease-in-out transform hover:scale-105"
          onClick={handleCreateGame}
          disabled={isSubmitting}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {isSubmitting ? (
            <Loader2 className="w-6 h-6 text-white animate-spin" />
          ) : (
            <>
              <FaKickstarter
                className={`${isHovered ? "rotate-180" : ""} transition-transform duration-300 text-xl`}
              />
              <span className="text-lg text-white">Create Game</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default SetGame;