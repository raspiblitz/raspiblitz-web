/**
 * Connected WebSocket clients.
 * @type {import("ws").WebSocket[]}
 */
let clients = [];

/**
 * Send an event to all connected WebSocket clients.
 * @param {string} event
 * @param {any} data
 */
const sendSSE = (event, data) => {
  const frame = JSON.stringify({ event, data });
  clients.forEach((ws) => {
    // 1 === WebSocket.OPEN
    if (ws.readyState === 1) ws.send(frame);
  });
};

module.exports = { clients, sendSSE };
