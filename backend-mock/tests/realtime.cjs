const assert = require("node:assert/strict");
const { once } = require("node:events");
const { createServer } = require("node:http");
const { test } = require("node:test");
const { WebSocket } = require("ws");
const { attachRealtimeServer } = require("../realtime");
const { clients, sendEvent } = require("../sse/util");

const expectedEvents = [
  "system_startup_info", "system_info", "hardware_info", "btc_info",
  "ln_info", "app_state_update_message", "wallet_balance",
];

async function fixture(t) {
  const server = createServer();
  const wss = attachRealtimeServer(server);
  const sockets = [];
  t.after(async () => {
    for (const socket of sockets) socket.terminate();
    for (const socket of wss.clients) socket.terminate();
    await new Promise(resolve => wss.close(resolve));
    await new Promise(resolve => server.close(resolve));
    assert.equal(clients.length, 0);
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  return async () => {
    const ws = new WebSocket(`ws://127.0.0.1:${server.address().port}/api/ws`);
    sockets.push(ws);
    const frames = [];
    ws.on("message", raw => frames.push(JSON.parse(raw.toString())));
    await once(ws, "open");
    return { ws, frames };
  };
}

async function receiveUntil(client, predicate) {
  while (!predicate()) {
    await once(client.ws, "message", { signal: AbortSignal.timeout(3000) });
  }
}

test("only the new client receives warmup; subsequent updates reach both clients", { timeout: 10000 }, async t => {
  const connect = await fixture(t);
  const first = await connect();
  first.ws.send(JSON.stringify({ type: "auth", token: "mock-token" }));
  await receiveUntil(first, () => first.frames.length === expectedEvents.length);
  assert.deepEqual(first.frames.map(frame => frame.event), expectedEvents);

  const second = await connect();
  second.ws.send(JSON.stringify({ type: "auth", token: "mock-token" }));
  await receiveUntil(second, () => second.frames.length === expectedEvents.length);
  assert.deepEqual(second.frames.map(frame => frame.event), expectedEvents);

  // A broadcast is an ordering barrier: any mistakenly replayed snapshots on
  // the first connection arrive before this update.
  sendEvent("btc_info", { blocks: 99 });
  await Promise.all([first, second].map(client => receiveUntil(client,
    () => client.frames.some(frame => frame.data.blocks === 99))));
  for (const client of [first, second]) {
    assert.equal(client.frames.length, expectedEvents.length + 1);
    assert.deepEqual(client.frames.at(-1), { event: "btc_info", data: { blocks: 99 } });
  }

  const serverClosed = once(clients[0], "close");
  first.ws.close();
  await Promise.all([once(first.ws, "close"), serverClosed]);
  assert.equal(clients.length, 1);
  sendEvent("btc_info", { blocks: 100 });
  await receiveUntil(second, () => second.frames.at(-1).data.blocks === 100);
});

test("rejects malformed authentication without sending snapshots", { timeout: 10000 }, async t => {
  const connect = await fixture(t);
  for (const frame of ["invalid json", "null", "{}", JSON.stringify({ type: "auth", token: "" })]) {
    const client = await connect();
    client.ws.send(frame);
    const [code] = await once(client.ws, "close");
    assert.equal(code, 4401);
    assert.deepEqual(client.frames, []);
  }
});
