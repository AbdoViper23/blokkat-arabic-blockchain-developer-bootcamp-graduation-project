"use client";

import { useState ,useEffect} from "react";
import { useReadContract } from "wagmi";
import { wagmiSolConfig } from "@/lib/wagmiSolConfig";
import { encodePlateCode } from "@/lib/nftUtils";


export const SearchNFT = ()=>{

    const [searchPlate, setSearchPlate] = useState("");
    
    const [plateLetterS, setPlateLetterS] = useState("");
    const [plateNumberS, setPlateNumberS] = useState("");
    
    const { data:plateOwner , isLoading:notFinished , refetch }  = useReadContract({
        ...wagmiSolConfig,
        functionName:"owner_of",
        args:[searchPlate]
        }
    );
    
    const handlePlateSearch =async ()=>{
        if (plateLetterS === "" || plateNumberS === "") {
          alert("you should enter value first");
          return;
        } 
        try{
          const { plt } = encodePlateCode(plateLetterS,plateNumberS); 
          setSearchPlate(plt);
          console.log(plt);
          await refetch();
        }
        catch(error){
            console.log("error :",error);
            alert("Error");
        }
    }

    return(
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
    )

}