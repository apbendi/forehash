const Bankshot = artifacts.require("Bankshot");

contract("Bankshot", accounts => {

  var bankshotInstance;

  it("should deploy", async () => {
    bankshotInstance = await Bankshot.deployed();
    assert(bankshotInstance.address.startsWith("0x"), "Deployed contract address not found");
  });
});
