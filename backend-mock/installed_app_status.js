const util = require("./util");

const appStatus = () => {
  console.info("sending installed_app_status");
  util.sendSSE("installed_app_status", [
    {
      id: "specter",
      status: "online",
      address: "http://192.168.0.1",
      hiddenService: "blablablabla.onion",
    },
    {
      id: "btcpayserver",
      status: "offline",
      address: "http://192.168.0.1",
      hiddenService: "blablablabla.onion",
    },
    {
      id: "rtl",
      status: "online",
      address: "http://192.168.0.1",
      hiddenService: "blablablabla.onion",
    },
    {
      id: "lnbits",
      status: "online",
      address: "http://192.168.0.1",
      hiddenService: "blablablabla.onion",
    },
  ]);

  setTimeout(() => {
    util.sendSSE("installed_app_status", [
      {
        id: "specter",
        status: "offline",
        address: "http://192.168.0.1",
        hiddenService: "blablablabla.onion",
      },
    ]);
  }, 5000);
};

module.exports = { appStatus };
