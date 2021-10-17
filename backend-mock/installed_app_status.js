const util = require("./util");

const appStatus = () => {
  console.log("sending installed_app_status");
  util.sendSSE("installed_app_status", [
    { id: "specter", name: "Specter Desktop", status: "online" },
    { id: "sphinx", name: "Sphinx Chat", status: "online" },
    { id: "btc-pay", name: "BTCPay Server", status: "offline" },
    { id: "rtl", name: "Ride the Lightning", status: "online" },
    { id: "bos", name: "Balance of Satoshis", status: "offline" },
  ]);

  setTimeout(() => {
    util.sendSSE("installed_app_status", [
      { id: "specter", name: "Specter Desktop", status: "offline" },
    ]);
  }, 5000);
};

module.exports = { appStatus };
