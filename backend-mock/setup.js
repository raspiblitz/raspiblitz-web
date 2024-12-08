const express = require("express");
const router = express.Router();

// setupPhase is "done" if setup is finished, otherwise step in the setup process
router.get("/status", function (req, res) {
  console.info(`call to ${req.originalUrl}`);

  // FINAL
  /*    res.status(200).send(
              JSON.stringify({
                  setupPhase: "",
                  state: "waitfinal",
                  message: "Node Running",
                  initialsync: "",
              }),
          );*/

  // SETUP (combine with "setup-start-info" call)
  // further these screens will be reached during the setup: FORMAT, INPUT_NODENAME, LIGHTNING, INPUT_A, INPUT_B, INPUT_C, START_DONE
  /*  res.status(200).send(
        JSON.stringify({
          setupPhase: "setup",
          state: "waitsetup",
          message: "Node Running",
          initialsync: "",
        }),
      );*/

  // MIGRATION (combine with "setup-start-info" call)
  /*    res.status(200).send(
              JSON.stringify({
                  setupPhase: "migration",
                  state: "waitsetup",
                  message: "Node Running",
                  initialsync: "",
              }),
          );*/

  // RECOVERY (combine with "setup-start-info" call)
  /*    res.status(200).send(
              JSON.stringify({
                  setupPhase: "recovery",
                  state: "waitsetup",
                  message: "Node Running",
                  initialsync: "",
              }),
          );*/

  // SYNC
  /*    res.status(200).send(
              JSON.stringify({
                  setupPhase: "",
                  state: "ready",
                  message: "Node Running",
                  initialsync: "running",
              }),
          );*/

  // WAIT
  /*    res.status(200).send(
              JSON.stringify({
                  setupPhase: "setup",
                  state: "wait",
                  message: "This is a message",
                  initialsync: "",
              }),
          );*/

  // Dashboard
  res.status(200).send(
    JSON.stringify({
      setupPhase: "done",
      state: "waitfinal",
      message: "Node Running",
      initialsync: "",
    }),
  );
});

router.get("/setup-start-info", function (req, res) {
  console.info(`call to ${req.originalUrl}`);
  // set 'setupPhase' something else than "done" to route to setup

  // SETUP
  res.status(200).send(
    JSON.stringify({
      setupPhase: "setup",
      hddGotBlockchain: "0",
      hddGotMigrationData: null,
      migrationMode: null,
    }),
  );

  // MIGRATION
  /*    res.status(200).send(
              JSON.stringify({
                  setupPhase: "migration",
                  hddGotBlockchain: "1",
                  hddGotMigrationData: "umbrel",
                  migrationMode: "normal", // or "outdatedLightning" to get info-text
              }),
          );*/

  // RECOVERY
  /*    res.status(200).send(
              JSON.stringify({
                  setupPhase: "recovery",
                  hddGotBlockchain: "0",
                  hddGotMigrationData: null,
                  migrationMode: null,
              }),
          );*/
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
