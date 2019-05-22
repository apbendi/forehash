const Bankshot = artifacts.require("Bankshot");

module.exports = function(deployer) {
  let ethVig = web3.utils.toWei('0.05', 'ether');
  let minEthDeposit = web3.utils.toWei('0.01', 'ether');

  deployer.deploy(Bankshot, ethVig, minEthDeposit);
};
