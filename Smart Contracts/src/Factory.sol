// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

import "./PlateAuction.sol";

contract Factory{
    address[] public deployedActions;

    function createAction(address NTFaddres,string memory _plateID , uint _startPrice,uint _endAt) public {
        PlateAuction newAction=new PlateAuction(NTFaddres, _plateID, _startPrice, _endAt,msg.sender);
        deployedActions.push(address(newAction));
    }

    function deployedAuctions()public view returns (address[] memory){
        return deployedActions;
    }

}
