// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/EgyptPlateNFT.sol";

contract EgyptPlateNFTTest is Test {
    EgyptPlateNFT public nft;
    address public owner;
    address public user1;
    address public user2;
    
    string constant PLATE_ID_1 = "010101000";
    string constant PLATE_ID_2 = "010101999";
    string constant TOKEN_URI_1 = "http://IPFS/2";
    string constant TOKEN_URI_2 = "http://IPFS/2";
    
    function setUp() public {
        owner = address(this);
        user1 = address(0x1);
        user2 = address(0x2);
        
        nft = new EgyptPlateNFT();
    }
    
    function test_MintPlateSuccess() public {
        nft.mintPlate(user1, PLATE_ID_1, TOKEN_URI_1);// mint plt1 to user1

        assertEq(nft.owner_of(PLATE_ID_1), user1, "Plate owner should be user1");
        assertEq(nft.getPlateId(PLATE_ID_1), 1, "Plate ID should be 1");
        assertEq(nft.ownerOf(1), user1, "Token owner should be user1");
        assertEq(nft.tokenURI(1), TOKEN_URI_1, "Token URI should match");
        
        assertEq(nft.owns(user1, 0), 1, "User should own token ID 1 at index 0");
    }
    
    function test_MintPlateAlreadyExists() public {
        nft.mintPlate(user1, PLATE_ID_1, TOKEN_URI_1);
        
        vm.expectRevert("Plate already minted");// should be revert cuz plt1 is already taken  
        nft.mintPlate(user2, PLATE_ID_1, TOKEN_URI_2);

        assertEq(nft.owner_of(PLATE_ID_1), user1, "Original owner should remain unchanged");
    }
    
    function test_MintMultiplePlatesForDifferentUsers() public {
        nft.mintPlate(user1, PLATE_ID_1, TOKEN_URI_1);
        nft.mintPlate(user2, PLATE_ID_2, TOKEN_URI_2);
        
        assertEq(nft.owner_of(PLATE_ID_1), user1, "First plate should belong to user1");
        assertEq(nft.owner_of(PLATE_ID_2), user2, "Second plate should belong to user2");
        
        assertEq(nft.getPlateId(PLATE_ID_1), 1, "First plate should have token ID 1");
        assertEq(nft.getPlateId(PLATE_ID_2), 2, "Second plate should have token ID 2");
        
        assertEq(nft.owns(user1, 0), 1, "User1 should own token ID 1 at index 0");
        assertEq(nft.owns(user2, 0), 2, "User2 should own token ID 2 at index 0");
    }
    
    function test_QueryNonExistentPlate() public {
        assertEq(nft.owner_of("plt3"), address(0), "Non-existent plate should return zero address"); // there are no plt3
        assertEq(nft.getPlateId("Error"), 0, "Non-existent plate should return zero ID");

        vm.expectRevert();
        nft.owns(user1, 0);
    }
}