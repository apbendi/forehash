import Bankshot from "./contracts/Bankshot.json";
import infuraId from "./infura-info.js";

let fallbackURL = "wss://ropsten.infura.io/ws/v3/" + infuraId;

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
