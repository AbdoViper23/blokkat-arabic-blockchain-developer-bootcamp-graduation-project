// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

interface palteNFT {
    function safeTransferFrom(address from, address to, uint256 tokenId) external;
    function transferFrom(address from, address to, uint256 tokenId) external;
    function getPlateId(string memory plate) external view returns (uint256);
    function ownerOf(uint256 tokenId) external view returns (address);
}

contract PlateAuction{
    uint  public startPrice;
    uint public maxPrice;
    uint public endAt;
    bool public finished;
    address public winner;
    string public plateID;


    address public manager;
    mapping(address=>uint) public balances;

    palteNFT public nft;
    uint public nftID;

    event NewEnter(address indexed user, uint amount);
    event AuctionFinished(address user, uint amount);
    event Withdraw(address user, uint amount);

    constructor (address NTFaddres,string memory _plateID , uint _startPrice,uint _endAt,address msgSender){
        nft=palteNFT(NTFaddres);

        manager = msgSender;
        nftID=nft.getPlateId(_plateID);
        plateID=_plateID;
        startPrice = _startPrice;
        endAt = _endAt;
        maxPrice=_startPrice;
        
        require(nft.ownerOf(nftID) == msg.sender, "You must own the NFT");
    }
    function start() private{
        require(msg.sender==manager);
        nft.safeTransferFrom(manager, address(this),nftID);


    }

    function bid() external payable {
        require(block.timestamp < endAt, "Auction has ended");
        require(!finished, "Auction already ended");
        require(balances[msg.sender]+msg.value > maxPrice);

        balances[msg.sender]+=msg.value;

        maxPrice=balances[msg.sender];
        winner=msg.sender;
        emit NewEnter(msg.sender, msg.value);
    }

    function end() external {
        require(block.timestamp >= endAt,"Auction is not finished yet");
        require(!finished, "Auction is already finished");
        require(msg.sender == manager || msg.sender == winner);

        finished = true;
        if(winner!=address(0)){
            nft.safeTransferFrom(address(this), winner, nftID);
            payable(manager).transfer(maxPrice);
            emit AuctionFinished(winner, maxPrice);
        }
        else {
            nft.safeTransferFrom(address(this), manager, nftID);
        }
    }
    function withdraw()external  {
        require(balances[msg.sender]>0);
        require(msg.sender != winner);
        uint amount = balances[msg.sender];
        balances[msg.sender]=0;
        payable(msg.sender).transfer(amount);
        emit Withdraw(msg.sender,amount);
    }
}
