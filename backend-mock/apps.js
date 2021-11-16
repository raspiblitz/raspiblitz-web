const util = require("./util");

const installApp = () => {
  console.info("call to installApp");
  util.sendSSE("apps", [
    {
      id: "btc-pay",
      name: "BTCPay Server",
      description:
        "Accept Bitcoin payments. Free, open-source & self-hosted, Bitcoin payment processor",
      installed: true,
      address: "https://192.168.0.599:4081/",
      hiddenService: "blablablabla.onion",
    },
  ]);
  // inform Frontend that no apps are currently installing
  util.sendSSE("install", { id: null });
};
module.exports = { installApp };
