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
      installed: true,
      version: "v1.0.0",
      status: "offline",
      error: "",
      address: "http://192.168.1.100:3000",
      hiddenService: "4pt2ludsdsdns48dwnd2899rqf63pcdwdwdwh7dwaeukn1w.onion",
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
