const express = require("express");
const router = express.Router();
const util = require("./util");

router.post("/install/:id", (req, res) => {
  console.info("call to /api/v1/apps/install for app", req.params.id);
  // send information that btc-pay is currently installing
  util.sendSSE("install", { id: "mempool" });
  setTimeout(() => {
    installApp();
  }, 5000);
  res.status(200).send();
});

router.post("/uninstall/:id", (req, res) => {
  console.info("call to /api/v1/apps/uninstall for app", req.params.id);
  // TODO: Create the same example as install but with uninstall
  res.status(200).send();
});

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
module.exports = router;
