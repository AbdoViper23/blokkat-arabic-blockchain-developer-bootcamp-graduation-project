"use client";

import { MintNFT } from "@/components/MintNFT";
import { SearchNFT } from "@/components/SearchNFT";
import { Header } from "@/components/Header";
import {OwnedNFTList} from "@/components/OwnedNFTList";

export default function Home() { 

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-300">
      <div className="p-6 max-w-7xl mx-auto">
        <Header />
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <SearchNFT />
          <MintNFT />
        </div>
        <OwnedNFTList />
        {/* Auction Section -ToDo [remove and add new Auction page]- */}
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-500 to-green-600 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Plate Auction
                </h2>
                <p className="text-emerald-100 text-sm mt-1">Buy and sell exclusive license plates</p>
              </div>
              <div className="bg-white/20 px-4 py-2 rounded-xl">
                <span className="text-white text-sm font-medium">Coming Soon</span>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Auction Platform</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                Soon you'll be able to participate in exciting auctions for premium license plate NFTs. 
                Stay tuned for exclusive drops and rare collections!
              </p>
            </div>
          </div>
        </div> 
      </div>
    </div>
  );
}