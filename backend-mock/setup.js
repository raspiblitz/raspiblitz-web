const express = require("express");
const router = express.Router();

// setupPhase is "done" if setup is finished, otherwise step in the setup process
router.get("/status", function (req, res) {
  console.info(`call to ${req.originalUrl}`);
  // res.status(200).send(
  //   JSON.stringify({
  //     setupPhase: "done",
  //     state: "waitfinal",
  //     message: "Node Running",
  //     initialsync: "",
  //   }),
  // );

  // basic setup
  res.status(200).send(
    JSON.stringify({
      setupPhase: "",
      state: "waitsetup",
      message: "Node Running",
      initialsync: "",
    }),
  );

  // Setupscreen
  // res.status(200).send(
  //   JSON.stringify({
  //     setupPhase: "",
  //     state: "waitfinal",
  //     message: "Node Running",
  //     initialsync: "",
  //   })
  // );

  // Syncscreen
  // res.status(200).send(
  //   JSON.stringify({
  //     setupPhase: "",
  //     state: "ready",
  //     message: "Node Running",
  //     initialsync: "running",
  //   })
  // );
});

router.get("/setup-start-info", function (req, res) {
  console.info(`call to ${req.originalUrl}`);
  res.status(200).send(
    JSON.stringify({
      // send something else than "done" to route to setup
      setupPhase: "setup",
      hddGotBlockchain: "0",
      hddGotMigrationData: null,
      migrationMode: null,
    }),
  );
});

router.post("/setup-start-done", function (req, res) {
  console.info(`call to ${req.originalUrl}`);
  res.send("STATUS");
});

router.get("/setup-final-info", function (req, res) {
  console.info(`call to ${req.originalUrl}`);
  res.send(
    JSON.stringify({
      seedwordsNEW:
        "Never, gonna, give, you, up, Never, gonna, let, you, down, Never, gonna, run, around, and, desert, you, Never, gonna, make, you, cry, happy, day",
    }),
  );
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
  res.status(200).send(
    JSON.stringify({
      initialsync: "",
      btc_default: "1",
      btc_default_ready: "1",
      btc_default_sync_percentage: "20",
      btc_default_peers: "3",
      system_count_start_blockchain: "1",
      ln_default: "1",
      ln_default_ready: "1",
      ln_default_locked: "1",
      system_count_start_lightning: "3",
    }),
  );
});

module.exports = router;
