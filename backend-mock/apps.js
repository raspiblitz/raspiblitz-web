const express = require("express");
const router = express.Router();
const util = require("./util");

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
    {
      id: "rtl",
      installed: true,
      status: "online",
      address: "http://192.168.1.100:3000",
      httpsForced: "0",
      httpsSelfsigned: "1",
      hiddenService:
        "4pt2luoyrnzhu3ddbbqvaxky66gusdybrqf63pcdwip7kgwluvgzlaqd.onion",
      authMethod: "password_b",
      details: {},
      error: "",
    },
  ]);
};
module.exports = router;
