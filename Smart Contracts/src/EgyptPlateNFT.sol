// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract EgyptPlateNFT is ERC721URIStorage {
    uint256 private _tokenIdCounter = 1;

    address private owner;

    mapping(string => address) private plateOwner;
    mapping(string => uint) public   plateToID;
    mapping(address=>uint[]) public owns; /// ToDo handel owner transfer

    modifier ownerOnly(){
        require(msg.sender==owner);
        _;
    }

    constructor() ERC721("Egypt Plate","EgyPlt") {
        owner=msg.sender;
    }

    function mintPlate(address to, string memory plateID, string memory tokenURI) public{// ToDo ownerOnly 
                                                                       //ToDo User request plate and owner Mint it
        require(plateOwner[plateID]==address(0), "Plate already minted"); 
        // plateID = "010203123" --> 01 02 02 - 1 2 3     
        uint256 newTokenId = _tokenIdCounter;
        owns[to].push(newTokenId);

        _safeMint(to, newTokenId);
        plateToID[plateID]=newTokenId;

        _setTokenURI(newTokenId, tokenURI);
        plateOwner[plateID] = to;
        _tokenIdCounter++;
    }

    function owner_of(string memory plateNumber) public view returns (address) {
        return plateOwner[plateNumber];
    }
    function getPlateId(string memory plate) external view returns (uint) {
        return plateToID[plate];
    }

}