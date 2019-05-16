pragma solidity >=0.5.0 <0.6.0;

contract Bankshot {
   address public owner;
   uint256 public ethVig;   

    constructor(uint256 _ethVig) public {
        owner = msg.sender;
        ethVig = _ethVig;
    }
}