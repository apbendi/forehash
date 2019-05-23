import Bankshot from "./contracts/Bankshot.json";

const options = {
  web3: {
    block: false,
    fallback: {
      type: "ws",
      url: "ws://127.0.0.1:9545",
    },
  },
  contracts: [Bankshot],
  events: {
    Bankshot: [
                {
                  eventName: "Revelation", 
                  eventOptions: {fromBlock: 0},
                },
              ],
  },
  polls: {
    accounts: 1500,
  },
};

export default options;
