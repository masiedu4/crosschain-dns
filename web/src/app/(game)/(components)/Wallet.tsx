import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAccount, useDisconnect, useConnect } from "wagmi";
import { FaWallet, FaHistory, FaCoins, FaGamepad } from "react-icons/fa";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { injected } from "wagmi/connectors";
import { Address } from "viem";
import { Unlink } from "lucide-react";

import { truncateAddress } from "@/lib/utils";
import { useUserProfileStore } from "@/store/useUserProfileStore";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import HistorySection from "./History";
import USDCBalance from "./Balance";

const Connected = ({ address }: { address: Address | undefined }) => {
  const { disconnect } = useDisconnect();
  const { chain } = useAccount();
  const { isLoading, getProcessedGameHistory, getWithdrawals, getEarnings, usdcBalance } =
    useUserProfileStore();
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
  const withdrawalHistory = getWithdrawals();
  const earningHistory = getEarnings();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-[450px] flex p-6 flex-col items-start gap-6 rounded-xl bg-secondary-bg shadow-lg"
    >
      <div className="flex justify-between items-center w-full bg-primary-bg/20 p-4 rounded-lg">
        <div className="flex gap-2 items-center">
          <FaWallet className="text-yellow-400" />
          <span className="text-white font-semibold">
            {truncateAddress(address)}
          </span>
          <span className="text-gray-400">|</span>
          <span className="text-white">{chain?.name}</span>
        </div>
        <Button
          onClick={() => disconnect()}
          variant="ghost"
          size="sm"
          className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
        >
          <Unlink className="w-4 h-4 mr-2" />
          Disconnect
        </Button>
      </div>

      {/* <USDCBalance balance={usdcBalance} /> */}

      <HistorySection
        title="Games Played"
        Icon={FaGamepad}
        data={gameHistory}
        columns={["Timestamp", "Points", "Mode"]}
      />

      <HistorySection
        title="Withdrawal History"
        Icon={FaHistory}
        data={withdrawalHistory}
        columns={["Date", "Amount", "Status"]}
      />

      <HistorySection
        title="Earning History"
        Icon={FaCoins}
        data={earningHistory}
        columns={["Date", "Amount", "Source"]}
      />
    </motion.div>
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
    <DropdownMenu open={isConnectorOpen} onOpenChange={setIsConnectorOpen}>
      <DropdownMenuTrigger asChild>
        <Button className="inline-flex gap-2 rounded-full py-2 px-4 bg-primary-bg hover:bg-primary-bg-hover transition-colors duration-300">
          {status !== "connected" ? (
            <>
              <FaWallet className="text-yellow-400" />
              <span>Connect Wallet</span>
            </>
          ) : (
            <>
              <FaWallet className="text-yellow-400" />
              <span>{truncateAddress(address)}</span>
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="p-0 bg-secondary-bg rounded-xl border border-custom-border shadow-lg"
        align="end"
        sideOffset={5}
      >
        <DropdownMenuItem className="p-0 focus:bg-transparent">
          {status === "connected" ? (
            <Connected address={address} />
          ) : (
            <div className="p-6 flex flex-col items-center">
              <FaWallet className="text-4xl text-yellow-400 mb-4" />
              <p className="text-white text-lg mb-4">
                Connect your wallet to start playing!
              </p>
              <Button
                onClick={() => connect({ connector: injected() })}
                className="inline-flex gap-2 rounded-full py-2 px-6 bg-primary-bg hover:bg-primary-bg-hover transition-colors duration-300"
              >
                Connect Wallet
              </Button>
            </div>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Wallet;
