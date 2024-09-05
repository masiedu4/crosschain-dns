"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAccount, useDisconnect, useConnect } from "wagmi";
import { FaWallet } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { injected } from "wagmi/connectors";
import { Address } from "viem";
import { Unlink } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { convertUnixToDate, truncateAddress } from "@/lib/utils";
import { ProcessedGameRecord } from "@/lib/types";
import { useUserProfileStore } from "@/store/useUserProfileStore";
import { useToast } from "@/components/ui/use-toast";

const Connected = ({ address }: { address: Address | undefined }) => {
  const { disconnect } = useDisconnect();
  const { chain } = useAccount();

  const { isLoading, getProcessedGameHistory } = useUserProfileStore();
  const { toast } = useToast();

  useEffect(() => {
    if (isLoading) {
      toast({
        title: "Fetching user profile",
        description: "Please wait while we load your profile data...",
        variant: "info",
      });
    }
  }, [isLoading, toast]);

  const gameHistory = getProcessedGameHistory();

  return (
    <div className="w-[450px] flex p-6 flex-col items-start gap-6 rounded-xl  bg-secondary-bg">
      <div className="flex gap-16 justify-between items-center w-full">
        <div className="flex gap-2 items-center">
          <FaWallet className="text-white" />
          <span className="text-white ">{truncateAddress(address)}</span>
          <span className="text-white ">|</span>
          <span className="text-white ">{chain?.name}</span>
        </div>
        <Unlink
          onClick={() => disconnect()}
          className="text-red-600 w-4 h-4 cursor-pointer"
        />
      </div>

      <div className="gap-2 flex flex-col items-start self-stretch">
        <p className="text-base text-white font-semibold">Game History({gameHistory.length})</p>
        <div className="w-full flex flex-col p-4 gap-2 rounded-[8px] border border-custom-border bg-secondary-bg">
          {gameHistory.length > 0 ? (
            <div className="h-[200px] overflow-y-auto custom-scrollbar">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="bg-secondary-bg sticky top-0">
                      Timestamp
                    </TableHead>
                    <TableHead className="bg-secondary-bg sticky top-0">
                      Points
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {gameHistory.map((game: ProcessedGameRecord) => (
                    <TableRow key={game.timestamp}>
                      <TableCell className="text-sm text-white">
                        {convertUnixToDate(game.timestamp)}
                      </TableCell>
                      <TableCell className="text-sm text-white">
                        {game.total_points}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-base text-white">No game history available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

const Wallet = () => {
  const [isConnectorOpen, setIsConnectorOpen] = useState<boolean>(false);

  const { address, status } = useAccount();

  const { connect } = useConnect();

  const { fetchProfile, resetProfile, isLoading } = useUserProfileStore();

  const { toast } = useToast();

  useEffect(() => {
    if (status === "connected" && address) {
      fetchProfile(address);
    } else {
      resetProfile();
    }
  }, [status, address, fetchProfile, resetProfile]);

  useEffect(() => {
    if (isLoading) {
      toast({
        title: "Fetching user profile",
        description: "Please wait while we load your profile data...",
        variant: "info",
      });
    }
  }, [isLoading, toast]);

  return (
    <>
      {status !== "connected" ? (
        <Button
          onClick={() => connect({ connector: injected() })}
          className="inline-flex gap-2 rounded-[100px] py-2 px-4 bg-secondary-bg"
        >
          <FaWallet className="text-white" /> <span>Connect</span>
        </Button>
      ) : (
        <DropdownMenu open={isConnectorOpen} onOpenChange={setIsConnectorOpen}>
          <DropdownMenuTrigger asChild>
            {isConnectorOpen ? (
              <Button className="cursor-pointer inline-flex gap-2 rounded-[100px] py-2 px-4 bg-secondary-bg">
                <IoMdClose className="text-white" />
                <span>Close</span>
              </Button>
            ) : (
              <Button className="cursor-pointer inline-flex gap-2 rounded-[100px] py-2 px-4 bg-secondary-bg">
                <FaWallet className="text-white" />
                <span>{truncateAddress(address)}</span>
              </Button>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className=" p-0 bg-secondary-bg rounded-xl border border-custom-border shadow-lg"
            align="end"
            sideOffset={5}
          >
            <DropdownMenuItem className="p-0 focus:bg-transparent">
              <Connected address={address} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
};

export default Wallet;
