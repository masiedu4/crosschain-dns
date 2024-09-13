import type { Metadata } from "next";
import { type ReactNode } from "react";
import Navbar from "./(components)/Navbar";
import { Toaster } from "@/components/ui/toaster";



export default async function GameLayout(props: { children: ReactNode }) {
  return (
    <main className="game">
      <Navbar />
      {props.children}
      <Toaster />
    </main>
  );
}
