const util = require("./util");

const balance = () => {
  console.log("call to balance");

  util.sendSSE("balance", {
    onchainBalance: 0.00000001,
    lnBalance: 1.003232,
  });
};

module.exports = { balance };
