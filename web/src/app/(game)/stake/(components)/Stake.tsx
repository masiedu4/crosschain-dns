"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  FaCoins,
  FaTrophy,
  FaArrowRight,
  FaInfoCircle,
  FaChartLine,
} from "react-icons/fa";
import { truncateAddress } from "@/lib/utils";

const StakePage = () => {
  const [stakeAmount, setStakeAmount] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const userBalance = 100; // Replace with actual user balance

  const stakeInfo = {
    StakeAmount: "10 USDC",
    StakePeriod: "5 days",
    PoolSize: "5000 USDC",
    ActiveStakers: 150,
    PoolClosesIn: "2023-12-31 23:59:59",
  };

  const recentWinners = [
    { address: "0x1234...5678", reward: 500 },
    { address: "0x9876...5432", reward: 300 },
    { address: "0xabcd...efgh", reward: 200 },
  ];

  const handleStake = () => {
    // Implement staking logic
    console.log("Staking:", stakeAmount);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-8 space-y-12">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold text-white mb-8 flex items-center gap-3"
      >
        <FaCoins className="text-yellow-400 text-5xl" />
        Milky Challenge
      </motion.h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="col-span-2 bg-gradient-to-br from-secondary-bg to-primary-bg/30 rounded-2xl p-8 shadow-xl"
        >
          <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
            <FaChartLine className="text-blue-400" />
            Stake Analytics
          </h2>
          <div className="grid grid-cols-2 gap-6">
            {Object.entries(stakeInfo).map(([key, value], index) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="bg-primary-bg/20 rounded-xl p-4 flex flex-col justify-between"
              >
                <p className="text-secondary-text text-sm">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </p>
                <p className="text-white text-2xl font-bold mt-2">{value}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-gradient-to-br from-secondary-bg to-primary-bg/30 rounded-2xl p-8 shadow-xl"
        >
          <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
            <FaCoins className="text-yellow-400" />
            Stake Now
          </h2>
          <div className="space-y-6">
            <Input
              type="number"
              value={stakeAmount}
              onChange={(e) => setStakeAmount(e.target.value)}
              className=" border-custom-border"
            />
            <Button
              onClick={handleStake}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="flex mx-auto px-8 gap-3  justify-center items-center h-12 bg-primary-bg hover:bg-primary-bg-hover text-white font-semibold rounded-full transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              <span>{userBalance > 0 ? "Stake now" : "Deposit Funds"}</span>
              <FaArrowRight
                className={`transition-transform duration-300 ${isHovered ? "translate-x-1" : ""}`}
              />
            </Button>
            <p className="text-sm text-secondary-text text-center">
              Your balance:{" "}
              <span className="text-white font-semibold">
                {userBalance} USDC
              </span>
            </p>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-gradient-to-br from-secondary-bg to-primary-bg/30 rounded-2xl p-8 shadow-xl"
        >
          <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
            <FaTrophy className="text-yellow-400" />
            Recent Winners
          </h2>
          <div className="space-y-4">
            {recentWinners.map((winner, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="flex justify-between items-center bg-primary-bg/20 p-4 rounded-xl"
              >
                <span className="text-white font-medium">
                  {truncateAddress(winner.address)}
                </span>
                <span className="text-green-400 font-bold text-lg">
                  {winner.reward} USDC
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="bg-gradient-to-br from-secondary-bg to-primary-bg/30 rounded-2xl p-8 shadow-xl"
        >
          <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
            <FaInfoCircle className="text-blue-400" />
            Staking Rules
          </h2>
          <ul className="space-y-3 text-white">
            {[
              `Stake amount: ${stakeInfo.StakeAmount}`,
              `Stake period: ${stakeInfo.StakePeriod}`,
              "Rewards based on game performance",
              "Top 10% share 50% of prize pool",
              "Next 20% share 30% of prize pool",
              "Remaining players share 20%",
              "Early unstaking incurs penalties",
            ].map((rule, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="flex items-center gap-2"
              >
                <FaInfoCircle className="text-blue-400 flex-shrink-0" />
                <span>{rule}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default StakePage;
