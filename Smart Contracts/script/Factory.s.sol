// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "../src/Factory.sol";

contract DeployFactory is Script {
    function run() external {
        vm.startBroadcast();

        Factory nft = new Factory();

        vm.stopBroadcast();
    }
}
