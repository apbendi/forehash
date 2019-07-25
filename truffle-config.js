const testnet = require('./testnet-mneumonic');
const mainnet = require('./mainnet-mneumonic');
const path = require("path");
const HDWalletProvider = require("truffle-hdwallet-provider");

module.exports = {
	contracts_build_directory: path.join(__dirname, "app/src/contracts"),
	networks: {
		development: {
			host: "127.0.0.1",
			port: 8545,
			network_id: "*",
		},
		ropsten: {
			network_id: '3',
			gas: 4000000,
			provider: () => {
				return new HDWalletProvider(testnet.mneumonic, "https://ropsten.infura.io/v3/" + testnet.infura_id);
			},
		},
		mainnet: {
			network_id: '1',
			gasPrice: 20000000000,
			timeoutBlocks: 50,
			provider: () => {
				return new HDWalletProvider(mainnet.mneumonic, "https://mainnet.infura.io/v3/" + mainnet.infura_id);
			}
		}
	},
};
