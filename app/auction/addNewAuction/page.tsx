"use client";
import { Header } from "@/components/Header";
import {OwnedNFTList} from "@/components/OwnedNFTList";

export default function CreateAuctionModal() { 
    return(
        <div>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-300">
                <div className="p-6 max-w-7xl mx-auto">
                    <Header />
                    <OwnedNFTList />
                </div>
            </div>
        </div>
    
    );
};
