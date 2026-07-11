const express = require("express");
const cors = require("cors");
const { WebSocketServer } = require("ws");
const btcInfo = require("./sse/btc_info");
const lnInfo = require("./sse/ln_info");
const installedAppStatus = require("./sse/installed_app_status");
const systemInfo = require("./sse/system_info");
const hardwareInfo = require("./sse/hardware_info");
const walletBalance = require("./sse/wallet_balance");
const systemStartupInfo = require("./sse/system_startup_info");
const util = require("./sse/util");
const setup = require("./setup");
const system = require("./system");
const apps = require("./apps");
const lightning = require("./lightning");

require("dotenv").config();

const app = express();
app.use(
  cors({ credentials: true, origin: "http://localhost:3000" }),
  express.json(),
);
app.get("/index.html", (req, res) => {
  // only to satisfy playwright webserver check
  res.send("ok");
});
app.use("/api/system", system);
app.use("/api/setup", setup);
app.use("/api/apps", apps);
app.use("/api/lightning", lightning);

const PORT = 8000;

const server = app.listen(PORT, () => {
  console.info(`Server listening on http://localhost:${PORT}`);
});

// app.use('/', express.static('../build'));

/**
 * WebSocket server for realtime mock data
 */
const wss = new WebSocketServer({ server, path: "/api/ws" });
wss.on("connection", (ws) => {
  console.info("ws connection to /api/ws");
  let authed = false;
  ws.on("message", (raw) => {
    if (authed) return; // server-push only; ignore further client messages
    let msg;
    try {
      msg = JSON.parse(raw.toString());
    } catch {
      ws.close(4401);
      return;
    }
    if (msg && msg.type === "auth" && msg.token) {
      authed = true;
      util.clients.push(ws);
      // send the initial snapshot of every event
      systemStartupInfo.systemStartupInfo();
      systemInfo.systemInfo();
      hardwareInfo.hardwareInfo();
      btcInfo.btcInfo();
      lnInfo.lnInfo();
      installedAppStatus.appStatus();
      walletBalance.walletBalance();
    } else {
      ws.close(4401);
    }
  });
  ws.on("close", () => {
    const i = util.clients.indexOf(ws);
    if (i !== -1) util.clients.splice(i, 1);
  });
});
