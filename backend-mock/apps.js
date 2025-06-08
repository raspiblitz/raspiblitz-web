const express = require("express");
const router = express.Router();
const util = require("./sse/util");
const { baseAppStatusData, createAppStateUpdateMessage } = require("./shared-data");

router.post("/install/:id", (req, res) => {
  console.info("call to /api/apps/install for app", req.params.id);
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
  console.info("call to /api/apps/uninstall for app", req.params.id);
  // TODO: Create the same example as install but with uninstall
  res.status(200).send();
});

router.get("/status", (req, res) => {
  console.info("call to /api/apps/status");
  const appStatusData = createAppStateUpdateMessage();
  res.status(200).json(appStatusData.message);
});

router.get("/status_advanced/electrs", (req, res) => {
  console.info("call to /api/apps/status_advanced/electrs");
  res.status(200).send(
    JSON.stringify({
      version: "v0.10.2",
      localIP: "127.0.0.1",
      publicIP: "127.0.0.1",
      portTCP: "50001",
      portSSL: "50002",
      // not a real onion address
      TORaddress:
        "gr7l4dtesftz3t48p2nhbpzwhs5fm2t4fgnavh9v0tdvp80z2jzg5xw1@rzqwnilfge21ma7gr9v40zf7btz4u8rmz7353ua4vtl77yb328vqfl6369az0nv8.onion",
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

  util.sendSSE("app_state_update_message", {
    state: "success", 
    message: {
      data: [
        {
          id: "albyhub",
          version: "1.17.0",
          installed: false,
          configured: false,
          status: "offline",
          local_ip: null,
          http_port: null,
          https_port: null,
          https_forced: null,
          https_self_signed: null,
          hidden_service: null,
          address: null,
          auth_method: null,
          details: null,
          error: null
        },
        {
          id: "btcpayserver",
          version: "v2.2.1",
          installed: false,
          configured: false,
          status: "offline",
          local_ip: null,
          http_port: null,
          https_port: null,
          https_forced: null,
          https_self_signed: null,
          hidden_service: null,
          address: null,
          auth_method: null,
          details: null,
          error: null
        },
        {
          id: "btc-rpc-explorer",
          version: "",
          installed: false,
          configured: false,
          status: "offline",
          local_ip: null,
          http_port: null,
          https_port: null,
          https_forced: null,
          https_self_signed: null,
          hidden_service: null,
          address: null,
          auth_method: null,
          details: null,
          error: null
        },
        {
          id: "electrs",
          version: "v0.10.6",
          installed: true,
          configured: true,
          status: "online",
          local_ip: "192.168.178.104",
          http_port: null,
          https_port: null,
          https_forced: false,
          https_self_signed: false,
          hidden_service: null,
          address: "http://192.168.178.104:None",
          auth_method: "none",
          details: null,
          error: null
        },
        {
          id: "jam",
          version: "0.3.0",
          installed: false,
          configured: false,
          status: "offline",
          local_ip: null,
          http_port: null,
          https_port: null,
          https_forced: null,
          https_self_signed: null,
          hidden_service: null,
          address: null,
          auth_method: null,
          details: null,
          error: null
        },
        {
          id: "lnbits",
          version: "v1.0.0",
          installed: true,
          configured: false,
          status: "online",
          local_ip: "127.0.0.1",
          http_port: "5000",
          https_port: "5001",
          https_forced: true,
          https_self_signed: true,
          hidden_service: "abc.onion",
          address: "https://127.0.0.1:5001",
          auth_method: "/wallet?usr=abcde",
          details: null,
          error: null
        },
        {
          id: "mempool",
          version: "v3.2.1",
          installed: false,
          configured: false,
          status: "offline",
          local_ip: null,
          http_port: null,
          https_port: null,
          https_forced: null,
          https_self_signed: null,
          hidden_service: null,
          address: null,
          auth_method: null,
          details: null,
          error: null
        },
        {
          id: "rtl",
          version: "v0.15.2",
          installed: true,
          configured: true,
          status: "online",
          local_ip: "127.0.0.1",
          http_port: "3000",
          https_port: null,
          https_forced: false,
          https_self_signed: true,
          hidden_service: "abc.onion",
          address: "http://127.0.0.1:3000",
          auth_method: "password_b",
          details: null,
          error: null
        },
        {
          id: "thunderhub",
          version: "v0.13.31",
          installed: false,
          configured: false,
          status: "offline",
          local_ip: null,
          http_port: null,
          https_port: null,
          https_forced: null,
          https_self_signed: null,
          hidden_service: null,
          address: null,
          auth_method: null,
          details: null,
          error: null
        }
      ],
      errors: [],
      timestamp: Math.floor(Date.now() / 1000)
    }
  });
};
module.exports = router;
