"use client";

import { useEffect, useState } from "react";
import { useReadContract } from "wagmi";
import { wagmiSolConfig } from "@/lib/wagmiSolConfig";
import { decodePlateCode, NFTMetadata , fetchMetadataFromURI} from "@/lib/nftUtils";

interface NFTCardProps {
  tokenId: string;
}

export const NFTCard = ({ tokenId }: NFTCardProps) => {
  const [nftData, setNftData] = useState<NFTMetadata>();

  const { data: tokenURI, isLoading: uriLoading, error: uriError } = useReadContract({
    ...wagmiSolConfig,
    functionName: "tokenURI",
    args: [BigInt(tokenId)],
  });

  useEffect(() => {
    const loadNFTData = async () => {
      if (uriLoading) 
        return;

      if (uriError) {
        console.error(`Error loading tokenURI for ${tokenId}:`, uriError);
        return;
      }
      try {
        let metadata: NFTMetadata | undefined;

        if (tokenURI) {
          metadata = await fetchMetadataFromURI(tokenURI as string);
        }

        if (metadata){
          const { letters, numbers } = decodePlateCode(metadata.plate_code);
          metadata.letters = letters;
          metadata.numbers = numbers;
        }
        setNftData(metadata);

      } catch (error) {
        console.error(`Error processing token ${tokenId}:`, error);
      }
    };

    loadNFTData();
  }, [tokenURI, uriLoading, uriError, tokenId]);
 
  if (uriLoading) { // loading form
    return (
      <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 shadow-lg overflow-hidden">
        <div className="h-48 bg-gray-300 dark:bg-gray-600 animate-pulse"></div>
        <div className="p-4">
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 animate-pulse"></div>
        </div>
      </div>
    );
  } 

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* NFT Image */}
      <div className="relative h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
          <>
            {nftData?.image? (
              <img
                src={nftData.image}
                alt={nftData.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallbackDiv = target.nextElementSibling as HTMLElement;
                  if (fallbackDiv) {
                    fallbackDiv.classList.remove('hidden');
                  }
                }}
              />
            ) : null}
            
            {/* Custom license plate display */}
            <div className={`text-center text-white w-full h-full flex flex-col items-center justify-center absolute inset-0 ${nftData?.image ? 'hidden' : ''}`}>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 mb-2 border border-white/30">
                <div className="text-3xl font-bold mb-2 font-mono">{nftData?.numbers || nftData?.numbers}</div>
                <div className="text-xl font-bold" style={{ fontFamily: 'serif' }}>{nftData?.letters || nftData?.letters}</div>
              </div>
              <p className="text-sm opacity-80">Egyptian License Plate</p>
            </div>
          </>
      </div>

      <div className="p-4">
          <>
            <div className="flex items-start justify-between mb-3">
              <div className="w-full">
                <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-2">
                  {nftData?.name}
                </h3>
                {(nftData?.letters || nftData?.numbers) && (
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-2">
                      <span className="font-medium text-green-600 dark:text-green-400 block">Numbers:</span>
                      <span className="text-gray-900 dark:text-white font-bold text-lg">{nftData?.numbers}</span>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2">
                      <span className="font-medium text-blue-600 dark:text-blue-400 block">Letters:</span>
                      <span className="text-gray-900 dark:text-white font-bold text-lg">{nftData?.letters}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {nftData?.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {nftData.description}
              </p>
            )}
          </>
      </div>
    </div>
  );
};