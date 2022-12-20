const util = require("./util");

const appStatus = () => {
  console.info("sending installed_app_status");
  util.sendSSE("installed_app_status", [
    {
      id: "rtl",
      installed: false,
      status: "offline",
      version: "v1.0.0",
      error: "",
    },
    {
      id: "thunderhub",
      installed: false,
      version: "v1.0.0",
      status: "offline",
      error: "",
    },
    {
      id: "lnbits",
      installed: false,
      version: "v1.0.0",
      status: "offline",
      error: "",
    },
    {
      id: "btc-rpc-explorer",
      installed: false,
      version: "v1.0.0",
      status: "offline",
      error: "",
    },
    {
      id: "btcpayserver",
      installed: false,
      version: "v1.0.0",
      status: "offline",
      error: "",
    },
    {
      id: "mempool",
      installed: false,
      version: "v1.0.0",
      status: "offline",
      error: "",
    },
  ]);
};

module.exports = { appStatus };
