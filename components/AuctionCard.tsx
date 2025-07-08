"use client";

import { useState, useEffect } from "react";
import { useAccount, useReadContract } from "wagmi";
import { nftConfig, auctionABI } from "@/lib/wagmiSolConfig";
import { NFTMetadata ,fetchMetadataFromURI , decodePlateCode } from "@/lib/nftUtils";

interface AuctionCardProps {
  unitAddress: string;
}

interface AuctionInfo {
  startPrice: string;
  maxPrice: string;
  endAt: string;
  startAt: string;
  finished: string;
  winner: string;
  plateID: string;
}

export const AuctionCard = ({ unitAddress }: AuctionCardProps) => {
  const [timeLeft, setTimeLeft] = useState("");
  const [bidAmount, setBidAmount] = useState("");
  const [showBidInput, setShowBidInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [plateMetadata, setPlateMetadata] = useState<NFTMetadata | null>(null);
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(false);
  
  const { address, isConnected } = useAccount();

  const { data: auctionData, isLoading: isLoadingAuction } = useReadContract({
    address: unitAddress as `0x${string}`,
    abi: auctionABI,
    functionName: "getAuctionInfo",
  }) as {
    data: [bigint, bigint, bigint, bigint, boolean, string, string] | undefined;
    isLoading: boolean;
  };

  const auctionInfo: AuctionInfo | null = auctionData ? {
    startPrice: auctionData[0].toString(),
    maxPrice: auctionData[1].toString(),
    endAt: auctionData[2].toString(),
    startAt: auctionData[3].toString(),
    finished: auctionData[4].toString(),
    winner: auctionData[5],
    plateID: auctionData[6]
  } : null;

  // get tokenID using plateID
  const { data: tokenID, isLoading: isLoadingTokenID } = useReadContract({
    ...nftConfig,
    functionName: "getPlateId",
    args: auctionInfo ? [auctionInfo.plateID] : undefined,
  }) as {
    data: bigint | undefined;
    isLoading: boolean;
  };

  // get tokenURI using  tokenID
  const { data: tokenURI, isLoading: isLoadingURI } = useReadContract({
    ...nftConfig,
    functionName: "tokenURI",
    args: tokenID ? [tokenID] : undefined,
  }) as {
    data: string | undefined;
    isLoading: boolean;
  };

  // دالة لفك تشفير plate code - تم نقلها إلى nftUtils
  // const decodePlateCode = ...

  // تحميل metadata من tokenURI باستخدام utility function
  useEffect(() => {
    const loadMetadata = async () => {
      if (!tokenURI) return;
      
      setIsLoadingMetadata(true);
      try {
        const metadata = await fetchMetadataFromURI(tokenURI as string);
        
        if (metadata && metadata.plate_code) {
          const { letters, numbers } = decodePlateCode(metadata.plate_code);
          metadata.letters = letters;
          metadata.numbers = numbers;
        }        
        setPlateMetadata(metadata || null);
      } catch (error) {
        console.error('Error loading metadata:', error);
      } finally {
        setIsLoadingMetadata(false);
      }
    };

    loadMetadata();
  }, [tokenURI]);

  // حساب الوقت المتبقي باستخدام utility function
  useEffect(() => {
    if (!auctionInfo || auctionInfo.finished === 'true') return;

    const updateTimeLeft = () => {
      const endTime = parseInt(auctionInfo.endAt);
      const formattedTime = (endTime.toString);// ToDo
      setTimeLeft(formattedTime.toString);
    };

    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [auctionInfo]);

  // دالة إرسال المزايدة
  const handleBid = async () => {
    if (!bidAmount || !isConnected) return;
    
    setIsSubmitting(true);
    try {
      // هنا سيتم استدعاء دالة المزايدة في العقد الذكي
      console.log('Placing bid:', bidAmount, 'ETH');
      // TODO: استدعاء دالة bid في العقد الذكي
      
    } catch (error) {
      console.error('Error placing bid:', error);
    } finally {
      setIsSubmitting(false);
      setShowBidInput(false);
      setBidAmount("");
    }
  };

  // عرض loading state
  if (isLoadingAuction || isLoadingTokenID || isLoadingURI || isLoadingMetadata) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="bg-gray-300 dark:bg-gray-600 h-48 rounded-lg mb-4"></div>
          <div className="bg-gray-300 dark:bg-gray-600 h-4 rounded mb-2"></div>
          <div className="bg-gray-300 dark:bg-gray-600 h-4 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  // التأكد من وجود البيانات
  if (!auctionInfo || !plateMetadata) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400">No auction data available</p>
        </div>
      </div>
    );
  }

  const isAuctionEnded = auctionInfo.finished === 'true' || timeLeft === "Ended";
  const startPriceEth = (auctionInfo.startPrice);// ToDo
  const currentBidEth = (auctionInfo.maxPrice);// ToDo
  const formattedWinner = (auctionInfo.winner);// ToDo

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-all hover:shadow-xl">
      {/* صورة اللوحة */}
      <div className="relative h-48 bg-gradient-to-br from-blue-400 to-purple-500">
        {plateMetadata?.image ? (
          <img
            src={plateMetadata.image}
            alt={plateMetadata.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-4 shadow-lg border border-white/30">
              <div className="text-center text-white">
                <div className="text-2xl font-bold text-white mb-1 font-mono">
                  {plateMetadata?.numbers || 'Loading...'}
                </div>
                <div className="text-lg text-white font-bold" style={{ fontFamily: 'serif' }}>
                  {plateMetadata?.letters || 'Loading...'}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* حالة المزاد */}
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            isAuctionEnded 
              ? 'bg-red-500 text-white' 
              : 'bg-green-500 text-white'
          }`}>
            {isAuctionEnded ? 'Ended' : 'Live'}
          </span>
        </div>
      </div>

      {/* تفاصيل المزاد */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {plateMetadata.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {plateMetadata.letters} - {plateMetadata.numbers}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500 dark:text-gray-400">Current Bid</p>
            <p className="text-lg font-bold text-emerald-600">
              {currentBidEth} ETH
            </p>
          </div>
        </div>

        {/* الوقت المتبقي */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {isAuctionEnded ? 'Auction Ended' : 'Time Left'}
            </span>
            <span className={`font-semibold ${
              isAuctionEnded ? 'text-red-500' : 'text-orange-500'
            }`}>
              {timeLeft}
            </span>
          </div>
        </div>

        {/* معلومات إضافية */}
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div>
            <span className="text-gray-500 dark:text-gray-400">Starting Price:</span>
            <div className="font-semibold text-gray-900 dark:text-white">
              {startPriceEth} ETH
            </div>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">Winner:</span>
            <div className="font-semibold text-gray-900 dark:text-white">
              {formattedWinner === 'No address' ? 'No winner yet' : formattedWinner}
            </div>
          </div>
        </div>

        {/* أزرار العمليات */}
        {!isAuctionEnded && isConnected && (
          <div className="space-y-3">
            {showBidInput ? (
              <div className="flex gap-2">
                <input
                  type="number"
                  step="0.001"
                  min={parseFloat(currentBidEth) + 0.001}
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  placeholder={`Min: ${(parseFloat(currentBidEth) + 0.001).toFixed(3)} ETH`}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  onClick={handleBid}
                  disabled={isSubmitting || !bidAmount}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white rounded-lg font-semibold transition-colors"
                >
                  {isSubmitting ? 'Bidding...' : 'Bid'}
                </button>
                <button
                  onClick={() => {
                    setShowBidInput(false);
                    setBidAmount("");
                  }}
                  className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowBidInput(true)}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-lg font-semibold transition-colors"
              >
                Place Bid
              </button>
            )}
          </div>
        )}

        {!isConnected && (
          <div className="text-center">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Connect your wallet to place a bid
            </p>
          </div>
        )}
      </div>
    </div>
  );
};