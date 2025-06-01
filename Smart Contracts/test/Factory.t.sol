// test/FactoryTest.t.sol
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/Factory.sol";
import "../src/PlateAuction.sol";

contract FactoryTest is Test {
    Factory factory;

    address user = address(0x1);
    string plate = "010101555";
    uint256 tokenId = 42;
    uint256 startPrice = 1 ether;
    uint256 duration = 1 days;
    uint256 endAt = block.timestamp + duration;

    function setUp() public {
        factory = new Factory();
    }

    function testCreateAuction() public {
        // simulate user call
        vm.prank(user);
        factory.createAction(address(this), plate, startPrice, endAt);

        address[] memory auctions = factory.deployedAuctions();
        assertEq(auctions.length, 1);

        address auctionAddr = auctions[0];
        PlateAuction auction = PlateAuction(auctionAddr);

        // Check that auction was initialized properly
        assertEq(auction.manager(), user);
        assertEq(auction.startPrice(), startPrice);
        assertEq(auction.endAt(), endAt);
        assertEq(auction.plateID(), plate);
    }

    function testMultipleCreations() public {
        vm.startPrank(user);
        factory.createAction(address(this), plate, startPrice, endAt);
        factory.createAction(address(this), plate, startPrice, endAt);
        factory.createAction(address(this), plate, startPrice, endAt);
        vm.stopPrank();

        address[] memory auctions = factory.deployedAuctions();
        assertEq(auctions.length, 3);
    }
}
