const util = require("./util");

const appStatus = () => {
  console.info("sending installed_app_status");
  util.sendSSE("installed_app_status", [
    { id: "rtl", installed: false, status: "offline", error: "" },
    { id: "thunderhub", installed: false, status: "offline", error: "" },
    { id: "lnbits", installed: false, status: "offline", error: "" },
    { id: "btc-rpc-explorer", installed: false, status: "offline", error: "" },
    { id: "btcpayserver", installed: false, status: "offline", error: "" },
    { id: "mempool", installed: false, status: "offline", error: "" },
  ]);
};

module.exports = { appStatus };
