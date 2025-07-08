"use client";

import { useState } from "react";
import { useAccount, useReadContract } from "wagmi";
import { factoryConfig } from "@/lib/wagmiSolConfig";
import { AuctionCard } from "@/components/AuctionCard";
import { CreateAuctionModal } from "@/components/CreateAuctionModal";
import { Header } from "@/components/Header";

// Mock data for demonstration
const mockAuctions = [
  {
    address: "0x1234567890123456789012345678901234567890",
    startPrice: "100000000000000000", // 0.1 ETH in wei
    maxPrice: "1000000000000000000", // 1 ETH in wei
    endAt: Math.floor(Date.now() / 1000) + 86400, // 24 hours from now
    finished: false,
    winner: "0x0000000000000000000000000000000000000000",
    plateID: "ق أ ح 123",
    imageUrl: "https://jade-electrical-earwig-826.mypinata.cloud/ipfs/QmUxdxVCqjz3XwVxHBMEqZ7ewAG3Wd9Ed6359ggu6JHNdF"
  },
  {
    address: "0x2345678901234567890123456789012345678901",
    startPrice: "200000000000000000", // 0.2 ETH in wei
    maxPrice: "2000000000000000000", // 2 ETH in wei
    endAt: Math.floor(Date.now() / 1000) + 172800, // 48 hours from now
    finished: false,
    winner: "0x0000000000000000000000000000000000000000",
    plateID: "ق أ ح 456",
    imageUrl: "https://jade-electrical-earwig-826.mypinata.cloud/ipfs/QmVQJVRccaPxRN1eSmwzitoqd3GNSPwBTfkMZxmAagwnMJ"
  },
  {
    address: "0x3456789012345678901234567890123456789012",
    startPrice: "50000000000000000", // 0.05 ETH in wei
    maxPrice: "500000000000000000", // 0.5 ETH in wei
    endAt: Math.floor(Date.now() / 1000) + 259200, // 72 hours from now
    finished: false,
    winner: "0x0000000000000000000000000000000000000000",
    plateID: "ق أ ح 789",
    imageUrl: "https://jade-electrical-earwig-826.mypinata.cloud/ipfs/QmdZxq7ATHzYDn7feSKYgTJP9psfzifVAes936vfATCDof"
  },
  {
    address: "0x4567890123456789012345678901234567890123",
    startPrice: "300000000000000000", // 0.3 ETH in wei
    maxPrice: "3000000000000000000", // 3 ETH in wei
    endAt: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago (finished)
    finished: true,
    winner: "0x9876543210987654321098765432109876543210",
    plateID: "ق أ ح 001",
    imageUrl: "https://jade-electrical-earwig-826.mypinata.cloud/ipfs/Qmb6vZqJCSqproJVe4KcLTMgdhKANqq8nF8PS8P6wWRvqT"
  },
  {
    address: "0x5678901234567890123456789012345678901234",
    startPrice: "150000000000000000", // 0.15 ETH in wei
    maxPrice: "1500000000000000000", // 1.5 ETH in wei
    endAt: Math.floor(Date.now() / 1000) + 432000, // 120 hours from now
    finished: false,
    winner: "0x0000000000000000000000000000000000000000",
    plateID: "ق أ ح 999",
    imageUrl: "https://jade-electrical-earwig-826.mypinata.cloud/ipfs/QmYhg6bHgVX2bFumzBD5jiXzNv9ejU54BGGNCqpwq7rfUw"
  },
 /* {
    address: "0x6789012345678901234567890123456789012345",
    startPrice: "80000000000000000", // 0.08 ETH in wei
    maxPrice: "800000000000000000", // 0.8 ETH in wei
    endAt: Math.floor(Date.now() / 1000) + 518400, // 144 hours from now
    finished: false,
    winner: "0x0000000000000000000000000000000000000000",
    plateID: "ق أ ح 777",
    imageUrl: ""
  }*/
];  

