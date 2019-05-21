pragma solidity >=0.5.0 <0.6.0;

contract Bankshot {
   address public owner;
   uint256 public ethVig;
   uint256 public minEthDeposit;

   struct Submission {
       bytes32 sHash;
       uint256 deposit;
       bool isRevealed;
   }

   mapping(address => Submission[]) submissions;

   event Revelation(
       address indexed user,
       uint256 indexed subID,
       bytes revelation
   );

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
        uint256 deposit = msg.value - ethVig;
        submissions[msg.sender].push(Submission({ sHash: _hash, deposit: deposit, isRevealed: false}));
    }

    function hashesForAddress(address _address) public view returns(bytes32[] memory) {
        Submission[] storage subs = submissions[_address];
        bytes32[] memory hashes = new bytes32[](subs.length);

        for(uint i = 0; i < subs.length; i++) {
            hashes[i] = subs[i].sHash;
        }

        return hashes;
    }

    function revealSubmission(uint _subID, bytes memory _revelation) public {
        Submission storage sub = submissions[msg.sender][_subID];
        require(!sub.isRevealed, "ALREADY_REVEALED");

        bytes32 revealHash = keccak256(abi.encodePacked(_revelation));
        require(revealHash == sub.sHash, "INVALID_REVEAL");

        sub.isRevealed = true;
        emit Revelation(msg.sender, _subID, _revelation);

        msg.sender.transfer(sub.deposit);
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