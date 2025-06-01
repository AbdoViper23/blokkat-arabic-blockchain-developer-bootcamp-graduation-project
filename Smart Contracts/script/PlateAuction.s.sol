// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "../src/PlateAuction.sol";

contract DeployFactory is Script {
    function run() external {
        vm.startBroadcast();
        address NTFaddres=address(this);
        string memory _plateID ="23";
        uint _startPrice = 10;
        uint _endAt = 100000;
        address msgSender = address(this) ;
        PlateAuction nft = new PlateAuction(NTFaddres, _plateID ,  _startPrice, _endAt, msgSender);

        vm.stopBroadcast();
    }
}
