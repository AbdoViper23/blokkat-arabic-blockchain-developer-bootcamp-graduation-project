"use client";

import { useState, useEffect } from "react";
import { useAccount, useReadContract, usePublicClient } from "wagmi";
import { nftConfig } from "@/lib/wagmiSolConfig";
import { decodePlateCode, fetchMetadataFromURI, NFTMetadata } from "@/lib/nftUtils";

interface AuctionItem {
  tokenId: string;
  seller: string;
  startingPrice: bigint;
  currentBid: bigint;
  highestBidder: string;
  endTime: bigint;
  isActive: boolean;
  metadata?: {
    name: string;
    description: string;
    image: string;
    plate_code: string;
    letters: string;
    numbers: string;
  };
}

interface CreateAuctionModalProps {
  onClose: () => void;
  onAuctionCreated: (auction: Omit<AuctionItem, 'id'>) => void;
}

interface NFTOption {
  tokenId: string;
  metadata?: {
    name: string;
    description: string;
    image: string;
    plate_code: string;
    letters: string;
    numbers: string;
  };
}

export const CreateAuctionModal = ({ onClose, onAuctionCreated }: CreateAuctionModalProps) => {
  const [selectedTokenId, setSelectedTokenId] = useState("");
  const [startingPrice, setStartingPrice] = useState("");
  const [duration, setDuration] = useState("24"); // hours
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ownedNFTs, setOwnedNFTs] = useState<NFTOption[]>([]);
  const [isLoadingNFTs, setIsLoadingNFTs] = useState(true);
  const { address } = useAccount();
  const publicClient = usePublicClient();

  // Fetch user's owned NFTs
  const { data: ownedTokenIds, isLoading: isLoadingTokens } = useReadContract({
    ...nftConfig,
    functionName: "getOwnedTokens",
    args: address ? [address] : undefined,
  }) as {
    data: bigint[] | undefined;
    isLoading: boolean;
  };

  // Load NFT metadata
  useEffect(() => {
    const loadNFTData = async () => {
      if (!ownedTokenIds || isLoadingTokens || !publicClient) {
        setOwnedNFTs([]);
        setIsLoadingNFTs(false);
        return;
      }

      setIsLoadingNFTs(true);
      const tokenIdsArray = Array.from(ownedTokenIds);
      const tokenURIPromises = tokenIdsArray.map(tokenId =>
        publicClient.readContract({
          ...nftConfig,
          functionName: "tokenURI",
          args: [BigInt(tokenId)],
        })
      );

      const tokenURIs = await Promise.all(tokenURIPromises);

      const nftOptions: NFTOption[] = await Promise.all(
        tokenIdsArray.map(async (tokenId, i) => {
          let metadata: NFTMetadata | undefined;
          try {
            if (typeof tokenURIs[i] === 'string' && tokenURIs[i]) {
              metadata = await fetchMetadataFromURI(tokenURIs[i]);
              if (metadata && metadata.plate_code) {
                const { letters, numbers } = decodePlateCode(metadata.plate_code);
                metadata.letters = letters;
                metadata.numbers = numbers;
              }
            }
          } catch (e) {
            metadata = undefined;
          }
          return {
            tokenId: tokenId.toString(),
            metadata,
          };
        })
      );

      setOwnedNFTs(nftOptions);
      setIsLoadingNFTs(false);
    };

    loadNFTData();
  }, [ownedTokenIds, isLoadingTokens, publicClient]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedTokenId || !startingPrice || !duration) {
      alert("Please fill in all fields");
      return;
    }

    if (parseFloat(startingPrice) <= 0) {
      alert("Starting price must be greater than 0");
      return;
    }

    try {
      setIsSubmitting(true);

      const selectedNFT = ownedNFTs.find(nft => nft.tokenId === selectedTokenId);
      const endTime = Date.now() + (parseInt(duration) * 60 * 60 * 1000); // Convert hours to milliseconds

      // Here you would call the smart contract to create the auction
      console.log("Creating auction:", {
        tokenId: selectedTokenId,
        startingPrice: BigInt(parseFloat(startingPrice) * 1e18),
        endTime: BigInt(endTime)
      });

      // Simulate auction creation
      const newAuction: Omit<AuctionItem, 'id'> = {
        tokenId: selectedTokenId,
        seller: address!,
        startingPrice: BigInt(parseFloat(startingPrice) * 1e18),
        currentBid: BigInt(parseFloat(startingPrice) * 1e18),
        highestBidder: "0x0000000000000000000000000000000000000000",
        endTime: BigInt(endTime),
        isActive: true,
        metadata: selectedNFT?.metadata
      };

      onAuctionCreated(newAuction);
      
    } catch (error) {
      console.error("Error creating auction:", error);
      alert("Error creating auction");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedNFT = ownedNFTs.find(nft => nft.tokenId === selectedTokenId);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-green-600 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Auction
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-emerald-100 mt-2">List your license plate NFT for auction</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* NFT Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Select NFT to Auction
            </label>
            
            {isLoadingNFTs ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full"></div>
                <span className="ml-2 text-gray-600 dark:text-gray-400">Loading your NFTs...</span>
              </div>
            ) : ownedNFTs.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <p className="text-gray-500 dark:text-gray-400">You don't own any NFTs to auction</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                {ownedNFTs.map((nft) => (
                  <div
                    key={nft.tokenId}
                    onClick={() => setSelectedTokenId(nft.tokenId)}
                    className={`relative group border-2 rounded-xl p-0 cursor-pointer transition-all shadow-sm hover:shadow-lg
                      ${selectedTokenId === nft.tokenId
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-emerald-300 bg-white dark:bg-gray-800'}
                    `}
                  >
                    {/* لوحة السيارة */}
                    <div className="flex flex-col items-center py-4 px-2">
                      <div className="w-32 h-20 rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 flex flex-col items-center justify-center shadow-inner border-4 border-white dark:border-gray-700 relative overflow-hidden">
                        {/* صورة اللوحة إذا وجدت */}
                        {nft.metadata?.image ? (
                          <img
                            src={nft.metadata.image}
                            alt={nft.metadata.name}
                            className="w-full h-full object-cover rounded-lg"
                            onError={e => (e.currentTarget.style.display = 'none')}
                          />
                        ) : null}
                        {/* شكل اللوحة إذا لم توجد صورة */}
                        <div className={`absolute inset-0 flex flex-col items-center justify-center ${nft.metadata?.image ? 'hidden' : ''}`}>
                          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 mb-1 border border-white/30">
                            <div className="text-2xl font-bold text-white mb-1 font-mono tracking-widest">
                              {nft.metadata?.numbers}
                            </div>
                            <div className="text-lg font-bold text-white tracking-widest" style={{ fontFamily: 'serif' }}>
                              {nft.metadata?.letters}
                            </div>
                          </div>
                          <span className="text-[10px] text-white opacity-80">Egyptian Plate</span>
                        </div>
                      </div>
                      <div className="mt-2 text-center">
                        <h4 className="font-semibold text-gray-900 dark:text-white text-base truncate">
                          {nft.metadata?.name || `Token #${nft.tokenId}`}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {nft.metadata?.letters} - {nft.metadata?.numbers}
                        </p>
                      </div>
                    </div>
                    {/* علامة التحديد */}
                    {selectedTokenId === nft.tokenId && (
                      <div className="absolute top-2 right-2 bg-emerald-500 rounded-full p-1 shadow-lg">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Selected NFT Preview */}
          {selectedNFT && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Selected NFT Preview</h3>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                  <div className="text-white text-sm font-bold text-center">
                    <div>{selectedNFT.metadata?.numbers}</div>
                    <div>{selectedNFT.metadata?.letters}</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {selectedNFT.metadata?.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Token ID: {selectedNFT.tokenId}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Starting Price */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Starting Price
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={startingPrice}
                onChange={(e) => setStartingPrice(e.target.value)}
                placeholder="0.00"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
                ETH
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Minimum starting price is 0.01 ETH
            </p>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Auction Duration
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              required
            >
              <option value="1">1 Hour</option>
              <option value="6">6 Hours</option>
              <option value="12">12 Hours</option>
              <option value="24">24 Hours</option>
              <option value="48">2 Days</option>
              <option value="72">3 Days</option>
              <option value="168">1 Week</option>
            </select>
          </div>

          {/* Summary */}
          {selectedTokenId && startingPrice && (
            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-4">
              <h3 className="font-semibold text-emerald-800 dark:text-emerald-200 mb-2">
                Auction Summary
              </h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">NFT:</span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {selectedNFT?.metadata?.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Starting Price:</span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {startingPrice} ETH
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {duration} {parseInt(duration) === 1 ? 'Hour' : 'Hours'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !selectedTokenId || !startingPrice || ownedNFTs.length === 0}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Creating...
                </div>
              ) : (
                'Create Auction'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};