"use client";

import { useReadContract, useAccount } from "wagmi";
import { wagmiSolConfig } from "@/lib/wagmiSolConfig";
import { NFTCard } from "@/components/NFTCard";

export const OwnedNFTList = () => {
  const { address, isConnected } = useAccount();

  const { data: ownedTokenIds, refetch, isLoading: isLoadingTokens } = useReadContract({
    ...wagmiSolConfig,
    functionName: "getOwnedTokens",
    args: address ? [address] : undefined,
  }) as {
    data: bigint[] | undefined;
    refetch: () => void;
    isLoading: boolean;
  };

  const handleRefresh = () => {
    console.log("refetch");
    refetch();
  };

  if (!isConnected) {
    return (
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center m mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Connect Your Wallet</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Please connect your wallet to view your NFTs
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012 2v2M7 7h10" />
              </svg>
              My Plate NFT Collection
            </h2>
            <p className="text-purple-100 text-sm mt-1">
              {isLoadingTokens ? "Loading..." : `${ownedTokenIds?.length || 0} Plate NFTs owned`}
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isLoadingTokens}
            className="bg-white/20 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-xl transition-all duration-200 flex items-center gap-2"
          >
            <svg className={`w-4 h-4 ${isLoadingTokens ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {isLoadingTokens ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <svg className="animate-spin w-8 h-8 text-purple-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-gray-600 dark:text-gray-400">Loading your NFTs...</p>
            </div>
          </div>
        ) : !ownedTokenIds || !Array.isArray(ownedTokenIds) || ownedTokenIds.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No NFTs Found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              You don't own any license plate NFTs yet.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Start by creating your first NFT above!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(ownedTokenIds as bigint[]).map((tokenId: bigint) => (
              <NFTCard
                tokenId={tokenId.toString()}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};