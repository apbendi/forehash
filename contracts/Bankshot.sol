pragma solidity >=0.5.0 <0.6.0;

contract Bankshot {
   address public owner;
   uint256 public ethVig;
   uint256 public minEthCollateral;

    constructor(uint256 _ethVig,
                uint256 _minEthCollateral) public {

        owner = msg.sender;
        ethVig = _ethVig;
        minEthCollateral = _minEthCollateral;
    }

    function minEthPayable() public view returns (uint256) {
        return ethVig + minEthCollateral;
    }

    function setEthVig(uint256 _newVig) public onlyOwner {
        ethVig = _newVig;
    }

    function setMinEthCollateral(uint256 _newMinEthCollateral) public onlyOwner {
        minEthCollateral = _newMinEthCollateral;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "ONLY_OWNER");
        _;
    }
}