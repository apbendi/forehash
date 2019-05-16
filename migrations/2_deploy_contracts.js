const SimpleStorage = artifacts.require("Bankshot");

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
};
