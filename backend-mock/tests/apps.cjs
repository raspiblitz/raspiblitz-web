const assert = require("node:assert/strict");
const { once } = require("node:events");
const { createServer } = require("node:http");
const { test } = require("node:test");
const express = require("express");
const { WebSocket } = require("ws");
process.env.MOCK_APP_FAILURE_ONCE = "mempool";
const apps = require("../apps");
const { attachRealtimeServer } = require("../realtime");

// Real HTTP requests and authenticated WebSocket messages, no handler mocking.
test("app routes preserve IDs, reject concurrent operations, and stream failure/retry/uninstall", { timeout: 15000 }, async t => {
  const app = express();
  app.use(express.json());
  app.use("/api/apps", apps);
  const server = createServer(app);
  const wss = attachRealtimeServer(server);
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const base = `http://127.0.0.1:${server.address().port}`;
  const ws = new WebSocket(`${base.replace("http", "ws")}/api/ws`);
  const frames = [];
  ws.on("message", raw => frames.push(JSON.parse(String(raw))));
  t.after(async () => {
    ws.terminate();
    for (const client of wss.clients) client.terminate();
    await new Promise(resolve => wss.close(resolve));
    await new Promise(resolve => server.close(resolve));
  });
  await once(ws, "open");
  ws.send(JSON.stringify({ type: "auth", token: "test-token" }));
  const receiveUntil = async predicate => {
    while (!predicate()) await once(ws, "message", { signal: AbortSignal.timeout(4000) });
  };
  await receiveUntil(() => frames.some(frame => frame.event === "app_state_update_message"));
  const post = (path, body) => fetch(`${base}/api/apps/${path}`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: body === undefined ? undefined : JSON.stringify(body),
  });
  assert.equal((await post("install/unknown")).status, 404);
  assert.equal((await post("uninstall", { app_id: "mempool" })).status, 422);
  assert.equal((await post("install/mempool")).status, 200);
  assert.equal((await post("install/rtl")).status, 423);
  await receiveUntil(() => frames.some(frame => frame.event === "app_manage_message" && frame.data.state === "finished"));
  let events = frames.filter(frame => frame.event === "app_manage_message").map(frame => frame.data);
  assert.deepEqual(events.map(event => event.state), ["initiated", "running", "failure", "finished"]);
  assert.ok(events.every(event => event.id === "mempool" && event.mode === "on"));
  assert.equal(events[2].message.error_code, "mock_disk_full");
  assert.equal(events[2].message.report.reason, "Not enough space for installation");
  frames.length = 0;
  assert.equal((await post("install/mempool")).status, 200);
  await receiveUntil(() => frames.some(frame => frame.event === "app_manage_message" && frame.data.state === "finished"));
  const status = await (await fetch(`${base}/api/apps/status`)).json();
  assert.equal(status.data.find(app => app.id === "mempool").installed, true);
  frames.length = 0;
  assert.equal((await post("uninstall", { app_id: "mempool", keep_data: true })).status, 200);
  await receiveUntil(() => frames.some(frame => frame.event === "app_manage_message" && frame.data.state === "finished"));
  events = frames.filter(frame => frame.event === "app_manage_message").map(frame => frame.data);
  assert.deepEqual(events.map(event => event.state), ["initiated", "running", "success", "finished"]);
  assert.ok(events.every(event => event.id === "mempool" && event.mode === "off"));
  const finalStatus = await (await fetch(`${base}/api/apps/status`)).json();
  assert.equal(finalStatus.data.find(app => app.id === "mempool").installed, false);
});
