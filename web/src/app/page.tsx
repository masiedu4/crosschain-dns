'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaChartBar, FaCoins, FaRocket, FaBookOpen, FaCubes } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { TbSquareLetterAFilled } from 'react-icons/tb';

 import logoImg from "./(game)/(components)/logo.png";

const App: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="min-h-screen bg-[#131823] text-white">
      {/* header */}
      <div className='flex flex-col justify-center items-center pt-8 pb-16 '>
      <Image src={logoImg} alt="logo" width={150} height={80} priority />
      </div>
      <div className="container mx-auto px-4">
        {/* Hero Section with background */}
        <div className="relative bg-[#3A4C86] py-20 overflow-hidden border-b border-custom-border rounded-lg ">
          <div className="absolute inset-0">
            <svg width="100%" height="100%" className="text-white opacity-30">
              <text x="5%" y="15%" fontSize="120" fill="#FFD700">A</text>
              <text x="90%" y="20%" fontSize="140" fill="#4CAF50">D</text>
              <text x="8%" y="85%" fontSize="160" fill="#2196F3">V</text>
              <text x="85%" y="90%" fontSize="130" fill="#FF5722">E</text>
            </svg>
          </div>
          <div className="flex flex-col justify-center items-center relative z-10">
            <div className="text-center max-w-3xl">
              <h1 className="text-5xl font-bold mb-4 text-white">Master the Scramble.<br />Win Big Rewards.</h1>
              <p className="text-xl mb-8 text-blue-200">Test your word formation skills in a fast-paced, decentralized game where every move counts.</p>
              <Link href="/play" target='_blank'>
                <Button 
                  className="flex mx-auto px-8 gap-2 justify-center items-center h-12 bg-primary-bg hover:bg-primary-bg-hover text-white font-semibold rounded-full transition-all duration-300 ease-in-out transform hover:scale-105"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <TbSquareLetterAFilled
                    className={`${isHovered ? "rotate-180" : ""} transition-transform duration-300`}
                  />
                  <span className='text-center'>Get started</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Key Features Section */}
        <section className="mb-16 mt-16">
          <h2 className="text-3xl font-bold mb-8 text-center text-white">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-secondary-bg border-custom-border">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <FaBookOpen className="mr-2 text-purple-400" />
                  Extensive Word Database
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-secondary-text">Challenge yourself with a vast array of words from various categories and difficulty levels.</p>
              </CardContent>
            </Card>
            <Card className="bg-secondary-bg border-custom-border">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <FaChartBar className="mr-2 text-green-400" />
                  Real-time leaderboards
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-secondary-text">Track your progress and see how you rank against other players instantly.</p>
              </CardContent>
            </Card>
            <Card className="bg-secondary-bg border-custom-border relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-yellow-500 text-black px-3 py-1 rounded-bl-lg font-semibold">
                Coming Soon
              </div>
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <FaCoins className="mr-2 text-yellow-400" />
                  Earn rewards
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-secondary-text">Enter the staking pool and compete for USDC rewards.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center text-white">Why Play Milky Adverb?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <FaCubes className="text-4xl mb-4 text-blue-400" />
              <h3 className="text-xl font-semibold mb-2">Fully Decentralized</h3>
              <p className="text-secondary-text">Built on Cartesi, Linux-powered rollups that brings mainstream convenience to dApps.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <FaRocket className="text-4xl mb-4 text-green-400" />
              <h3 className="text-xl font-semibold mb-2">Fast-Paced Gameplay</h3>
              <p className="text-secondary-text">Experience thrilling word-forming action in quick, exciting rounds.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <FaCoins className="text-4xl mb-4 text-yellow-400" />
              <h3 className="text-xl font-semibold mb-2">Rewarding Experience</h3>
              <p className="text-secondary-text">Earn points and climb the leaderboards. Soon, compete for USDC prizes!</p>
            </div>
          </div>
        </section>

        {/* FAQs Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center text-white">FAQs</h2>
          <div className="space-y-6">
            <Card className="bg-secondary-bg border-custom-border">
              <CardHeader>
                <CardTitle className="text-white">What's the difference between Normal and Staked mode?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-secondary-text">Normal mode allows you to play for free and compete on the leaderboard. Staked mode, coming soon, will allow you to compete for USDC rewards from a prize pool.</p>
              </CardContent>
            </Card>
            <Card className="bg-secondary-bg border-custom-border">
              <CardHeader>
                <CardTitle className="text-white">How do I earn points?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-secondary-text">You earn 3 points for each valid word formed. Special words are worth 6 points each. The more words you form, the higher your score!</p>
              </CardContent>
            </Card>
            <Card className="bg-secondary-bg border-custom-border">
              <CardHeader>
                <CardTitle className="text-white">What are special words?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-secondary-text">Special words are predetermined words hidden within the scrambled letters. They're worth double points and add an extra challenge to the game.</p>
              </CardContent>
            </Card>
            <Card className="bg-secondary-bg border-custom-border">
              <CardHeader>
                <CardTitle className="text-white">Can I play multiple times?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-secondary-text">Yes! You can play as many times as you like in Normal mode. In Staked mode (coming soon), your best performances will count towards your ranking.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Footer with background */}
        <footer className="relative bg-[#3A4C86] py-16 overflow-hidden border-t border-custom-border rounded-lg">
          <div className="absolute inset-0">
            <svg width="100%" height="100%" className="text-white opacity-30">
              <text x="5%" y="15%" fontSize="120" fill="#FFD700">M</text>
              <text x="90%" y="20%" fontSize="140" fill="#4CAF50">I</text>
              <text x="8%" y="85%" fontSize="160" fill="#2196F3">L</text>
              <text x="85%" y="90%" fontSize="130" fill="#FF5722">K</text>
            </svg>
          </div>
          <div className="relative z-10">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4 text-white">Stay updated</h2>
              <p className="mb-6 text-blue-200">Follow us on X for the latest updates.</p>
              <div className="flex justify-center space-x-4">
                <Link href={'https://x.com/MichaelAsiedu_'} target='_blank'> 
                <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-black">
                  <FaXTwitter className="mr-2" />
                  Follow on X
                </Button>
                </Link>
      
              </div>
              <p className="mt-8 text-sm text-blue-200 italic">Created with ❤️ and probably too much coffee by Michael Asiedu and Fiifi The Boy.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;