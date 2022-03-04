const util = require("./util");

const installApp = () => {
  console.info("call to installApp");
  util.sendSSE("installed_app_status", [
    {
      id: "specter",
      status: "online",
      address: "http://192.168.0.1",
      hiddenService: "blablablabla.onion",
    },
    {
      id: "btc-pay",
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
    {
      id: "mempool",
      status: "online",
      address: "https://192.168.0.599:4081/",
      hiddenService: "blablablabla.onion",
    },
  ]);
  // inform Frontend that no apps are currently installing
  util.sendSSE("install", { id: null });
};
module.exports = { installApp };
