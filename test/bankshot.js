const Bankshot = artifacts.require("Bankshot");
const utils = web3.utils;
const BN = utils.BN;

async function assertRevert(txPromise, expectedReason, failureMessage) {
  var reverted = false;
  var reason = "";

  try {
    await txPromise;
  } catch (error) {
    reverted = true;
    reason = error.reason;
  }

  assert(reverted, failureMessage);
  assert.equal(expectedReason, reason, "WRONG REASON: " + failureMessage);
}

contract("Bankshot", accounts => {

  var bankshotInstance;
  let ownerAddr = accounts[0];
  let initVig = utils.toWei('0.01', 'ether');
  let initMinEthDeposit = utils.toWei('.03', 'ether');
  let newVig = utils.toWei('0.02', 'ether');
  let newMinEthDeposit = utils.toWei('0.05', 'ether');

  it("should deploy", async () => {
    bankshotInstance = await Bankshot.new(initVig, initMinEthDeposit, { from: ownerAddr, });
    assert(bankshotInstance.address.startsWith("0x"), "Deployed contract address not found");
  });

  it("should have an owner property initialized to the deployer", async () => {
    let callResult = await bankshotInstance.owner();
    assert.equal(callResult, ownerAddr, "Unexpected contract owner");
  });

  it("should have the ethereum vig set to the constructor param", async () => {
    let callResult = await bankshotInstance.ethVig();
    assert.equal(callResult, initVig, "Failed to set initial ETH vig");
  });

  it("should have the ethereum min deposit set to the constructor param", async() => {
    let callResult = await bankshotInstance.minEthDeposit();
    assert.equal(callResult, initMinEthDeposit, "Failed to set initial ETH deposit");
  });

  it("should properly calculate the minimum payable ETH", async() => {
    let callResult = await bankshotInstance.minEthPayable();
    
    let vig = new BN(initVig);
    let deposit = new BN(initMinEthDeposit);
    let expectedValue = vig.add(deposit);

    assert.equal(callResult.toString(10), expectedValue.toString(10), "Failed to calculate expected ETH payable");
  });

  it("should let the owner update the eth vig", async () => {
    await bankshotInstance.setEthVig(newVig, {from: ownerAddr});
    let vigResult = await bankshotInstance.ethVig();

    assert.equal(newVig.toString(10), vigResult.toString(10), "Failed to update the ETH vig");
  });

  it("should not let a non-owner update the eth vig", async () => {
    let vig = utils.toWei('1000', 'ether');
    let txPromise =  bankshotInstance.setEthVig(vig, {from: accounts[1]});

    await assertRevert(txPromise, "ONLY_OWNER", "Failed to revert non-owner vig update");
  });

  it("should let the owner update the min eth deposit", async() => {
    await bankshotInstance.setMinEthDeposit(newMinEthDeposit, {from: ownerAddr});
    let minResult = await bankshotInstance.minEthDeposit();

    assert.equal(newMinEthDeposit.toString(10), minResult.toString(10), "Failed to update the min ETH deposit");
  });

  it("should not let a non-owner update the eth min deposit", async () => {
    let deposit = utils.toWei('0', 'ether');
    let txPromise = bankshotInstance.setMinEthDeposit(deposit, {from: accounts[2]});

    await assertRevert(txPromise, "ONLY_OWNER", "Failed to revert non-owner eth deposit update");
  });

  it("should calculate the updated minimum payaple ETH", async () => {
    let callResult = await bankshotInstance.minEthPayable();

    let vig = new BN(newVig);
    let deposit = new BN(newMinEthDeposit);
    let expectedValue = vig.add(deposit);

    assert.equal(expectedValue.toString(10), callResult.toString(10), "Failed to calculate updated min payable ETH");
  });
});
