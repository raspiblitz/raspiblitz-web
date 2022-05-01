const express = require("express");
const router = express.Router();

// setupPhase is "done" if setup is finished, otherwise step in the setup process
router.get("/status", function (req, res) {
  console.info(`call to ${req.originalUrl}`);
  res.status(200).send(
    JSON.stringify({
      setupPhase: "done",
      state: "ready",
      message: "Node Running",
      initialsync: "",
    })
  );
});

router.get("/setup-start-info", function (req, res) {
  console.info(`call to ${req.originalUrl}`);
  res.status(200).send(
    JSON.stringify({
      // send something else than "done" to route to setup
      setupPhase: "recovery",
      hddGotBlockchain: "0",
      hddGotMigrationData: null,
      migrationMode: null,
    })
  );
});

router.post("/setup-start-done", function (req, res) {
  console.info(`call to ${req.originalUrl}`);
  res.send("STATUS");
});

router.get("/setup-final-info", function (req, res) {
  console.info(`call to ${req.originalUrl}`);
  res.send("STATUS");
});

router.get("/setup-final-done", function (req, res) {
  console.info(`call to ${req.originalUrl}`);
  res.send("STATUS");
});

router.get("/shutdown", function (req, res) {
  console.info(`call to ${req.originalUrl}`);
  res.send("STATUS");
});

router.post("/setup-sync-info", function (req, res) {
  console.info(`call to ${req.originalUrl}`);
  res.send(
    JSON.stringify({
      initialsync: "running",
      btc_default: "bitcoin",
      btc_default_ready: "1",
      btc_default_sync_percentage: "100.00",
      btc_default_peers: "24",
      system_count_start_blockchain: "1",
      ln_default: "lnd",
      ln_default_ready: "1",
      ln_default_locked: "1",
      system_count_start_lightning: "1",
    })
  );
});

module.exports = router;
