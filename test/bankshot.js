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

function addWeiStrings(...weiStrings) {
  return weiStrings
          .map( ws => new BN(ws) )
          .reduce( (acc, curr) => acc.add(curr) );
}

async function getGasCost(receipt) {
  let gasUsed = new BN(receipt.cumulativeGasUsed);

  let tx = await web3.eth.getTransaction(receipt.transactionHash);
  let gasPrice = new BN(tx.gasPrice);

  return gasPrice.mul(gasUsed);
}

String.prototype.toBN = function() {
  return new BN(this.toString());
}

contract("Bankshot", accounts => {

  var bankshotInstance;
  let ownerAddr = accounts[0];
  let user1Addr = accounts[1];
  let user2Addr = accounts[2];
  let initVig = utils.toWei('0.01', 'ether');
  let initMinEthDeposit = utils.toWei('.03', 'ether');
  let newVig = utils.toWei('0.02', 'ether');
  let newMinEthDeposit = utils.toWei('0.05', 'ether');
  let extraDeposit = utils.toWei('1', 'ether');


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

  it("should let a user submit a hash with min payment", async () => {
    let string = "Hello World";
    let hash = utils.soliditySha3({type: 'string', value: string});
    let txValue = addWeiStrings(newVig, newMinEthDeposit);
    
    await bankshotInstance.submitHash(hash, {from: user1Addr, value: txValue});

    let hashes = await bankshotInstance.hashesForAddress(user1Addr);

    assert.equal(hashes.length, 1, "Unexpected hash count for user");
    assert(hashes.includes(hash), "Submitted hash not included in results");
  });

  it("should let another user submit a hash with above min payment", async () => {
    let string = "Hello, Cruel World";
    let hash = utils.soliditySha3({type: 'string', value: string});
    let txValue = addWeiStrings(newVig, extraDeposit);
    
    await bankshotInstance.submitHash(hash, {from: user2Addr, value: txValue});

    let hashes = await bankshotInstance.hashesForAddress(user2Addr);

    assert.equal(hashes.length, 1, "Unexpected hash count for user");
    assert(hashes.includes(hash), "Submitted hash not included in results");
  });

  it("should not let a user submit without a payment", async () => {
    let string = "Something to hash";
    let hash = utils.soliditySha3({type: 'string', value: string});

    let txPromise = bankshotInstance.submitHash(hash, {from: user2Addr});

    await assertRevert(txPromise, 'INSUFFICIENT_FUNDS', "Failed to revert non-paying submission");
  });

  it("should not let a user submit with less than minimum payment", async () => {
    let string = "Something to hash";
    let hash = utils.soliditySha3({type: 'string', value: string});
    let txValue = addWeiStrings(newMinEthDeposit);

    let txPromise = bankshotInstance.submitHash(hash, {from: user2Addr, value: txValue});

    await assertRevert(txPromise, 'INSUFFICIENT_FUNDS', "Failed to revert submission w/ insufficient payment");
  });

  it("should not let a user claim a reveal if the string is incorrect", async () => {
    let string = "Hello Again";
    let hash = utils.soliditySha3({type: 'string', value: string});
    let txValue = addWeiStrings(newVig, newMinEthDeposit);

    await bankshotInstance.submitHash(hash, {from: user1Addr, value: txValue});
    let hashes = await bankshotInstance.hashesForAddress(user1Addr);

    assert.equal(hashes.length, 2, "Unexpected hash count for user");
    assert(hashes.includes(hash), "Submitted hash not included in results");

    let wrongRevealTx = bankshotInstance.revealSubmission(1, utils.toHex(string + "!!"), {from: user1Addr});
    await assertRevert(wrongRevealTx, "INVALID_REVEAL", "Revealed when it shouldn't have");
  });

  it("should not show a revelation for a submission that hasn't been revealed", async () => {
    let revelation = await bankshotInstance.revelationForSub(user2Addr, 0);
    assert.equal(revelation, null, "Returned a non-null value for an unrevealed submission");
  });

  it("should pay a user back for a correct revelation", async () => {
    let string = "Hello Again";
    let initBalance = ( await web3.eth.getBalance(user1Addr) ).toBN();

    let result = await bankshotInstance.revealSubmission(1, utils.toHex(string), {from: user1Addr});
    let gasCost = await getGasCost(result.receipt);

    let postBalance = ( await web3.eth.getBalance(user1Addr) ).toBN();
    let amountReturned = postBalance.add(gasCost).sub(initBalance);

    assert.equal(newMinEthDeposit, amountReturned.toString(10), "Failed to return a user's minimum deposit");
  });

  it("should return the reveal string for a previously revealed submission", async () => {
    let expectedString = "Hello Again";

    let events = await bankshotInstance.getPastEvents('Revelation', {filter: {user: user1Addr, subID: 1}});
    assert(events.length === 1, "Didn't find revelation event, or found too many");

    let revelationBytes = await events[0].returnValues['revelation'];
    let revelationString = utils.hexToUtf8(revelationBytes);

    assert.equal(revelationString, expectedString, "Failed to return the revelation string");
  });

  it("should not allow a user to reveal a submission twice", async () => {
    let string = "Hello Again";

    let revealTx = bankshotInstance.revealSubmission(1, utils.toHex(string), {from: user1Addr});

    await assertRevert(revealTx, "ALREADY_REVEALED", "Allowed the user to reveal the same submission twice");
  });

  it("should pay back a user who deposited more than the minimum the correct amount", async () => {
    let string = "Hello, Cruel World";

    let initBalance = ( await web3.eth.getBalance(user2Addr) ).toBN();

    let result = await bankshotInstance.revealSubmission(0, utils.toHex(string), {from: user2Addr});
    let gasCost = await getGasCost(result.receipt);

    let postBalance = ( await web3.eth.getBalance(user2Addr) ).toBN();
    let amountReturned = postBalance.add(gasCost).sub(initBalance);

    assert.equal(extraDeposit, amountReturned.toString(10), "Failed to return a user's extra deposit");
  });
});
