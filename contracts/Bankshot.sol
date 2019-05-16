pragma solidity >=0.5.0 <0.6.0;

contract Bankshot {
   address public owner;
   uint256 public ethVig;
   uint256 public minEth;

    constructor(uint256 _ethVig,
                uint256 _minEth) public {

        owner = msg.sender;
        ethVig = _ethVig;
        minEth = _minEth;
    }
}