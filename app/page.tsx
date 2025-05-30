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

    let letterArray = plateLetter.split("").map(letter => arabicToNumber[letter]);
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

// #####################################################
    
     
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
      let letterArray = plateLetterS.split("").map(letter => arabicToNumber[letter]);
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
    <div className="p-6 max-w-4xl mx-auto bg-sky-50 min-h-screen">
      <div className="flex justify-between mb-6">
        <w3m-button />
        <w3m-network-button />
      </div>
      <div className="flex gap-6">
        {/* Search Section - Left */}
        <div className="flex-1 bg-white p-4 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-3 text-gray-700">Search Plate</h2>
          
          

          <div className="flex gap-3 mb-3">
          <input
            type="text"
            value={plateNumberS}
            onChange={(e) => setPlateNumberS(e.target.value)}
            placeholder="plate number"
            className="border px-3 py-2 rounded w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <input
            type="text"
            value={plateLetterS}
            onChange={(e) => setPlateLetterS(e.target.value)}
            placeholder="plate letters in Arabic"
            className="border px-3 py-2 rounded w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          </div>


          <button
            onClick={handlePlateSearch}
            className="disabled:cursor-not-allowed transition cursor-pointer bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700 transition"
          >
            Search
          </button>
          <div className="mt-4 border p-3 rounded bg-gray-100 min-h-[48px] text-gray-700">
            {plateOwner ? `Owner: ${plateOwner}` : "No result"}
          </div>
        </div>
  
        {/* Mint Section - Right */}
        <div className="flex-1 bg-white p-4 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-3 text-gray-700">Mint Plate</h2>
    
          <div className="flex gap-3 mb-3">
          <input
            type="text"
            value={plateNumber}
            onChange={(e) => setPlateNumber(e.target.value)}
            placeholder="Number"
            className="border px-3 py-2 rounded w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <input
            type="text"
            value={plateLetter}
            onChange={(e) => setPlateLetter(e.target.value)}
            placeholder="letters in Arabic"
            className="border px-3 py-2 rounded w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>

          <button
            onClick={handleMintPlate}
            className="disabled:cursor-not-allowed transition cursor-pointer bg-blue-600 text-white px-4 py-2 rounded w-full disabled:opacity-50 hover:bg-blue-700 transition"
            disabled={!isConnected || isLoading}
            >
           {isLoading ? "Minting..." : "Mint new NFT plate"}
          </button>
        </div>
      </div>
      {/* Next Page Button */}
      <div className="flex justify-center bg-white p-4 rounded-xl shadow mt-6">
        <button
           onClick={()=>{
            alert("Coming soon");
           }} // ToDo
          className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition cursor-pointer"
        >
          Plate Auction
        </button>
      </div>
    </div>
  );
  
}