const Bankshot = artifacts.require("Bankshot");

module.exports = function(deployer) {
  let ethVig = web3.utils.toWei('0.0', 'ether');
  let minEthDeposit = web3.utils.toWei('0.02', 'ether');

  deployer.deploy(Bankshot, ethVig, minEthDeposit);
};
