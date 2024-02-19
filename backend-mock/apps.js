const express = require("express");
const router = express.Router();
const util = require("./sse/util");

router.post("/install/:id", (req, res) => {
  console.info("call to /api/v1/apps/install for app", req.params.id);
  // send information that btc-pay is currently installing
  util.sendSSE("install", {
    id: "rtl",
    mode: "on",
    result: "running",
    details: "",
  });
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

router.get("/status_advanced/electrs", (req, res) => {
  console.info("call to /api/v1/apps/status_advanced/electrs");
  res.status(200).send(
    JSON.stringify({
      version: "v0.10.2",
      localIP: "192.168.0.1",
      publicIP: "127.0.0.1",
      portTCP: "50001",
      portSSL: "50002",
      TORaddress: "myTorURL.onion",
      initialSyncDone: true,
    }),
  );
});

const installApp = () => {
  console.info("call to installApp");

  // inform Frontend that app finished installing
  util.sendSSE("install", {
    id: "rtl",
    mode: "on",
    result: "win",
    httpsForced: "0",
    httpsSelfsigned: "1",
    details: "OK",
  });

  util.sendSSE("installed_app_status", [
    { id: "lnbits", installed: false, status: "offline", error: "" },
    { id: "thunderhub", installed: false, status: "offline", error: "" },
    { id: "btcpayserver", installed: false, status: "offline", error: "" },
    { id: "mempool", installed: false, status: "offline", error: "" },
    { id: "btc-rpc-explorer", installed: false, status: "offline", error: "" },
    {
      id: "rtl",
      installed: true,
      status: "online",
      address: "http://192.168.1.100:3000",
      httpsForced: "0",
      httpsSelfsigned: "1",
      hiddenService: "4pt2ludsdsdns48dwnd2899rqf63pcdwdwdwh7dwaeukn1w.onion",
      authMethod: "password_b",
      details: {},
      error: "",
    },
  ]);
};
module.exports = router;
