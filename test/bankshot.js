const Bankshot = artifacts.require("Bankshot");
const utils = web3.utils;

contract("Bankshot", accounts => {

  var bankshotInstance;
  let ownerAddr = accounts[0];
  let initVig = utils.toWei('0.01', 'ether');

  it("should deploy", async () => {
    bankshotInstance = await Bankshot.new(initVig, { from: ownerAddr, });
    assert(bankshotInstance.address.startsWith("0x"), "Deployed contract address not found");
  });

  it("should have an owner property initialized to the deployer", async () => {
    let callResult = await bankshotInstance.owner.call();
    assert.equal(callResult, ownerAddr, "Unexpected contract owner");
  });

  it("should have the ethereum vig set to the constructor param", async () => {
    let callResult = await bankshotInstance.ethVig.call();
    assert.equal(callResult, initVig, "Failed to set initial ETH vig");
  });
});
