const express = require("express");
const router = express.Router();

// setupPhase is "done" if setup is finished, otherwise step in the setup process
router.get("/status", function (req, res) {
  console.info(`call to ${req.originalUrl}`);
  res.status(200).send(
    JSON.stringify({
      // send something else than "done" to route to setup
      setupPhase: "recovery",
      state: "waitsetup",
      message: "",
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
  res.send("STATUS");
});

module.exports = router;
