const { WebSocketServer } = require("ws");
const btcInfo = require("./sse/btc_info");
const lnInfo = require("./sse/ln_info");
const installedAppStatus = require("./sse/installed_app_status");
const systemInfo = require("./sse/system_info");
const hardwareInfo = require("./sse/hardware_info");
const walletBalance = require("./sse/wallet_balance");
const systemStartupInfo = require("./sse/system_startup_info");
const util = require("./sse/util");

function attachRealtimeServer(server) {
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
        // Warmup belongs only to this newly authenticated connection.
        const send = (event, data) => util.sendToClient(ws, event, data);
        systemStartupInfo.systemStartupInfo(send);
        systemInfo.systemInfo(send);
        hardwareInfo.hardwareInfo(send);
        btcInfo.btcInfo(send);
        lnInfo.lnInfo(send);
        installedAppStatus.appStatus(send);
        walletBalance.walletBalance(send);
      } else {
        ws.close(4401);
      }
    });
    ws.on("close", () => {
      const i = util.clients.indexOf(ws);
      if (i !== -1) util.clients.splice(i, 1);
    });
  });
  return wss;
}

module.exports = { attachRealtimeServer };
