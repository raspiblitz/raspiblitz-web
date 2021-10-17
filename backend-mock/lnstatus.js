const util = require("./util");

const lnStatus = () => {
  console.log("call to lnstatus");

  util.sendSSE("lnstatus", {
    channelOnline: 3,
    channelTotal: 4,
    lnVersion: "LND 0.12.1-beta",
    lnStatus: "online",
  });
};

module.exports = { lnStatus };
