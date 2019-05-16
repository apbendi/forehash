const Bankshot = artifacts.require("Bankshot");
const utils = web3.utils;
const BN = utils.BN;

contract("Bankshot", accounts => {

  var bankshotInstance;
  let ownerAddr = accounts[0];
  let initVig = utils.toWei('0.01', 'ether');
  let initMinEthCollateral = utils.toWei('.03', 'ether');
  let newVig = utils.toWei('0.02', 'ether');
  let newMinEthCollateral = utils.toWei('0.05', 'ether');

  it("should deploy", async () => {
    bankshotInstance = await Bankshot.new(initVig, initMinEthCollateral, { from: ownerAddr, });
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

  it("should have the ethereum min collateral set to the constructor param", async() => {
    let callResult = await bankshotInstance.minEthCollateral.call();
    assert.equal(callResult, initMinEthCollateral, "Failed to set initial ETH collateral");
  });

  it("should properly calculate the minimum payable ETH", async() => {
    let callResult = await bankshotInstance.minEthPayable.call();
    
    let vig = new BN(initVig);
    let collateral = new BN(initMinEthCollateral);
    let expectedValue = vig.add(collateral);

    assert.equal(callResult.toString(10), expectedValue.toString(10), "Failed to calculate expected ETH payable");
  });

  it("should let the owner update the eth vig", async () => {
    await bankshotInstance.setEthVig(newVig, {from: ownerAddr});
    let vigResult = await bankshotInstance.ethVig();

    assert.equal(newVig.toString(10), vigResult.toString(10), "Failed to update the ETH vig");
  });

  it("should not let a non-owner update the eth vig", async () => {
    let vig = utils.toWei('1000', 'ether');
    var revertReason = 'none';

    try {
      await bankshotInstance.setEthVig(vig, {from: accounts[1]});
    } catch (error) {
      revertReason = error.reason;
    }

    assert.equal(revertReason, 'ONLY_OWNER', "Failed to revert non-owner vig update for correct reason");
  });

  it("should let the owner update the min eth collateral", async() => {
    await bankshotInstance.setMinEthCollateral(newMinEthCollateral, {from: ownerAddr});
    let minResult = await bankshotInstance.minEthCollateral();

    assert.equal(newMinEthCollateral.toString(10), minResult.toString(10), "Failed to update the min ETH collateral");
  });

  it("should not let a non-owner update the eth min collateral", async () => {
    let collateral = utils.toWei('0', 'ether');
    var revertReason = 'none';

    try {
      await bankshotInstance.setMinEthCollateral(collateral, {from: accounts[2]});
    } catch (error) {
      revertReason = error.reason;
    }

    assert.equal(revertReason, 'ONLY_OWNER', "Failed to revert non-owner eth collager update for correct reason");
  });
});
