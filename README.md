# Forehash 🔮

Accountable predictions using bonded commit-reveal on the Ethereum blockchain. Deployed for use at [forehash.com](https://forehash.com).

Built by [@BenDiFrancesco](https://twitter.com/BenDiFrancesco).

## Usage

### Requirements

* A web3 enabled browser or browser extension
	* [Brave](https://brave.com/) - Desktop Browser w/ MetaMask by default
	* [MetaMask](https://metamask.io/) - Extension for Chrome and Firefox
	* [Cipher](https://www.cipherbrowser.com/) - Web3 enabled mobile browser
* Some Ether to pay for gas fees

### Instructions

1. Navigate to [foreshash.com](https://forehash.com) with a web3 enabled browser and click on "New."
2. Allow Forehash to access web3 when prompted.
3. Enter the text to your prediction, along with the ETH amounf for your refundable deposit.
4. Backup your prediction text when prompted.
5. Reveal your prediction at a date of your choosing to get your deposit back.

Alternatively, if you are writing a smart contract that integrates with Forehash, you can interact with the contracts from using the available [public interface](https://github.com/apbendi/forehash/blob/master/contracts/Bankshot.sol).

## Contract Deployments

Forehash is availbe on mainnet, and also deployed on the Ropsten testnet.

Network | Contract Address
------- | -------------| 
Ropsten | [0xE045Ff2F300D716237F2D95933b38CFE9ED8aF3c](https://ropsten.etherscan.io/address/0xe045ff2f300d716237f2d95933b38cfe9ed8af3c)
Mainnet|[0x8CE87f39C30396FDFe7F25378363307b3ba3002d](https://etherscan.io/address/0x8ce87f39c30396fdfe7f25378363307b3ba3002d)|

## Development

### Requirements

Forehash is built using the Truffle suite of DApp developer tools. In particular, development requires:

* [Truffle](https://truffleframework.com/truffle) v5.0.10 or later
* [Solidity](https://solidity.readthedocs.io/en/v0.5.0/installing-solidity.html) v0.5.0
* [Ganache CLI](https://github.com/trufflesuite/ganache-cli) v6.4.4 or later

The frontend is built with React and [Drizzle](https://truffleframework.com/drizzle). In particular, the following development tools are needed:

* Node v10.8.0 or later
* npm v6.2.0 or later

### Instructions

* Clone the repository

```bash
git clone https://github.com/apbendi/forehash.git
cd forehash
```

* Make copies of the `mneumonic.js-template` file for mainnet and Ropsten. (Note that you don't need to populate the constants in this file unless you are deploying to one of these networks, but the files must exist).

```bash
cp mneumonic.js-template testnet-mneumonic.js
cp mneumonic.js-template mainnet-mneumonic.js
```

* In a seperate terminal, run `ganache-cli`
* Migrate the contracts using Truffle

```bash
truffle migrate
```

* Build and run the frontend locally

```bash
cd app
npm start
```

* Open a web3 enabled browser and navigate to `localhost:3000`

### Contributions

Contributions to the frontend are welcome! In particular, the current design uses the vanilla Bootstrap theme, and help improving it would be appreciated. Simply fork the project, create a new branch from master, and open a PR.

The smart contracts are deployed, and therefore considered finalized, unless I decide to upgrade Forehash completely in the future.

## License

Forehash is made available under the [MIT](LICENSE.txt) license.

Copyright (2019) Ben DiFrancesco.
