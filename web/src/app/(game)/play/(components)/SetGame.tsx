"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useWriteInputBoxAddInput } from "@/hooks/generated";
import { Address, stringToHex } from "viem";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { FaKickstarter } from "react-icons/fa";
import { Loader2 } from "lucide-react";

const SetGame = ({ onClose }: { onClose: () => void }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { address } = useAccount();
  const { toast } = useToast();
  const router = useRouter();
  const { writeContractAsync, isPending, isSuccess } =
    useWriteInputBoxAddInput();
  const [duration, setDuration] = useState(20);
  const durations = [20, 30, 40, 50, 60];

  const handleSliderChange = (value: number[]) => {
    setDuration(value[0]);
  };

  const handleCreateGame = async () => {
    const data = { operation: "start_game", duration: duration };
  
    setIsSubmitting(true)

    if (address == undefined) {
      toast({
        title: "You are not connected",
        description: "Please connect your wallet and try again!",
        variant: "warning",
      });
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
    } catch (error) {
      toast({
        title: "Error",
        description: `${error}`,
        variant: "warning",
      });
      setIsSubmitting(false)
    }
  };

  const directToPlay = async () => {
    try {
      toast({
        title: "Game created",
        description: "Waiting to fetch game data...",
        variant: "info",
      });

      // Wait for 5 seconds
      await new Promise((resolve) => setTimeout(resolve, 5000));

      toast({
        title: "Success",
        description: "Game data fetched successfully! Redirecting to play...",
        variant: "success",
      });

      router.push(`/play/${address}`);
    } catch (error) {
      toast({
        title: "Error",
        description: `${error}`,
        variant: "destructive",
      });
    }
  };

  React.useEffect(() => {
    if (isSuccess) {
      directToPlay();
    }
  }, [isSuccess]);
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="bg-black bg-opacity-50 absolute inset-0"
        onClick={onClose}
      ></div>
      <div className="justify-center w-[500px] border border-custom-border bg-secondary-bg p-6 rounded-[12px] flex flex-col items-start gap-8 relative z-10">
        <div className="gap-6 flex-col flex items-start self-stretch">
          <div className="flex justify-between items-center self-stretch">
            <p className="text-xl font-semibold">Game setup</p>
            <button
              onClick={onClose}
              className="text-white hover:text-secondary-text"
            >
              <X />
            </button>
          </div>

          <div className="flex flex-col items-start gap-4 self-stretch">
            <div className="flex flex-col gap-1 self-stretch">
              <p className="text-base text-secondary-text font-medium">
                Duration
              </p>
              <Slider
                value={[duration]}
                durations={durations}
                defaultValue={[30]}
                max={60}
                min={20}
                step={10}
                onValueChange={handleSliderChange}
              />
            </div>
          </div>
        </div>

        <Button
          className="flex px-6 gap-2 justify-center items-center h-10 bg-primary-bg hover:bg-primary-bg-hover text-white font-semibold rounded-full transition-all duration-300 ease-in-out transform hover:scale-105"
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
                className={`${isHovered ? "rotate-180" : ""} transition-transform duration-300`}
              />
              <span className="text-base text-white">Start game</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default SetGame;
