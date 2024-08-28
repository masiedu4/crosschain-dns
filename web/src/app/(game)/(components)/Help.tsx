"use client";

import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { CircleHelp } from "lucide-react";

const Help = () => {
  const [isOpen, setIsOpen] = useState<boolean | undefined>(false);
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <div className="inline-flex p-3 items-center justify-center gap-1 rounded-full bg-[rgba(31,35,49,0.20)] backdrop-blur-[4px] cursor-pointer">
          <CircleHelp className="text-white" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[200px]  gap-2 items-start self-stretch bg-secondary-bg rounded-xl border border-custom-border shadow-lg"
        align="start"
      >
        <DropdownMenuItem className="text-white px-4  hover:bg-primary-bg cursor-pointer ">
          Home
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Help;
