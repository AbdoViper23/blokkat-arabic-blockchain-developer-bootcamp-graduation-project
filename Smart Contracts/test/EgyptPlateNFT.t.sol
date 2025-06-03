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
        nft.mintPlate(user1, PLATE_ID_1, TOKEN_URI_1); // mint plt1 to user1

        assertEq(nft.owner_of(PLATE_ID_1), user1, "Plate owner should be user1");
        assertEq(nft.getPlateId(PLATE_ID_1), 1, "Plate ID should be 1");
        assertEq(nft.ownerOf(1), user1, "Token owner should be user1");
        assertEq(nft.tokenURI(1), TOKEN_URI_1, "Token URI should match");

        uint[] memory tokens = nft.getOwnedTokens(user1);
        assertEq(tokens.length, 1, "User should own 1 token");
        assertEq(tokens[0], 1, "Token ID should be 1");
    }

    function test_MintMultiplePlatesForDifferentUsers() public {
        nft.mintPlate(user1, PLATE_ID_1, TOKEN_URI_1);
        nft.mintPlate(user2, PLATE_ID_2, TOKEN_URI_2);

        assertEq(nft.owner_of(PLATE_ID_1), user1, "First plate should belong to user1");
        assertEq(nft.owner_of(PLATE_ID_2), user2, "Second plate should belong to user2");

        assertEq(nft.getPlateId(PLATE_ID_1), 1, "First plate should have token ID 1");
        assertEq(nft.getPlateId(PLATE_ID_2), 2, "Second plate should have token ID 2");

        uint[] memory tokens1 = nft.getOwnedTokens(user1);
        uint[] memory tokens2 = nft.getOwnedTokens(user2);

        assertEq(tokens1.length, 1, "User1 should own 1 token");
        assertEq(tokens1[0], 1, "User1 token ID should be 1");

        assertEq(tokens2.length, 1, "User2 should own 1 token");
        assertEq(tokens2[0], 2, "User2 token ID should be 2");
    }

    function test_QueryNonExistentPlate() public {
        assertEq(nft.owner_of("plt3"), address(0), "Non-existent plate should return zero address"); // there is no plt3
        assertEq(nft.getPlateId("Error"), 0, "Non-existent plate should return zero ID");

        uint[] memory tokens = nft.getOwnedTokens(user1);
        assertEq(tokens.length, 0, "User should not own any tokens");
    }
}
