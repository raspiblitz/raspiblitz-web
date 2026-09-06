const express = require("express");
const router = express.Router();
const util = require("./sse/util");
const { baseAppStatusData, createAppStateUpdateMessage } = require("./shared-data");

// Optional deterministic failure for browser tests; normal mock installs succeed.
const failOnceFor = process.env.MOCK_APP_FAILURE_ONCE;
let failureConsumed = false;
let managingApp = false;

function manageApp(res, id, mode) {
  const app = baseAppStatusData.find((item) => item.id === id);
  if (!app) return res.status(404).json({ detail: "Unknown app" });
  if (managingApp) return res.status(423).json({ detail: "An app operation is already running" });
  if (app.installed === (mode === "on")) {
    return res.status(400).json({ detail: mode === "on" ? "App already installed" : "App not installed" });
  }
  managingApp = true;
  const fail = id === failOnceFor && !failureConsumed;
  if (fail) failureConsumed = true;
  const send = (state, message = null) => util.sendEvent("app_manage_message", { id, mode, state, message });
  send("initiated");
  setTimeout(() => send("running", mode === "on" ? "Installing app" : "Uninstalling app"), 100);
  setTimeout(() => {
    if (fail) {
      send("failure", {
        detail: "Mock disk full",
        error_code: "mock_disk_full",
        report: { reason: "Not enough space for installation" },
      });
    } else {
      app.installed = mode === "on";
      app.configured = app.installed;
      app.status = app.installed ? "online" : "offline";
      send("success", mode === "on" ? "App installed" : "App uninstalled");
      util.sendEvent("app_state_update_message", createAppStateUpdateMessage());
    }
    managingApp = false;
    send("finished");
  }, 1500);
  res.status(200).send();
}

router.post("/install/:id", (req, res) => manageApp(res, req.params.id, "on"));
router.post("/uninstall", (req, res) => {
  if (typeof req.body?.keep_data !== "boolean") return res.status(422).json({ detail: "keep_data must be a boolean" });
  return manageApp(res, req.body.app_id, "off");
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

module.exports = router;
