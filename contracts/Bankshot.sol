pragma solidity >=0.5.0 <0.6.0;

contract Bankshot {
   address public owner;
   uint256 public ethVig;
   uint256 public minEthDeposit;

    constructor(uint256 _ethVig,
                uint256 _minEthDeposit) public {

        owner = msg.sender;
        ethVig = _ethVig;
        minEthDeposit = _minEthDeposit;
    }

    function minEthPayable() public view returns (uint256) {
        return ethVig + minEthDeposit;
    }

    function setEthVig(uint256 _newVig) public onlyOwner {
        ethVig = _newVig;
    }

    function setMinEthDeposit(uint256 _newMinEthDeposit) public onlyOwner {
        minEthDeposit = _newMinEthDeposit;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "ONLY_OWNER");
        _;
    }
}