export default function AuctionPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [useMockData, setUseMockData] = useState(true); // Toggle for mock data
  const { isConnected } = useAccount();

  // Read deployed auctions from the factory contract
  const { data: auctionsList, refetch, isLoading } = useReadContract({
    ...factoryConfig,
    functionName: "deployedAuctions",
  }) as {
    data: string[] | undefined | [] ;
    refetch: () => void;
    isLoading: boolean;
  };

  // Safe access to auctionsList with fallback
  const safeAuctionsList = auctionsList || [];
  
  // Use mock data if enabled and no real auctions exist
  const displayAuctions = useMockData && safeAuctionsList.length === 0 ? mockAuctions : safeAuctionsList;
  const isUsingMockData = useMockData && safeAuctionsList.length === 0;

  const handleCreateAuction = () => {
    if (!isConnected) {
      alert("Please connect your wallet first");
      return;
    }
    setShowCreateModal(true);
  };

  const onAuctionCreated = () => {
    // Refetch the auctions list after creating a new auction
    refetch();
    setShowCreateModal(false);
  };

  // Filter active auctions
  const activeAuctions = isUsingMockData 
    ? mockAuctions.filter(auction => !auction.finished)
    : displayAuctions;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-300">
      <div className="p-6 max-w-7xl mx-auto">
      <Header />
        
        {/* Auction Header */}
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-emerald-500 to-green-600 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Plate Auction House
                </h1>
                <p className="text-emerald-100 text-lg mt-1">
                  Buy and sell exclusive Egyptian license plate NFTs
                </p>
              </div>
              <div className="flex items-center gap-4">
                {/* Mock Data Toggle */}
                <div className="flex items-center gap-2 bg-white/20 rounded-lg px-3 py-2">
                  <span className="text-white text-sm">Mock Data</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={useMockData}
                      onChange={(e) => setUseMockData(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <button
                  onClick={handleCreateAuction}
                  disabled={!isConnected}
                  className="bg-white/20 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl transition-all duration-200 flex items-center gap-2 font-semibold"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create Auction
                </button>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="p-6 bg-gradient-to-r from-gray-50 to-white dark:from-gray-700 dark:to-gray-800">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {activeAuctions.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Active Auctions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {isUsingMockData ? mockAuctions.length : safeAuctionsList.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Auctions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {isUsingMockData ? mockAuctions.filter(a => !a.finished).length : safeAuctionsList.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">With Bids</div>
              </div>
            </div>
            
            {/* Mock Data Indicator */}
            {isUsingMockData && (
              <div className="mt-4 text-center">
                <div className="inline-flex items-center gap-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 px-3 py-1 rounded-full text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Showing demo data
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Auctions Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Live Auctions
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              Live bidding
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 animate-pulse">
                  <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : displayAuctions.length === 0 ? (
            <div>
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No Active Auctions
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Be the first to create an auction for your license plate NFT!
                </p>
                <button
                  onClick={handleCreateAuction}
                  disabled={!isConnected}
                  className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Create First Auction
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayAuctions.map((auction, index) => (
                isUsingMockData && typeof auction === 'object' ? (
                  <MockAuctionCard key={auction.address} auction={auction} />
                ) : (
                  <AuctionCard key={typeof auction === 'string' ? auction : String(index)} unitAddress={auction as string} />
                )
              ))}
            </div>
          )}
        </div>

        {/* Create Auction Modal */}
        {showCreateModal && (
          <CreateAuctionModal
            onClose={() => setShowCreateModal(false)}
            onAuctionCreated={onAuctionCreated}
          />
        )}
      </div>
    </div>
  );
}

// Mock Auction Card Component
function MockAuctionCard({ auction }: { auction: {
  address: string;
  startPrice: string;
  maxPrice: string;
  endAt: number;
  finished: boolean;
  winner: string;
  plateID: string;
  imageUrl: string;
} }) {
  const timeLeft = auction.endAt - Math.floor(Date.now() / 1000);
  const isFinished = auction.finished || timeLeft <= 0;
  
  // Calculate auction duration (assuming 7 days max)
  const totalDuration = 7 * 24 * 60 * 60; // 7 days in seconds
  const timeProgress = Math.max(0, Math.min(100, ((totalDuration - timeLeft) / totalDuration) * 100));
  
  const formatTime = (seconds: number) => {
    if (seconds <= 0) return "Finished";
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const formatEther = (wei: string) => {
    return (parseInt(wei) / 1e18).toFixed(3);
  };

  const getTimeBarColor = () => {
    if (isFinished) return 'bg-red-500';
    if (timeProgress > 80) return 'bg-red-500';
    if (timeProgress > 60) return 'bg-orange-500';
    if (timeProgress > 40) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-shadow">
      <div className="relative">
        <img
          src={auction.imageUrl}
          alt={auction.plateID}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 right-4">
          <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
            isFinished 
              ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200'
              : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200'
          }`}>
            {isFinished ? 'Finished' : 'Active'}
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {auction.plateID}
        </h3>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Start Price</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {formatEther(auction.startPrice)} ETH
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Max Price</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {formatEther(auction.maxPrice)} ETH
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Time Left</span>
            <span className={`font-semibold ${
              isFinished ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'
            }`}>
              {formatTime(timeLeft)}
            </span>
          </div>
          
          {/* Time Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
              <span>Progress</span>
              <span>{isFinished ? '100%' : `${Math.round(timeProgress)}%`}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ease-out ${getTimeBarColor()}`}
                style={{ width: `${isFinished ? 100 : timeProgress}%` }}
              >
                <div className="h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>Started</span>
              <span>{isFinished ? 'Ended' : 'Ending'}</span>
            </div>
          </div>
          
          {isFinished && auction.winner !== "0x0000000000000000000000000000000000000000" && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Winner</span>
              <span className="font-semibold text-gray-900 dark:text-white text-xs">
                {auction.winner.slice(0, 6)}...{auction.winner.slice(-4)}
              </span>
            </div>
          )}
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            disabled={isFinished}
            className={`w-full py-2 px-4 rounded-lg font-semibold transition-colors ${
              isFinished
                ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-emerald-500 hover:bg-emerald-600 text-white'
            }`}
          >
            {isFinished ? 'Auction Ended' : 'Place Bid'}
          </button>
        </div>
      </div>
    </div>
  );
}