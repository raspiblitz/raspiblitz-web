const express = require("express");
const cors = require("cors");
const WebSocket = require("ws");
const btcInfo = require("./sse/btc_info");
const lnInfo = require("./sse/ln_info");
const installedAppStatus = require("./sse/installed_app_status");
const systemInfo = require("./sse/system_info");
const hardwareInfo = require("./sse/hardware_info");
const walletBalance = require("./sse/wallet_balance");
const systemStartupInfo = require("./sse/system_startup_info");
const setup = require("./setup");
const system = require("./system");
const apps = require("./apps");
const lightning = require("./lightning");
const { createServer } = require("node:http");

require("dotenv").config();

const app = express();
const server = createServer(app);

const wss = new WebSocket.Server({ server, path: "/ws" });
let ws = null;

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

server.listen(PORT, () => {
  console.info(`Server listening on http://localhost:${PORT}`);
  console.info(`WebSocket server is running on ws://localhost:${PORT}/ws`);
});

/**
 * Main WebSocket Handler
 */

wss.on("connection", (ws) => {
  this.ws = ws;
  console.info("WebSocket connection established on /ws");

  // Handle incoming messages
  ws.on("message", (message) => {
    console.info(`Received message: ${message}`);
  });

  // Handle errors
  ws.on("error", (error) => {
    console.error("Error occurred:", error);
  });

  // Handle disconnections
  ws.on("close", () => {
    console.info("Client disconnected");
  });

  // Send data from SSE handlers to the client
  const sendData = () => {
    console.info("Sending data to the client");
    systemStartupInfo.systemStartupInfo(ws);
    systemInfo.systemInfo(ws);
    hardwareInfo.hardwareInfo(ws);
    btcInfo.btcInfo(ws);
    lnInfo.lnInfo(ws);
    installedAppStatus.appStatus(ws);
    walletBalance.walletBalance(ws);
  };

  // Send initial data to the client
  sendData();
});

module.exports = { ws };
