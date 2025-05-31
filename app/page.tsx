"use client";

import { useEffect, useState } from "react";
import { useWriteContract,useReadContract, useAccount } from "wagmi";

const arabicToNumber: { [key: string]: number } = {
  "ا": 0, "ب": 1, "ت": 2, "ث": 3, "ج": 4, "ح": 5, "خ": 6,
  "د": 7, "ذ": 8, "ر": 9, "ز": 10, "س": 11, "ش": 12,
  "ص": 13, "ض": 14, "ط": 15, "ظ": 16, "ع": 17, "غ": 18,
  "ف": 19, "ق": 20, "ك": 21, "ل": 22, "م": 23, "ن": 24,
  "هـ": 25, "و": 26, "ي": 27
};

export default function Home() {
  const { isConnected, address } = useAccount();
  const [plateID, setPlateID] = useState("");
  
  const [searchPlate, setSearchPlate] = useState("");

  const [plateLetter, setPlateLetter] = useState("");
  const [plateNumber, setPlateNumber] = useState("");

  const [plateLetterS, setPlateLetterS] = useState("");
  const [plateNumberS, setPlateNumberS] = useState("");

  const [tokenURI, setTokenURI] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    } else {
      setIsDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const wagmiSolConfig = {
    address: "0x9d75D6ffa4EEA5F30B3B5Fb9609dD7D8e1940d5C" as '0x{string}',
    abi:[{"type":"constructor","inputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"approve","inputs":[{"name":"to","type":"address","internalType":"address"},{"name":"tokenId","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"balanceOf","inputs":[{"name":"owner","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"getApproved","inputs":[{"name":"tokenId","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"type":"function","name":"getPlateId","inputs":[{"name":"plate","type":"string","internalType":"string"}],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"isApprovedForAll","inputs":[{"name":"owner","type":"address","internalType":"address"},{"name":"operator","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"bool","internalType":"bool"}],"stateMutability":"view"},{"type":"function","name":"mintPlate","inputs":[{"name":"to","type":"address","internalType":"address"},{"name":"plateID","type":"string","internalType":"string"},{"name":"tokenURI","type":"string","internalType":"string"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"name","inputs":[],"outputs":[{"name":"","type":"string","internalType":"string"}],"stateMutability":"view"},{"type":"function","name":"ownerOf","inputs":[{"name":"tokenId","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"type":"function","name":"owner_of","inputs":[{"name":"plateNumber","type":"string","internalType":"string"}],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"type":"function","name":"owns","inputs":[{"name":"","type":"address","internalType":"address"},{"name":"","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"plateToID","inputs":[{"name":"","type":"string","internalType":"string"}],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"safeTransferFrom","inputs":[{"name":"from","type":"address","internalType":"address"},{"name":"to","type":"address","internalType":"address"},{"name":"tokenId","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"safeTransferFrom","inputs":[{"name":"from","type":"address","internalType":"address"},{"name":"to","type":"address","internalType":"address"},{"name":"tokenId","type":"uint256","internalType":"uint256"},{"name":"data","type":"bytes","internalType":"bytes"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"setApprovalForAll","inputs":[{"name":"operator","type":"address","internalType":"address"},{"name":"approved","type":"bool","internalType":"bool"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"supportsInterface","inputs":[{"name":"interfaceId","type":"bytes4","internalType":"bytes4"}],"outputs":[{"name":"","type":"bool","internalType":"bool"}],"stateMutability":"view"},{"type":"function","name":"symbol","inputs":[],"outputs":[{"name":"","type":"string","internalType":"string"}],"stateMutability":"view"},{"type":"function","name":"tokenURI","inputs":[{"name":"tokenId","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"string","internalType":"string"}],"stateMutability":"view"},{"type":"function","name":"transferFrom","inputs":[{"name":"from","type":"address","internalType":"address"},{"name":"to","type":"address","internalType":"address"},{"name":"tokenId","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"event","name":"Approval","inputs":[{"name":"owner","type":"address","indexed":true,"internalType":"address"},{"name":"approved","type":"address","indexed":true,"internalType":"address"},{"name":"tokenId","type":"uint256","indexed":true,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"ApprovalForAll","inputs":[{"name":"owner","type":"address","indexed":true,"internalType":"address"},{"name":"operator","type":"address","indexed":true,"internalType":"address"},{"name":"approved","type":"bool","indexed":false,"internalType":"bool"}],"anonymous":false},{"type":"event","name":"BatchMetadataUpdate","inputs":[{"name":"_fromTokenId","type":"uint256","indexed":false,"internalType":"uint256"},{"name":"_toTokenId","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"MetadataUpdate","inputs":[{"name":"_tokenId","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"Transfer","inputs":[{"name":"from","type":"address","indexed":true,"internalType":"address"},{"name":"to","type":"address","indexed":true,"internalType":"address"},{"name":"tokenId","type":"uint256","indexed":true,"internalType":"uint256"}],"anonymous":false},{"type":"error","name":"ERC721IncorrectOwner","inputs":[{"name":"sender","type":"address","internalType":"address"},{"name":"tokenId","type":"uint256","internalType":"uint256"},{"name":"owner","type":"address","internalType":"address"}]},{"type":"error","name":"ERC721InsufficientApproval","inputs":[{"name":"operator","type":"address","internalType":"address"},{"name":"tokenId","type":"uint256","internalType":"uint256"}]},{"type":"error","name":"ERC721InvalidApprover","inputs":[{"name":"approver","type":"address","internalType":"address"}]},{"type":"error","name":"ERC721InvalidOperator","inputs":[{"name":"operator","type":"address","internalType":"address"}]},{"type":"error","name":"ERC721InvalidOwner","inputs":[{"name":"owner","type":"address","internalType":"address"}]},{"type":"error","name":"ERC721InvalidReceiver","inputs":[{"name":"receiver","type":"address","internalType":"address"}]},{"type":"error","name":"ERC721InvalidSender","inputs":[{"name":"sender","type":"address","internalType":"address"}]},{"type":"error","name":"ERC721NonexistentToken","inputs":[{"name":"tokenId","type":"uint256","internalType":"uint256"}]}]
  };

  const { writeContract } = useWriteContract();

  const handleMintPlate = async () => {
    if (plateLetter === "" || plateNumber === "") {
      alert("you should enter value first");
      return;
    } 

    setIsLoading(true);

    let letterArray = plateLetter.replace(/\s+/g, '').split("").map(letter => arabicToNumber[letter]);
    let numArray = plateNumber.split("");
    console.log(letterArray);
    console.log(numArray);
    const plt: string = letterArray.map(num => num.toString().padStart(2, '0')).join('') + numArray.map(num => num.toString()).join('');
    setPlateID(plt);


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
    setTokenURI(JsonURI);

    
     
    try {
      const wc = await writeContract({
        ...wagmiSolConfig,
        functionName: "mintPlate",
        args: [address, plateID, tokenURI],
      });
      
      console.log("Transaction hash:", wc);
      alert("Congratulations, ur NFT has been Minted");

      setPlateLetter("");
      setPlateNumber("");

    } catch (err) {
      console.error("Error is :", err);
      alert("There are a problem");
    }
    finally {
      setIsLoading(false);
    }
  };

  const { data:plateOwner ,isError ,refetch }  =  useReadContract({
    ...wagmiSolConfig,
    functionName:"owner_of",
    args:[searchPlate]
    }
  );

  const handlePlateSearch =async ()=>{
    if (!isConnected) {
      alert("you should connect your wallet first");
      return;
    }
    if (plateLetterS === "" || plateNumberS === "") {
      alert("you should enter value first");
      return;
    } 
    try{
      let letterArray = plateLetterS.replace(/\s+/g, '').split("").map(letter => arabicToNumber[letter]);
      let numArray = plateNumberS.split("");
      
      const plt: string = letterArray.map(num => num.toString().padStart(2, '0')).join('') + numArray.map(num => num.toString()).join('');

      setSearchPlate(plt);
      console.log(plt);
      await refetch();
      console.log("owner is :",plateOwner);
    }
    catch(error){
        console.log("error :",error);
        alert("Error");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-300">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">🚗</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Plate NFT Platform
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Mint and search license plate NFTs
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Dark Mode Toggle Button */}
            <button
              onClick={toggleDarkMode}
              className="p-3 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? (
                <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
            
            <w3m-button />
            <w3m-network-button />
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Search Section - Left */}
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-teal-600 p-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search Plate
              </h2>
              <p className="text-green-100 text-sm mt-1">Find the owner of any license plate</p>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Plate Number</label>
                    <input
                      type="text"
                      value={plateNumberS}
                      onChange={(e) => setPlateNumberS(e.target.value)}
                      placeholder="123"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Arabic Letters</label>
                    <input
                      type="text"
                      value={plateLetterS}
                      onChange={(e) => setPlateLetterS(e.target.value)}
                      placeholder="أ ب ت"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>

                <button
                  onClick={handlePlateSearch}
                  className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
                >
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Search Plate
                  </span>
                </button>

                <div className="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl p-4 min-h-[80px]">
                  <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Search Result:</div>
                  <div className="text-gray-900 dark:text-white font-mono">
                    {plateOwner ? (
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="break-all">{plateOwner as string}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        <span>No result found</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
    
          {/* Mint Section - Right */}
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
        </div>

        {/* Auction Section */}
        
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