// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "../src/EgyptPlateNFT.sol";

contract DeployAndMint is Script {
    function run() external {
        vm.startBroadcast();

        EgyptPlateNFT nft = new EgyptPlateNFT();
        
        vm.stopBroadcast();
    }
}
