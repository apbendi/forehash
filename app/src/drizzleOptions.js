import Bankshot from "./contracts/Bankshot.json";
import infuraId from "./infura-info.js";


var fallbackURL = "";
let isLocalDev = window.location.href.includes("localhost") || window.location.href.includes("127.0.0.1");

if (isLocalDev) {
  fallbackURL = "ws://127.0.0.1:8545";
} else {
  fallbackURL = "wss://ropsten.infura.io/ws/v3/" + infuraId;
}

const options = {
  web3: {
    block: false,
    fallback: {
      type: "ws",
      url: fallbackURL,
    },
  },
  contracts: [Bankshot],
  events: {
    Bankshot: [
                {
                  eventName: "Revelation",
                  eventOptions: {fromBlock: 0},
                },
                {
                  eventName: "Publication",
                  eventOptions: {fromBlock: 0},
                }
              ],
  },
  polls: {
    accounts: 1500,
  },
};

export default options;
