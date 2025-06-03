"use client";

import {useState } from "react";
import { useWriteContract, useReadContract , useAccount } from "wagmi";
import { wagmiSolConfig } from "@/lib/wagmiSolConfig";

const arabicToNumber: { [key: string]: number } = {
    "ا": 0, "ب": 1, "ت": 2, "ث": 3, "ج": 4, "ح": 5, "خ": 6,
    "د": 7, "ذ": 8, "ر": 9, "ز": 10, "س": 11, "ش": 12,
    "ص": 13, "ض": 14, "ط": 15, "ظ": 16, "ع": 17, "غ": 18,
    "ف": 19, "ق": 20, "ك": 21, "ل": 22, "م": 23, "ن": 24,
    "هـ": 25, "و": 26, "ي": 27
  };

export const MintNFT = () =>{
    const { isConnected, address } = useAccount();

    const [plateLetter, setPlateLetter] = useState("");
    const [plateNumber, setPlateNumber] = useState("");

    const [isLoading, setIsLoading] = useState(false);

    const [plate, setPlate] = useState("");

    const { writeContractAsync } = useWriteContract();

    const { data, refetch }  = useReadContract({
      ...wagmiSolConfig,
      functionName:"plateToID",
      args:[plate]
    });

    const handleMintPlate = async () => {
    
        if (plateLetter === "" || plateNumber === "") {
        alert("you should enter value first");
        return;
        }

        setIsLoading(true);
        let letterArray = plateLetter.replace(/\s+/g, '').split("").map(letter => arabicToNumber[letter]);
        let numArray = plateNumber.split("").map(char => parseInt(char, 10));
        numArray.reverse();

        console.log(letterArray);
        console.log(numArray);
        while(letterArray.length<3)
          letterArray.push(99);// skip (empty)

        const plt: string = letterArray.map(num => num.toString().padStart(2, '0')).join('') + numArray.map(num => num.toString()).join('');

        setPlate(plt);
        const { data: id } = await refetch();
        console.log("id is "+id);

        if (id && id !== BigInt(0)) { // cheak if the plate is available
          alert("Plate is already used before");
          setIsLoading(false);
          return;
        }

        const genPic = await fetch('/api/pltPicGen', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            letters: letterArray,
            numbers: numArray,
        }),
        });

        const retGen = await genPic.json();
        if (!retGen.success) {
        throw new Error("There is an Error: " + retGen.message);
        }

        const URI = retGen.imageUri;
        console.log("Generated Image URI:", URI);
        // Generate metadata
        const metadataURI = await fetch('/api/metadataURI', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            inputCode: plt,
            uri: URI
        })
        });
        
        const retURI = await metadataURI.json();
        if (!retURI.success) {
        throw new Error("Metadata generation failed: " + retURI.message);
        }

        const JsonURI = retURI.metadataUri;
        console.log("Doneeeeeeeeeeee");
        console.log("the JSON URI is : ", JsonURI);        
        
        try {
        const wc = await writeContractAsync({
            ...wagmiSolConfig,
            functionName: "mintPlate",
            args: [address, plt, JsonURI]
        });
          
          console.log("Transaction hash:", wc);
          alert("Congratulations, ur NFT has been Minted");
        } catch (err) {
          console.error("Error is :", err);
          alert("There are a problem");
        }
        finally {
          setPlateLetter("");
          setPlateNumber("");
          setIsLoading(false);
        }
    };

    return(
    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Mint New Plate
          </h2>
          <p className="text-blue-100 text-sm mt-1">Create your unique license plate NFT</p>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Plate Number</label>
                <input
                  type="text"
                  value={plateNumber}
                  onChange={(e) => setPlateNumber(e.target.value)}
                  placeholder="123"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Arabic Letters</label>
                <input
                  type="text"
                  value={plateLetter}
                  onChange={(e) => setPlateLetter(e.target.value)}
                  placeholder="أ ب ت"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
            <button
              onClick={handleMintPlate}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              disabled={!isConnected || isLoading}
            >
              <span className="flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Minting...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Mint New NFT Plate
                  </>
                )}
              </span>
            </button>
            {!isConnected && (
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
                <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium">Please connect your wallet to mint NFTs</span>
                </div>
              </div>
            )}
          </div>
        </div>
    </div>
    );
}
