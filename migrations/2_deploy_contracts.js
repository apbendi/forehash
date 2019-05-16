const Bankshot = artifacts.require("Bankshot");

module.exports = function(deployer) {
  deployer.deploy(Bankshot, 0);
};
