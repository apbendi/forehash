pragma solidity >=0.5.0 <0.6.0;

contract Bankshot {
   address public owner;
   uint256 public ethVig;
   uint256 public minEthDeposit;

   struct Submission {
       bytes32 sHash;
       bytes revelation;
   }

   mapping(address => Submission[]) submissions;

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

    function submitHash(bytes32 _hash) public payable paysMin {
        submissions[msg.sender].push(Submission({ sHash: _hash, revelation: ""}));
    }

    function hashesForAddress(address _address) public view returns(bytes32[] memory) {
        Submission[] storage subs = submissions[_address];
        bytes32[] memory hashes = new bytes32[](subs.length);

        for(uint i = 0; i < subs.length; i++) {
            hashes[i] = subs[i].sHash;
        }

        return hashes;
    }

    function revelationForSub(address _address, uint256 _subID) public view returns (bytes memory) {
        return submissions[_address][_subID].revelation;
    }

    function revealSubmission(uint _subId, bytes memory _revelation) public {
        Submission storage sub = submissions[msg.sender][_subId];

        bytes32 revealHash = keccak256(abi.encodePacked(_revelation));
        require(revealHash == sub.sHash, "INVALID_REVEAL");

        sub.revelation = _revelation;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "ONLY_OWNER");
        _;
    }

    modifier paysMin() {
        require(msg.value >= minEthPayable(), 'INSUFFICIENT_FUNDS');
        _;
    }
}