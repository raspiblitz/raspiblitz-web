const express = require("express");
const cors = require("cors");
const btcInfo = require("./btc_info");
const lnInfoLite = require("./ln_info_lite");
const installedAppStatus = require("./installed_app_status");
const systemInfo = require("./system_info");
const hardwareInfo = require("./hardware_info");
const walletBalance = require("./wallet_balance");
const util = require("./util");
const setup = require("./setup");
const system = require("./system");
const apps = require("./apps");
const lightning = require("./lightning");

require("dotenv").config();

const app = express();
app.use(cors(), express.json());
app.use("/api/v1/system", system);
app.use("/api/v1/setup", setup);
app.use("/api/v1/apps", apps);
app.use("/api/v1/lightning", lightning);

const PORT = 8000;

app.listen(PORT, () => {
  console.info(`Server listening on http://localhost:${PORT}`);
});

// app.use('/', express.static('../build'));

/**
 * Main SSE Handler
 */
const eventsHandler = (request, response) => {
  console.info("call to /api/sse/subscribe");
  const headers = {
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
    "Cache-Control": "no-cache",
  };
  response.writeHead(200, headers);

  const data = `data: null\n\n`;

  response.write(data);

  const id = util.currClientId++;

  util.clients.push({
    id,
    response,
  });

  systemInfo.systemInfo();
  hardwareInfo.hardwareInfo();
  btcInfo.btcInfo();
  lnInfoLite.lnInfoLite();
  installedAppStatus.appStatus();
  walletBalance.walletBalance();

  request.on("close", () => {
    // do nothing
  });
};

/**
 * SSE Handler call
 */
app.get("/api/sse/subscribe", eventsHandler);
