const { WebSocket } = require("ws");

/** @type {import("ws").WebSocket[]} */
const clients = [];

/** Send a warmup event to one authenticated client. */
const sendToClient = (ws, event, data) => {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ event, data }));
  }
};

/** Broadcast subsequent updates to all authenticated clients. */
const sendEvent = (event, data) => {
  for (const ws of clients) sendToClient(ws, event, data);
};

module.exports = { clients, sendToClient, sendEvent };
