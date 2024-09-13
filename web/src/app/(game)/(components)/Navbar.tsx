"use client";

import React from "react";
import Image from "next/image";

import { Menu, X } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import logoImg from "./logo.png";
import Connector from "./Wallet";
import Link from "next/link";

import { useAccount } from "wagmi";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean | undefined>(false);

  const { address } = useAccount();

  return (
    <div className="flex justify-between px-16 py-8">
      <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <DropdownMenuTrigger asChild>
          <div className="inline-flex p-3 items-center justify-center gap-1 rounded-full bg-[rgba(112,125,167,0.2)] backdrop-blur-[4px] cursor-pointer">
            {isMenuOpen ? (
              <X className="text-white rounded-full" />
            ) : (
              <Menu className="text-white rounded-full" />
            )}
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-[200px]  gap-2 items-start self-stretch bg-secondary-bg rounded-xl border border-custom-border shadow-lg"
          align="start"
        >
          <Link href={"/play"}>
            {" "}
            <DropdownMenuItem className="text-white px-4  hover:bg-primary-bg cursor-pointer ">
              Home
            </DropdownMenuItem>
          </Link>
          <Link href={`/stake/${address}`}>
            <DropdownMenuItem className=" text-white px-4 hover:bg-primary-bg cursor-pointer ">
              Stake
            </DropdownMenuItem>
          </Link>
          <Link href={`/play/${address}`}>
            <DropdownMenuItem className=" text-white px-4 hover:bg-primary-bg cursor-pointer ">
              Current game
            </DropdownMenuItem>
          </Link>
        </DropdownMenuContent>
      </DropdownMenu>
      <Image src={logoImg} alt="logo" width={150} height={80} priority />
      <div className="flex gap-2 items-center ">
        {" "}
        {/* <Help /> */}
        <Connector />{" "}
      </div>
    </div>
  );
};

export default Navbar;
